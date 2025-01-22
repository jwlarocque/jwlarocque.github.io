<script lang="ts">
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let nameSvgSvg: SVGSVGElement;
	let nameSvg: SVGElement;

	type Boid = {
		id: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
		gx: number;
		gy: number;
		endurance: number;
		target_x: number;
		target_y: number;
		roosting: boolean;
		startle: number;
	};
	let boids: Boid[] = [];
	const ADJACENTS = [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	const NUM_BOIDS = 1000;
	// _2 values are squared distances to avoid sqrt calls
	const MIN_SPEED_2 = 0.5;
	const MAX_SPEED_2 = 2;
	const EDGE_FORCE = 0.01;
	const AVOID_RANGE_2 = 100;
	const AVOID_FORCE = 0.000016;
	const ALIGN_RANGE_2 = 3600;
	const ALIGN_RANGE = Math.sqrt(ALIGN_RANGE_2);
	const GRID_SIZE = 60;
	const ALIGN_FORCE = 0.0035;
	const FLOCK_FORCE = 0.00014;
	const MAX_ENDURANCE = 400;
	const ENDURANCE_RANDOMNESS = 0.2;
	const ENDURANCE_DECAY = 0.1;
	const ROOST_SNAP = 1;
	const MAX_ROOST_FORCE = 0.00008;
	const CURSOR_FORCE = 0.001;
	const STARTLE_RANGE_2 = 10;
	const CURSOR_STARTLE_PROBABILITY = 1.0;
	const RANDOM_STARTLE_PROBABILITY = 0.000003;
	const STARTLE_DECAY = 0.01;
	const STARTLE_THRESHOLD = 1;
	const STARTLE_INIT_MULTI = 1.2;
	const STARTLEABLE_ENDURANCE = 0.9;
	const STARTLE_CYCLE_MS = 12000;

	let mouse_x = 0;
	let mouse_y = 0;

	let start_timestamp = 0;
	let last_frame_time = 0;
	let delta = 0;

	function randEndurance() {
		return Math.random() * (MAX_ENDURANCE * ENDURANCE_RANDOMNESS) + MAX_ENDURANCE * (1 - ENDURANCE_RANDOMNESS);
	}

	// TODO: this function is a bit out of control
	function boidStep(timestamp: number) {
		if (!ctx) return;
		// transparent fill gives boids a "trail" effect
		ctx.fillStyle = "rgba(238, 242, 243, 0.25)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';

		if (!start_timestamp) {
			start_timestamp = timestamp;
		}
		delta = timestamp - last_frame_time;
		last_frame_time = timestamp;
		// ctx.clearRect(10, 20, 100, 100); // TODO: remove debug
		// ctx.fillText(`frametime: ${delta}`, 10, 20); // TODO: remove debug
		delta = delta / 10;
		if (delta > 5) {delta = 5} else if (delta < 1) {delta = 1;}

		// global takeoff direction to coordinate startled boids
		let takeoff_x = Math.cos(timestamp / 1000) * 0.2;
		let takeoff_y = Math.sin(timestamp / 1000) * 0.2;
		// vary startle probability over time so that all boids periodically return to their roost/target
		// (this prob intentionally goes negative to guarantee there will be no startles)
		let startle_prob = Math.sin((timestamp - start_timestamp) / STARTLE_CYCLE_MS - Math.PI * 0.75) * RANDOM_STARTLE_PROBABILITY * delta;
		// ctx.fillText(`startle: ${Math.round(startle_prob * 10000000)}%`, 10, 40); // TODO: remove debug

		// record grid positions for checkerboard proximity optimization
		let grid = new Map<string, Boid[]>();
		for (let i = 0; i < NUM_BOIDS; i++) {
			let gx = Math.floor(boids[i].x / GRID_SIZE);
			let gy = Math.floor(boids[i].y / GRID_SIZE);
			let gi = [gx, gy].toString();
            boids[i].gx = gx;
            boids[i].gy = gy;
			if (!grid.has(gi)) {
				grid.set(gi, []);
			}
			grid.get(gi)?.push(boids[i]);
		}
		for (let i = 0; i < NUM_BOIDS; i++) {
			const boid = boids[i];
			let adjacents = ADJACENTS.map(([dx, dy]) => [boid.gx + dx, boid.gy + dy].toString());
			let mdx = boid.x - mouse_x;
			let mdy = boid.y - mouse_y;
			let dist_2 = mdx * mdx + mdy * mdy;
			if (boid.roosting) {
				// stick to roost/target - I don't know if it's floating point error or what
				// but without this roosting boids drift over time
				boid.x = boid.target_x;
				boid.y = boid.target_y;
				// take off if near mouse, but don't propagate startle
				if (dist_2 < ALIGN_RANGE_2 && Math.random() > (1 - CURSOR_STARTLE_PROBABILITY)) {
					boid.roosting = false;
				}
				// random startle
				else if (Math.random() < startle_prob) {
					boid.roosting = false;
					boid.startle = STARTLE_INIT_MULTI * STARTLE_THRESHOLD; // startle value propagates to nearby boids
				}
				// stop roosting once adjacency startle decays enough
				// (applies a small delay for boids to get going after startle, which looks more natural)
				else if (boid.endurance > STARTLEABLE_ENDURANCE * MAX_ENDURANCE && boid.startle > 0 && boid.startle < STARTLE_THRESHOLD) {
					boid.roosting = false;
				}
				// compute average adjacency startle
				else {
					let startle_a = 0;
					let num_a = 0;
					for (let j = 0; j < adjacents.length; j++) {
						const adjacent = grid.get(adjacents[j]);
						if (adjacent) {
							for (let k = 0; k < adjacent.length; k++) {
								if (boid.id === adjacent[k].id || adjacent[k].roosting) continue;
								const other = adjacent[k];
								const dx = boid.x - other.x;
								const dy = boid.y - other.y;
								const dist2 = dx * dx + dy * dy;
								if (dist2 < STARTLE_RANGE_2) {
									startle_a += other.startle;
									num_a++;
								}
							}
						}
					}
					if (num_a > 0) {
						startle_a /= num_a;
						if (startle_a > STARTLE_THRESHOLD) {
							boid.startle = STARTLE_INIT_MULTI * STARTLE_THRESHOLD;
							boid.roosting = false;
							// takeoff in approximately the global takeoff direction
							// without this the boids rush towards each other and get flung all over the place
							boid.vx = takeoff_x + Math.random() * 0.4 - 0.2;
							boid.vy = takeoff_y + Math.random() * 0.4 - 0.2;
						}
					}
				}
			} else {
				// apply cursor avoid force
				if (dist_2 < ALIGN_RANGE_2) {
					let atan2 = Math.atan2(mdy, mdx);
					let dist = Math.sqrt(dist_2);
					boid.vx += (Math.cos(atan2) * (ALIGN_RANGE - dist) * CURSOR_FORCE * delta);
					boid.vy += (Math.sin(atan2) * (ALIGN_RANGE - dist) * CURSOR_FORCE * delta);
				}
				if (boid.endurance > 0) { // eventually stop flocking and just go straight to roost
					let proximity_x = 0;
					let proximity_y = 0;
					let x_a = 0;
					let y_a = 0;
					let xv_a = 0;
					let yv_a = 0;
					let num_a = 0;
					// sum adjacent positions and velocities
					for (let j = 0; j < adjacents.length; j++) {
						const adjacent = grid.get(adjacents[j]);
						if (adjacent) {
							for (let k = 0; k < adjacent.length; k++) {
								if (boid.id === adjacent[k].id || adjacent[k].roosting) continue;
								const other = adjacent[k];
								const dx = boid.x - other.x;
								const dy = boid.y - other.y;
								const dist2 = dx * dx + dy * dy;
								if (dist2 < AVOID_RANGE_2) {
									proximity_x += dx;
									proximity_y += dy;
								}
								if (dist2 < ALIGN_RANGE_2) {
									x_a += other.x;
									y_a += other.y;
									xv_a += other.vx;
									yv_a += other.vy;
									num_a++;
								}
							}
						}
					}
					if (num_a > 0) {
						// average adjacent positions and velocities
						x_a /= num_a;
						y_a /= num_a;
						xv_a /= num_a;
						yv_a /= num_a;
						// these forces are "applied by" the whole flock (average of adjacents)
						boid.vx += (x_a - boid.x) * FLOCK_FORCE * delta;
						boid.vy += (y_a - boid.y) * FLOCK_FORCE * delta;
						boid.vx += (xv_a - boid.vx) * ALIGN_FORCE * delta;
						boid.vy += (yv_a - boid.vy) * ALIGN_FORCE * delta;
					}
					// avoid forces are applied by each adjacent boid individually
					boid.vx += proximity_x * AVOID_FORCE * delta;
					boid.vy += proximity_y * AVOID_FORCE * delta;
				}
				// push speed towards good range (IRL birds can't fly too slow or fast)
				// This is framerate dependent because the multiplicative effect gets out
				// of hand with large frametime delta.
				let speed2 = boid.vx * boid.vx + boid.vy * boid.vy;
				if (speed2 < MIN_SPEED_2) {
					boid.vx *= 1.1;
					boid.vy *= 1.1;
				} else if (speed2 > MAX_SPEED_2) {
					// slowdown is very small to avoid over-damping
					boid.vx *= 0.99;
					boid.vy *= 0.99;
				}

				boid.endurance = Math.max(0, boid.endurance - ENDURANCE_DECAY * delta);
				boid.startle = Math.max(0, boid.startle - STARTLE_DECAY * delta);
				let target_dx = boid.target_x - boid.x;
				let target_dy = boid.target_y - boid.y;
				// tiredness (desire to return to roost) should only be a strong force when endurance is very low
				let tiredness = ((MAX_ENDURANCE - boid.endurance) / MAX_ENDURANCE) ** 2;
				// when tired, intentionally overdamp so boids can actually get back to roost instead of orbiting
				// again, multiplicative frametime adjustment causes problems when delta is large, so this is framerate dependent
				boid.vx *= (1 - (tiredness * 0.1));
				boid.vy *= (1 - (tiredness * 0.1));
				// force towards roost/target
				boid.vx += target_dx * tiredness * MAX_ROOST_FORCE * delta;
				boid.vy += target_dy * tiredness * MAX_ROOST_FORCE * delta;
				// if tired and close to target, roost and reset endurance
				if (boid.endurance < MAX_ENDURANCE * 0.1) {
					if (Math.abs(target_dx) < ROOST_SNAP && Math.abs(target_dy) < ROOST_SNAP) {
						boid.x = boid.target_x;
						boid.y = boid.target_y;
						boid.vx = 0;
						boid.vy = 0;
						boid.endurance = randEndurance();
						boid.roosting = true;
						boid.startle = 0;
					}
				}
				if (boid.x > canvas.width) {
					boid.vx -= EDGE_FORCE * delta;
				} else if (boid.x < 0) {
					boid.vx += EDGE_FORCE * delta;
				}
				if (boid.y > canvas.height) {
					boid.vy -= EDGE_FORCE * delta;
				} else if (boid.y < 0) {
					boid.vy += EDGE_FORCE * delta;
				}
			}
			boid.x += boid.vx * delta;
			boid.y += boid.vy * delta;
			ctx.beginPath();
			// draw radius set to make letters appear more crisp
			ctx.arc(boid.x, boid.y, 1.6, 0, 2 * Math.PI);
			ctx.fill();
		}
		requestAnimationFrame(boidStep);
	}

	// initialize boids
	$effect(() => {
		let totalLength = nameSvg.getTotalLength();
		let targetsWidth = nameSvgSvg.clientWidth;
		let targetsHeight = nameSvgSvg.clientHeight;
		let targetsBoundingBox = nameSvgSvg.getBoundingClientRect();
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		ctx = canvas.getContext('2d');
		boids = [];
		for (let i = 0; i < NUM_BOIDS; i++) {
			// evenly space boid targets along SVG path
			let target = nameSvg.getPointAtLength(totalLength * i / NUM_BOIDS);
			boids.push({
				id: i,
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: Math.random() * 2 - 1,
				vy: Math.random() * 2 - 1,
				gx: 0,
				gy: 0,
				// vary starting endurance so boids roost for the first time from left to right
				endurance: 0.4 * target.x / 597 * randEndurance(),
				// scale targets to actual SVG size and position
				target_x: target.x / 597 * targetsWidth + targetsBoundingBox.left,
				target_y: target.y / 100 * targetsHeight + targetsBoundingBox.top + window.scrollY,
				roosting: false,
				startle: 0,
			});
		}
		if (ctx) {
			requestAnimationFrame(boidStep);
		}
	});
</script>

<svg bind:this={nameSvgSvg} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597 100" width="597px" height="100px" preserveAspectRatio="xMidYMid meet">
	<title>The text "John LaRocque" rendered with very thin lines. It's invisible until a flock of bird-like "boids" settles upon the letters and outlines them in black dots.</title>
	<path bind:this={nameSvg} d="M 597.1 66.7 C 596.187 68.082 595.186 69.403 594.102 70.655 C 593.003 71.912 591.882 72.995 590.737 73.904 C 590.074 74.432 589.377 74.915 588.65 75.35 C 586.723 76.481 584.607 77.252 582.404 77.627 C 580.95 77.881 579.476 78.006 578 78 C 574.333 78 571.033 76.983 568.1 74.95 C 565.675 73.253 563.642 71.057 562.138 68.508 C 561.765 67.887 561.419 67.251 561.1 66.6 C 559.671 63.654 558.82 60.461 558.591 57.195 C 558.53 56.398 558.499 55.599 558.5 54.8 C 558.486 52.486 558.766 50.18 559.333 47.937 C 559.759 46.279 560.368 44.673 561.15 43.15 C 562.917 39.717 565.3 37 568.3 35 C 571.268 33.027 574.758 31.983 578.322 32.001 C 578.381 32 578.441 32 578.5 32 C 582.033 32 585.25 32.917 588.15 34.75 C 591.05 36.583 593.367 39.05 595.1 42.15 C 596.71 45.052 597.596 48.299 597.684 51.616 C 597.695 51.911 597.7 52.205 597.7 52.5 C 597.7 53.1 597.667 53.6 597.6 54 C 597.561 54.24 597.582 54.125 597.512 54.358 C 597.472 54.49 558.509 54.205 558.509 54.205 M 321.489 46.564 L 343.5 78 M 457.426 49.161 C 457.066 51.086 456.89 53.041 456.9 55 C 456.894 56.673 457.024 58.344 457.287 59.997 C 457.677 62.511 458.475 64.944 459.65 67.2 C 459.876 67.628 460.115 68.049 460.367 68.462 C 462.01 71.221 464.305 73.534 467.05 75.2 C 468.083 75.823 469.172 76.347 470.304 76.765 C 472.61 77.602 475.047 78.02 477.5 78 C 481.167 78 484.417 76.883 487.25 74.65 C 488.09 73.988 488.881 73.267 489.619 72.493 C 491.413 70.592 492.892 68.417 494 66.05 C 495.667 62.55 496.5 58.867 496.5 55 C 496.5 51.133 495.667 47.45 494 43.95 C 492.333 40.45 490.083 37.583 487.25 35.35 C 484.417 33.117 481.167 32 477.5 32 C 477.256 32 477.012 32.004 476.768 32.011 C 473.341 32.079 469.991 33.041 467.05 34.8 C 465.942 35.466 464.905 36.242 463.953 37.116 C 462.21 38.737 460.755 40.642 459.65 42.75 C 458.59 44.763 457.84 46.924 457.426 49.161 M 496.5 32 L 496.5 100 M 310.3 8 L 309.2 8 L 309.2 78 M 353.333 48.305 C 352.766 50.491 352.486 52.742 352.5 55 C 352.499 55.988 352.549 56.976 352.651 57.959 C 352.953 61.101 353.906 64.147 355.45 66.9 C 357.417 70.367 360.1 73.083 363.5 75.05 C 364.608 75.692 365.771 76.233 366.976 76.668 C 369.52 77.57 372.201 78.021 374.9 78 C 375.045 78 375.19 77.999 375.335 77.996 C 379.135 77.974 382.863 76.958 386.15 75.05 C 389.517 73.083 392.183 70.367 394.15 66.9 C 395.076 65.263 395.788 63.514 396.267 61.695 C 396.834 59.509 397.114 57.258 397.1 55 C 397.101 54.012 397.051 53.024 396.949 52.041 C 396.647 48.899 395.694 45.853 394.15 43.1 C 392.183 39.633 389.517 36.917 386.15 34.95 C 385.237 34.416 384.285 33.95 383.302 33.557 C 380.627 32.505 377.775 31.976 374.9 32 C 374.607 32 374.313 32.005 374.02 32.015 C 370.323 32.1 366.707 33.109 363.5 34.95 C 360.1 36.917 357.417 39.633 355.45 43.1 C 354.524 44.737 353.812 46.486 353.333 48.305 M 39.433 48.305 C 38.866 50.491 38.586 52.742 38.6 55 C 38.599 55.988 38.649 56.976 38.751 57.959 C 39.053 61.101 40.006 64.147 41.55 66.9 C 43.517 70.367 46.2 73.083 49.6 75.05 C 50.708 75.692 51.871 76.233 53.076 76.668 C 55.62 77.57 58.301 78.021 61 78 C 61.145 78 61.29 77.999 61.435 77.996 C 65.235 77.974 68.963 76.958 72.25 75.05 C 75.617 73.083 78.283 70.367 80.25 66.9 C 81.176 65.263 81.888 63.514 82.367 61.695 C 82.934 59.509 83.214 57.258 83.2 55 C 83.201 54.012 83.151 53.024 83.049 52.041 C 82.747 48.899 81.794 45.853 80.25 43.1 C 78.283 39.633 75.617 36.917 72.25 34.95 C 71.337 34.416 70.385 33.95 69.402 33.557 C 66.727 32.505 63.875 31.976 61 32 C 60.707 32 60.413 32.005 60.12 32.015 C 56.423 32.1 52.807 33.109 49.6 34.95 C 46.2 36.917 43.517 39.633 41.55 43.1 C 40.624 44.737 39.912 46.486 39.433 48.305 M 264.1 37.1 C 264.729 36.63 265.377 36.185 266.042 35.766 C 266.602 35.412 267.172 35.074 267.75 34.75 C 268.555 34.301 269.389 33.906 270.246 33.567 C 270.969 33.28 271.705 33.024 272.45 32.8 C 273.439 32.506 274.452 32.297 275.477 32.176 C 276.48 32.056 277.49 31.997 278.5 32 C 279.491 31.996 280.482 32.048 281.468 32.156 C 282.46 32.269 283.366 32.443 284.186 32.678 C 284.974 32.896 285.734 33.206 286.45 33.6 C 287.193 34.011 287.889 34.501 288.527 35.062 C 289.341 35.774 290.011 36.636 290.5 37.6 C 291.3 39.2 291.783 40.767 291.95 42.3 C 291.999 42.749 292.043 43.2 292.082 43.65 C 292.155 44.513 292.194 45.253 292.199 45.87 C 292.2 45.913 292.2 45.957 292.2 46 L 292.2 78 M 98.2 78 L 98.2 0 L 98.2 78 M 126.7 46 L 126.7 78 M 98.2 50 C 98.2 46.8 98.917 43.833 100.35 41.1 C 101.783 38.367 103.733 36.167 106.2 34.5 C 108.667 32.833 111.4 32 114.4 32 C 118.933 32 122.117 33.317 123.95 35.95 C 125.012 37.5 125.767 39.24 126.174 41.074 C 126.481 42.391 126.653 43.812 126.692 45.339 C 126.697 45.559 126.7 45.78 126.7 46 M 309.202 46.605 L 320.7 46.6 C 325.233 46.6 329.267 45.883 332.8 44.45 C 334.859 43.634 336.766 42.478 338.442 41.031 C 339.474 40.129 340.399 39.112 341.2 38 C 342.552 36.098 343.474 33.924 343.9 31.629 C 344.174 30.202 344.308 28.753 344.3 27.3 C 344.3 22.967 343.267 19.383 341.2 16.55 C 339.356 14.042 336.912 12.037 334.091 10.72 C 333.667 10.517 333.236 10.327 332.8 10.15 C 330.608 9.274 328.316 8.671 325.977 8.355 C 324.228 8.114 322.465 7.995 320.7 8 L 309.4 8 M 292.2 57 C 292.207 58.64 292.105 60.278 291.896 61.905 C 291.672 63.588 291.324 65.132 290.852 66.536 C 290.576 67.364 290.241 68.17 289.85 68.95 C 288.283 72.05 286.267 74.333 283.8 75.8 C 281.333 77.267 278.7 78 275.9 78 C 273.567 78 271.317 77.55 269.15 76.65 C 266.983 75.75 265.2 74.333 263.8 72.4 C 262.578 70.712 261.889 68.541 261.734 65.888 C 261.711 65.492 261.7 65.096 261.7 64.7 C 261.694 63.671 261.781 62.643 261.96 61.63 C 262.291 59.823 262.937 58.297 263.9 57.05 C 265.367 55.15 267.267 53.783 269.6 52.95 C 271.933 52.117 274.367 51.7 276.9 51.7 C 279.833 51.7 282.633 52.117 285.3 52.95 C 287.967 53.783 290.069 55.246 292.202 56.979 M 222.7 8 L 222.7 78 L 254.7 78 M 445.4 71.9 C 445.156 72.188 444.892 72.459 444.609 72.709 C 444.062 73.2 443.373 73.715 442.542 74.252 C 442.412 74.336 442.281 74.418 442.15 74.5 C 440.697 75.404 438.962 76.199 436.946 76.884 C 436.881 76.906 436.815 76.928 436.75 76.95 C 435.137 77.48 433.465 77.809 431.771 77.93 C 431.148 77.977 430.524 78 429.9 78 C 426.68 78.029 423.492 77.365 420.551 76.053 C 419.884 75.751 419.233 75.417 418.6 75.05 C 415.2 73.083 412.517 70.367 410.55 66.9 C 409.006 64.147 408.053 61.101 407.751 57.959 C 407.649 56.976 407.599 55.988 407.6 55 C 407.586 52.742 407.866 50.491 408.433 48.305 C 408.912 46.486 409.624 44.737 410.55 43.1 C 412.517 39.633 415.2 36.917 418.6 34.95 C 422.021 32.982 425.905 31.963 429.852 32 C 429.868 32 429.884 32 429.9 32 C 431.416 31.994 432.928 32.138 434.415 32.431 C 435.205 32.589 435.985 32.796 436.75 33.05 C 437.685 33.359 438.604 33.713 439.505 34.111 C 440.411 34.514 441.243 34.946 442 35.407 C 442.05 35.438 442.1 35.469 442.15 35.5 C 443.65 36.433 444.733 37.3 445.4 38.1 M 23 8 L 23 83 C 23 88.8 22.233 92.9 20.7 95.3 C 19.525 97.139 17.489 98.274 14.591 98.703 C 13.633 98.839 12.667 98.905 11.7 98.9 C 9.433 98.9 7.333 98.35 5.4 97.25 C 4.628 96.813 3.876 96.34 3.149 95.831 C 2.21 95.171 1.394 94.494 0.7 93.8 M 515 63 L 515 32 M 543.5 64.8 L 543.5 78 L 543.5 32 L 543.5 60 C 543.5 63.133 542.783 66.067 541.35 68.8 C 539.917 71.533 537.983 73.733 535.55 75.4 C 533.117 77.067 530.367 77.9 527.3 77.9 C 526.139 77.909 524.98 77.802 523.84 77.58 C 521.155 77.034 519.142 75.791 517.8 73.85 C 516.889 72.506 516.209 71.018 515.79 69.449 C 515.428 68.149 515.19 66.727 515.077 65.182 C 515.025 64.456 514.999 63.728 515 63 M 174.2 46 L 174.2 78 M 145.7 50.003 L 145.7 32 M 145.7 78 L 145.7 50 C 145.7 46.8 146.417 43.833 147.85 41.1 C 149.283 38.367 151.233 36.167 153.7 34.5 C 156.167 32.833 158.9 32 161.9 32 C 166.433 32 169.617 33.317 171.45 35.95 C 172.512 37.5 173.267 39.24 173.674 41.074 C 173.981 42.391 174.153 43.812 174.192 45.339 C 174.197 45.559 174.2 45.78 174.2 46" vector-effect="non-scaling-stroke" id="object-0" transform="matrix(1, 0, 0, 1, 0, 2.220446049250313e-16)"/>
</svg>
<div id="boidsCanvas">
	<canvas id="canvas" bind:this={canvas} on:mousemove={(e) => { mouse_x = e.offsetX; mouse_y = e.offsetY; }}></canvas>
</div>

<div id="content">
	<div id="nav">
		<h3>Projects</h3>
		/
		<h3 class="deemph"><a href="https://github.com/jwlarocque">GitHub</a></h3>
		/
		<h3 class="deemph"><a href="https://www.linkedin.com/in/jwlarocque/">LinkedIn</a></h3>
		<p id="boids-caption-trigger" class="deemph">ⓘ</p>
		<p id="boids-caption" class="deemph">Craig Reynolds's classic "boids" simulation, with additional behavior. These boids are easily startled by the mouse cursor but will return to their perches to rest.</p>
	</div>

	<div id="projects">
		<div id="freeclimbs" class="project">
			<a href="https://freeclimbs.org/"><img src="img/freeclimbs.png" alt="A screenshot of the Freeclimbs web app." /></a>
			<div class="caption">
				<h3><a href="https://freeclimbs.org/">Freeclimbs</a><span class="deemph date">2024 -</span></h3>
				<p>Free and open source route book for home climbing and spray walls, including automatic hold detection and segmentation, shareable private walls, and admin tools.</p>
				<p>
					I'm trying out <a href="https://pocketbase.io/">Pocketbase</a> for the backend of this one; the current frontend is Svelte 4 with a 5 port in progress.
					The computer vision is <a href="https://huggingface.co/jwlarocque/yolov8n-freeclimbs-detect-2">a tune of YoloV8</a> (I labelled a <i>lot</i> of holds...) and <a href="https://github.com/huggingface/transformers.js">in-browser</a> <a href="https://github.com/facebookresearch/segment-anything">SegmentAnything</a>.
					<br/>
					<a href="https://github.com/jwlarocque/freeclimbs" target="_blank" rel="noreferrer">Source is available here.</a>
				</p>
			</div>
		</div>
		<div id="groupme-viewer" class="project">
			<a href="https://github.com/jwlarocque/groupme-viewer"><img src="img/groupme-viewer.png" alt="A screenshot of the GroupMe Archive Viewer web app." /></a>
			<div class="caption">
				<h3><a href="https://github.com/jwlarocque/groupme-viewer">GroupMe Archive Viewer</a><span class="deemph date">August 2024</span></h3>
				<p>To preserve and search old group chats - an area where GroupMe's own interface is somewhat lacking - I put together this simple tool which displays exported chat archives.</p>
				<p>A one day build, using Go and Svelte of course.</p>
			</div>
		</div>
		<div id="holotree" class="project">
			<a href="https://photos.app.goo.gl/REeTZcCMmZKRN3hXA"><video src="img/tree_rgb.mp4" autoplay loop muted></video></a>
			<div class="caption">
				<h3><a href="https://photos.app.goo.gl/REeTZcCMmZKRN3hXA">Volumetric Christmas Tree</a><span class="deemph date">Winter 2023</span></h3>
				<p>If you light your tree with 1,000 addressable WS2812 LEDs and determine their positions, you can display rudimentary holograms! <a href="https://photos.app.goo.gl/REeTZcCMmZKRN3hXA">Here's a longer video of some "fireworks" on Google Photos.</a></p>
				<p>Driving the LEDs at a reasonable refresh rate turned out to be nontrivial - <a href="https://iosoft.blog/2020/09/29/raspberry-pi-multi-channel-ws2812/">big thank you to Jeremy Bentham/Lean2 for this ingenious code for the Raspberry Pi's SMI (Secondary Memory Interface)</a> with which I was able to run 10 channels in parallel with the tight timings required.</p>
				<p>(No source for this one, sorry - it was very hacked together at the last minute and the code is spread all over the place.)</p>
			</div>
		</div>
		<div id="openshifter" class="project">
			<img src="img/openshifter_cropped.jpg" alt="" />
			<div class="caption">
				<h3>Wireless Shifter<span class="deemph date">2023</span></h3>
				<p>Bicycle shifter and remote built around two NRF52840 microcontrollers. This programmable shifter supports nearly any combination of derailleur and cassette and has been my daily driver for more than a year. <a href="https://cad.onshape.com/documents/3857741e7c2094e713dad897/w/0f0b60aa21610677d2d0f44f/e/3587f30335bf648cf5ccb152?renderMode=0&uiState=67908b28a21cdd7dfb1ef11b">Click for Onshape CAD soup.</a></p>
			</div>
		</div>
		<!-- <div id="birdthing" class="project">
			<img src="img/birdthing.png" alt="A screenshot of the Birdthing web app." />
			<div class="caption">
				<h3><a href="https://birds.jwlarocque.com/">Birdthing</a><span class="deemph date">2023</span></h3>
				<p>TODO: this</p>
			</div>
		</div> -->
		<div id="card2022" class="project">
			<a href="card2022.html"><img src="img/card2022_cropped.jpg" alt="A photograph of the plotted card." /></a>
			<div class="caption">
				<h3><a href="card2022.html">Christmas Card</a><span class="deemph date">Winter 2022</span></h3>
				<p>A pen-plotter-based Christmas card to send out to friends and family. <a href="card2022.html">Click through for a page about creating the front of the card.</a></p>
			</div>
		</div>
		<div id="pantrytemp" class="project">
			<a href="https://github.com/jwlarocque/PantryTemp" target="_blank" rel="noreferrer"><img src="img/pantrytemp.png" alt="A screenshot of a web application showing the temperature for the past 24 hours." /></a>
			<div class="caption">
				<h3><a href="https://github.com/jwlarocque/PantryTemp" target="_blank" rel="noreferrer">PantryTemp</a><span class="deemph date">January 2021</span></h3>
				<p>My parents were worried about their pantry freezing in winter if they closed the door. Putting together a Raspberry Pi with a temperature sensor and custom web widget to reassure them otherwise was of course the only reasonable course of action.</p>
				<p>Golang and Svelte.</p>
			</div>
		</div>
		<div id="earthwalker" class="project">
			<a href="https://gitlab.com/glatteis/earthwalker" target="_blank" rel="noreferrer"><img src="img/earthwalker_example.png" alt="Earthwalker Example" /></a>
			<div class="caption">
				<h3><a href="https://gitlab.com/glatteis/earthwalker" target="_blank" rel="noreferrer">Earthwalker (contributor)</a><span class="deemph date">2020</span></h3>
				<p>A GeoGuessr clone built by <a href="https://linus.space/">Linus Heck</a> around some brilliant manipulation of Google StreetView packets. I overhauled the Go backend for better read- and maintain-ability and contributed a new Svelte frontend, along with some additional game features like Nominatim-derived GeoJSON map constraints.</p>
			</div>
		</div>
		<div id="which" class="project">
			<a href="https://github.com/jwlarocque/which" target="_blank" rel="noreferrer"><img src="img/which_2.jpg" alt="Which New Question Page" /></a>
			<div class="caption">
				<h3><a href="https://github.com/jwlarocque/which" target="_blank" rel="noreferrer">Which?</a> <span class="deemph date">Spring 2020</span></h3>
				<p>A simple polling web app with support for approval and ranked-choice voting in additional to regular old fashioned plurality. At one point it was deployed on AWS EC2 and RDS but Amazon's rates are a bit steep. Made with Postgres, Golang, and Svelte.</p>
			</div>
		</div>
		<div id="dragdroplist" class="project">
			<a href="https://github.com/jwlarocque/svelte-dragdroplist" target="_blank" rel="noreferrer"><video src="img/dragdroplist.mp4" autoplay loop muted></video></a>
			<div class="caption">
				<h3><a href="https://github.com/jwlarocque/svelte-dragdroplist" target="_blank" rel="noreferrer">Svelte-DragDropList</a> <span class="deemph date">May 2020</span></h3>
				<p>I needed a sortable list component for Which? and wasn't satisfied with anything available from the community in terms of ease of integration, stability, and accessibility. This Svelte 3 component was my effort to meet those requirements.</p>
				<p>Spotted in the wild at <a href="https://calmatters.org/politics/2022/06/california-budget-surplus-explained/">CalMatters</a>!</p>
			</div>
		</div>
		<div id="hacklahoma" class="project">
			<img src="img/hacklahoma19_centered.svg" alt="Hacklahoma 2019 Logo"/>
			<div class="caption">
				<h3>Hacklahoma <span class="deemph date">2017 - 2019</span></h3>
				<p>The first MLH hackathon in Oklahoma!  I was ACM secretary and built our websites (<a href="https://2019.hacklahoma.org/">2019</a>, <a href="https://2018.hacklahoma.org/">2018</a>).</p>
			</div>
		</div>
		<div id="barrage" class="project">
			<a href="https://github.com/draekris/Barrage/"><img src="https://raw.githubusercontent.com/draekris/Barrage/master/examples/barrage-example.png" alt="Barrage Screenshot" /></a>
			<div class="caption">
				<h3><a href="https://github.com/draekris/Barrage/">Barrage</a> <span class="deemph date">Spring 2018</span></h3>
				<p>Minimal Electron audio player with a real time waveform visualization acting as the seek bar/scrubber.</p>
			</div>
		</div>
		<div id="inversesquare" class="project">
			<iframe src="inversesquarethumb.html" style="border: 0;" title="A JavaScript sketch; a grid of orange lines point towards the mouse cursor and grow longer as it nears."></iframe>
			<div class="caption">
				<h3>Inverse Squares<span class="deemph date">2015</span></h3>
				<p>The result of some discussion in my high school physics class about an inverse square law (gravity?) was several of us trying to get a JavaScript widget like this to run smoothly. Hopefully we were done with our homework.</p>
			</div>
		</div>
		<div id="pythonpython" class="project">
			<a href="https://github.com/jwlarocque/Python-Python/" target="_blank" rel="noreferrer"><img src="img/python-python.png" alt="Screenshot of Python Python being played in a terminal window." /></a>
			<div class="caption">
				<h3><a href="https://github.com/jwlarocque/Python-Python/" target="_blank" rel="noreferrer">Python Python</a><span class="deemph date">2015</span></h3>
				<p>Snake, made with Python for the terminal.</p>
			</div>
		</div>
	</div>
</div>

<style>
	#content {
		margin: auto;
		padding: 0 1em 2em;
		max-width: 62em;
	}

	#nav {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		gap: 1em;
	}

	#boidsCanvas {
		width: 100%;
		height: 20em;
		max-height: 40vh;
		z-index: 1;
	}

	#boidsCanvas::after {
		display: block;
		content: "";
		position: relative;
		width: 100%;
		height: 4em;
		top: -4em;
		background: linear-gradient(180deg, rgba(238,242,243,0) 0%, rgba(238,242,243,1) 80%, rgba(238,242,243,1) 100%);
		pointer-events: none;
		z-index: 2;
	}

	canvas {
		width: 100%;
		height: 100%;
		position: relative;
	}

	svg {
		display: block;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 2em);
		max-width: 40em;
		height: auto;
		aspect-ratio: 597 / 100;
		margin: 0 auto;
		margin-top: min(8em, 10vh);
		overflow: visible;
		opacity: 0;
	}

	#boids-caption {
		position: absolute;
		top: 0;
		right: 0;
		margin: 0;
		padding: 1em;
		box-sizing: border-box;
		max-width: 24em;
		background-color: var(--bg-light);
		z-index: 2;
		display: none;
		pointer-events: none;
	}
	
	#boids-caption-trigger:hover + #boids-caption, #boids-caption:hover, #boids-caption-trigger:focus + #boids-caption, #boids-caption:focus, #boids-caption-trigger:active + #boids-caption, #boids-caption:active {
		display: block;
		pointer-events: all;
	}

	#boids-caption-trigger {
		position: absolute;
		top: 0;
		right: 0;
		margin: 0;
		padding: 1em;
		box-sizing: border-box;
		cursor: default;
		z-index: 1;

	}

	#projects {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.project {
		position: relative;
		clear: both;
		display: flex;
		flex-direction: row;
		background-color: white;
		box-shadow: 0 1px 2px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
	}

	.project > a, .project > img, .project > video, .project > iframe {
		width: 38.2%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.project img, .project video, .project iframe {
		height: auto;
		object-fit: contain;
		line-height: 0;
		max-width: 100%;
	}

	.caption {
		width: calc(61.8% - 2em);
		flex: 1 1 auto;
		margin: 1em;
	}

	.caption > h3 {
		margin: 0;
	}

	.caption > h3 > span.deemph {
		margin-left: 0.5em;
	}

	.caption > p {
		margin: 1em 0 0 0;
	}

	.date {
		float: right;
	}

	#holotree video {
		max-height: 18em;
	}

	#birdthing img {
		max-height: 12em;
	}

	#card2022 img {
		max-height: 12em;
	}

	#hacklahoma img {
		padding: 0 10%;
		box-sizing: border-box;
	}

	#inversesquare iframe {
		height: 12em;
	}

	@media (max-width: 66em) {
		#boidsCanvas {
			max-height: 30vh;
		}

		#boids-caption {
			max-width: 100%;
		}

		.project > a, .project > img, .project > video, .project > iframe {
			width: 100%;
			max-height: 20em;
		}

		.caption {
			width: calc(100% - 2em);
		}

		.project {
			flex-direction: column;
		}
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import Nav from '$lib/components/Nav.svelte';
	import ImageTimeline from '$lib/components/ImageTimeline.svelte';
</script>

<title>Christmas Card 2022</title>

<Nav current="2022 Christmas Card" />

<main id="main">
	<div>
		<p>
			This year I decided (at the very last moment) to put together a pen-plotter-based Christmas
			card to send out to friends and family. This page is about the process used to create the
			front of the card; even if you're not interested in the technical details you can scroll
			through and get a general sense of how I put it together.
			<br />
			Also, you can navigate through the sections with the arrow keys.
		</p>
		<p class="last">
			Also also, if you didn't get one or received yours somewhat after Christmas I apologize - each
			card took quite a lot of machine time to make and I had fewer than I would've liked.
		</p>
	</div>
	<ImageTimeline data={data.card2022Data} />
	<div>
		<p>
			Tremendous thanks to my mom for hand-writing the message on the reverse side of the cards, for
			providing everyone's address, and for actually posting all of these cards.
		</p>
		<p>From the LaRocques, Merry Christmas.</p>
		<img id="plotted-card" src="img/card2022_plotted.jpg" alt="A photograph of the plotted card." />
	</div>
</main>

<style>
	main#main {
		margin: 4em;
		max-width: 80em;
	}

	main > div {
		margin: 4em 0 0 0;
	}

	main > div:last-child,
	.last {
		margin-bottom: 0;
	}

	#plotted-card {
		width: 100%;
		max-width: 26em;
		height: auto;
		box-sizing: border-box;
		display: block;
		margin: auto;
		padding: 1em;
		background-color: black;
	}
</style>

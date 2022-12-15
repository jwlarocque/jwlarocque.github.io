<script>
	import Project from "./Project.svelte"

	const projects = [
		{
			title: '<a href="https://gitlab.com/glatteis/earthwalker">Earthwalker</a>',
			links: '<a href="https://gitlab.com/glatteis/earthwalker"><img src="img/gitlab.svg" alt="GitLab" title="GitLab"></a><a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque"><img src="img/merge.svg" alt="Contributions" title="Contributions"></a>',
			when: '2020',
			img: '<img src="img/earthwalker_example.png" alt="Earthwalker Example">',
			desc: `<p>An open source clone of <a href="https://www.geoguessr.com/">GeoGuessr</a> with a Go backend, which adds some extra features and works around Google's pricey dynamic Streetview API.</p>
				   <p>I rebuilt most of the application to loosen coupling between its components and better allow for future features.</p>
				   <p>The front end is written in Svelte with Leaflet maps, and  utilizes OSM Nominatim and Google StreetView.  It is served along with a REST API by a Go back end.</p>
				   <p><a href="https://gitlab.com/glatteis/earthwalker">GitLab</a>, <a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque">Contributions</a></p>`
		}, {
			title: '<a href="http://which.jwlarocque.com">Which?</a>',
			links: '<a href="http://which.jwlarocque.com"><img src="img/wysiwyg.svg" alt="Live" title="Live"></a><a href="https://github.com/jwlarocque/which"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',
			when: 'Spring 2020',
			img: '<img src="img/which_2.jpg" alt="Which New Question Page">',
			desc: `<p>My most recent project, a tiny voting/polling web app similar to <a href="https://www.strawpoll.me/">Straw Poll</a>, but with support for instant runoff as well as approval and plurality voting.  Still adding features and cleaning up, code quality is currently: <span class="code">gradually improving</span>.</p>
				   <p><a href="https://svelte.dev/">Svelte</a> frontend and PostgreSQL database connected by a Go server with from-scratch routing and session management.  Currently live on AWS EC2 + RDS!</p>
				   <p><a href="https://github.com/jwlarocque/which">GitHub</a>, <a href="http://which.jwlarocque.com">Live</a></p>`
		}, {
			title: '<a href="https://github.com/jwlarocque/svelte-dragdroplist">Svelte-DragDropList</a>',
			links: '<a href="https://svelte.dev/repl/915db3b3ed704fddb7ddfb64bcbc2624?version=3.22.2"><img src="img/svelte.svg" alt="REPL" title="REPL"></a><a href="https://github.com/jwlarocque/svelte-dragdroplist"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',
			when: 'May 2020',
			img: `<video autoplay loop style="object-fit: contain;">
					  <source src="img/dragdroplist.mp4" type="video/mp4">
				  </video>`,
			desc: `<p>Sortable lists in a Svelte 3 component.  Some features: bidirectional data binding, touch support, and buttons for accessibility.</p>
				   <p><a href="https://svelte.dev/repl/915db3b3ed704fddb7ddfb64bcbc2624?version=3.22.2">REPL</a>, <a href="https://github.com/jwlarocque/svelte-dragdroplist">GitHub</a></p>`
		}, {
			title: '<a href="https://hacklahoma.org/">Hacklahoma</a>',
			links: '<a href="https://hacklahoma.org/"><img src="img/wysiwyg.svg" alt="Hacklahoma" title="Hacklahoma"></a><a href="https://github.com/Hacklahoma/Hacklahoma.github.io/tree/Hacklahoma2018-(DO-NOT-PULL-FROM-MASTER)"><img src="img/github.png" alt="GitHub (2018)" title="GitHub (2018)"></a><a href="https://github.com/Hacklahoma/Hacklahoma.github.io/tree/Hacklahoma2019-(DO-NOT-PULL-FROM-MASTER)"><img src="img/github.png" alt="GitHub (2019)" title="GitHub (2019)"></a>',
			when: '2017 - 2019',
			img: '<img src="img/hacklahoma19_centered.svg" alt="Hacklahoma Logo" style="background: #a9d9bc; object-fit: contain;">',
			desc: `<p>The first MLH hackathon in Oklahoma!</p>
				   <p>As ACM secretary during its founding (2018) and a member of the Hacklahoma advertising and media board, I'm lucky to have been a part of the great student team that made this event happen. (I worked on the website (<a href="https://2019.hacklahoma.org/">2019</a>, <a href="https://2018.hacklahoma.org/">2018</a>) quite a bit, and some other stuff.)</p>
				   <p>Thanks to all our sponsors, mentors, and attendees for making Hacklahoma awesome.</p>`
		}, {
			title: '<a href="https://github.com/draekris/Barrage/">Barrage</a>',
			links: '<a href="https://github.com/draekris/Barrage/"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',
			when: 'Spring 2018',
			img: '<img src="https://raw.githubusercontent.com/draekris/Barrage/master/examples/barrage-example.png" alt="Barrage Screenshot" style="object-fit: contain; background-color: rgba(0, 0, 0, 0.1)">',
			desc: `<p>An implementation of a minimal music player.</p>
                   <p>Built on Electron, with howler.js for audio and additional packages to handle metadata.  I only spent a couple of days on this, so the code isn't exactly debugged, optimized, and documented.</p>
				   <p>Since this application does quite a bit of processing to create a real-time frequency visualization, I wouldn't recommend it for mobile devices, though it's not too heavy on desktop.</p>
				   <p>Design copied from renders by <a href="http://annemunition.tv/">AnneMunition</a>.  Example audio is "After midnight kiss" by <a href="https://bisoudelenfantsauvage.bandcamp.com/">Bisou de l'enfant sauvage</a>.</p>
				   <p><a href="https://github.com/draekris/Barrage/">GitHub</a></p>`
		}, {
			title: 'Other Contributions',
			img: `<ul>
					  <li><a href="https://github.com/parker-codes/finite-state-microwave/issues?q=author%3Ajwlarocque">finite-state-microwave</a> (<a href="https://github.com/parker-codes/finite-state-microwave">GitHub</a>)</li>
					  <li><a href="https://github.com/notartom/ffreszoom/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">ffreszoom</a> (<a href="https://github.com/notartom/ffreszoom">GitHub</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/ffreszoom/">Firefox extension</a>)</li>
					  <li><a href="https://github.com/nose-devs/nose2/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">nose2</a> (<a href="https://github.com/nose-devs/nose2">GitHub</a>)</li>
				  </ul>`,
			desc: false
		}, {
			title: '<a href="inversesquare.html">Attraction</a>',
			when: '2015',
			img: '<iframe src="inversesquarethumb.html" style="border: 0;"></iframe>',
			desc: `<p style="pointer-events: none;">This Javascript doodle was put together during my high school physics class, when I should have been studying.  It's an inverse square vector field with respect to the mouse position.  Faster than it used to be.</p>
				   <p style="pointer-events: none;">(Thanks to Chris for the idea!)</p>`
		}, {
			title: '<a href="https://github.com/jwlarocque/Python-Python">Python Python</a>',
			links: '<a href="https://github.com/jwlarocque/Python-Python/"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',
			when: '2015',
			img: '<img src="img/python-python.png" alt="Screenshot of Python Python">',
			desc: `<p>Play a quick game of snake from the comfort of your terminal!  Made in an attempt to convince a friend to stop playing Flash snake during English class and learn Python instead.</p>
				   <p><a href="https://github.com/jwlarocque/Python-Python">GitHub</a></p>`
		}
	];
</script>

<style>
	#horizontal-nav {
		overflow: visible;
		margin: 4em 4em 0 4em;
	}

	#horizontal-nav * {
		display: inline;
	}

	#horizontal-nav h1 {
		font-size: 1.8em;
		font-weight: 400;
		color: #7A7A80;
		margin: 0 1em 0 0;
		text-transform: uppercase;
	}

	#horizontal-nav hr {
		display: block;
		width: 100vw;
		height: 4px;
		border-width: 0;
		background-color: #ee4035;
	}

	#horizontal-nav .current {
		color: black;
	}

	.blurb {
		max-width: 40em;
		margin: 2em 4em 0;
	}

	#project-list {
		max-width: 112em;
		padding: 2em;
		display: flex;
		flex-wrap: wrap;
	}

	figure.aside {
		max-width: 12em;
		margin: 2em;
	}

	figure > * {
		max-width: 12em;
	}

	figure figcaption {
		color: #7A7A80;
		font-size: 1em;
	}

	figure.aside:first-of-type {
		margin-top: 0;
	}

	figure.aside:last-child {
		margin-bottom: 0;
	}

	figure.aside.right {
		float: right;
	}

	@media (max-width: 44em) {
		#horizontal-nav {
			margin: 2em 2em 0 2em;
		}

		#blurb {
			margin: 2em 2em 0;
		}

		#project-list {
			padding: 0;
		}
	}
</style>

<main>
	<div id="horizontal-nav">
		<h1 class="current">2022 Christmas Card</h1>
		<hr/>
	</div>
	<div class="blurb">
		<p>
			For Christmas 2022 I decided (at the very last moment) to put together a pen-plotter-based card to send out to friends and family. This page is about the process used to create the front of the card; even if you're not interested in the technical details you can scroll through the page and get a general sense of how I put it together.
		</p>
		<p>
			Also, due to the tight timeline, there are a <i>lot</i> of shortcuts and dubious code here.  Don't expect anything production grade.  (It was even worse until I cleaned it up for this page.)
		</p>
		<p>
			Also also, if you didn't get one I apologize - each card took almost an hour of machine time so I had fewer than I would've liked.
		</p>
	</div>
	<div class="blurb">
		<h3>Image Generation</h3>
		<figure class="aside right">
			<img src="img/generated.png" alt="Raster image generated by Stable Diffusion">
			<figcaption>Stable Diffusion-generated image</figcaption>
		</figure>
		<p>
			The image depicted on the card was generated by the text-to-image deep learning model Stable Diffusion (v1.5).  I prompted the model for images of "Christmas stars" in an ink illustrated style.
		</p>
		<p>
			In hindsight it was very difficult to extract the "inked" lines from this image, and it probably would've been easier to try to generate an unstylized image and allow the style to arise from the plotting process.<br/>Anyways.
		</p>
	</div>
	<div class="blurb">
		<h3>Outline Vectorization</h3>
		<p>
			I wanted to emphasize the lines in the image by converting them to vectors which the pen plotter could draw directly, rather than using a shading technique intended for plotting photographs. There are lots of existing tools in this area but they weren't well suited to this image, either performing poorly in terms of accuracy or producing geometry too complex to be drawn.
		</p>
		<p>
			
		</p>
	</div>
	<!-- <div id="horizontal-nav">
		<h1 class="current">John LaRocque</h1>
		<a href="https://github.com/jwlarocque" target="_blank"><h1>GitHub&#8599;</h1></a>
		<a href="https://gitlab.com/jwlarocque" target="_blank"><h1>GitLab&#8599;</h1></a>
		<a href="https://www.linkedin.com/in/jwlarocque/" target="_blank"><h1>LinkedIn&#8599;</h1></a>
		<hr/>
	</div>
	<div id="blurb">
		<div>
			<p>Hi, my name is John.  I'm a programmer, rock climber, and ravenous reader.  I've just finished studying computer science at the University of Oklahoma!</p>
			<p>On this page you can find a few projects I've contributed to or created.</p>
		</div>
		<div>
			<p>You can contact me via email: <a href="mailto:john@jwlarocque.com">john@jwlarocque.com</a></p>
		</div>
	</div>
	<div id="project-list">
		{#each projects as project}
			<Project title={project.title} links={project.links} img={project.img} desc={project.desc} when={project.when}/>
		{/each}
	</div> -->
</main>
<script>
	import Project from "./Project.svelte"

	const projects = [
		{
			title: '<a href="http://which.jwlarocque.com">Which?</a>',
			img: '<img src="img/which_2.jpg" alt="Which New Question Page">',
			desc: `<p>My current project, a tiny voting/polling web app similar to <a href="https://www.strawpoll.me/">Straw Poll</a>, but with support for instant runoff as well as approval and plurality voting.  Still adding features and cleaning up, code quality is currently: <span class="code">gradually improving</span>.</p>
				   <p><a href="https://svelte.dev/">Svelte</a> frontend and PostgreSQL database connected by a Go server with from-scratch routing and session management.  Currently live on AWS EC2 + RDS!</p>
				   <p><a href="https://github.com/jwlarocque/which">GitHub</a>, <a href="http://which.jwlarocque.com">Live</a></p>`
		}, {
			title: '<a href="https://github.com/jwlarocque/svelte-dragdroplist">Svelte-DragDropList</a>',
			img: `<video autoplay loop style="object-fit: contain;">
					  <source src="img/dragdroplist.mp4" type="video/mp4">
				  </video>`,
			desc: `<p>Sortable lists in a Svelte 3 component.  Some features: bidirectional data binding, touch support, and buttons for accessibility.</p>
				   <p><a href="https://github.com/jwlarocque/svelte-dragdroplist">GitHub</a></p>`
		}, {
			title: '<a href="https://gitlab.com/glatteis/earthwalker">Earthwalker</a>',
			img: '<img src="img/earthwalker_example.png" alt="Earthwalker Example">',
			desc: `<p>An open source clone of <a href="https://www.geoguessr.com/">Geoguessr</a> with a Go backend, which adds some extra features and works around Google's pricey dynamic Streetview API.</p>
				   <p>I rewrote most of the application to loosen coupling between its components and better allow for future features.</p>
				   <p><a href="https://gitlab.com/glatteis/earthwalker">GitLab</a>, <a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque">Contributions</a></p>`
		}, {
			title: '<a href="https://hacklahoma.org/">Hacklahoma</a>',
			img: '<img src="img/hacklahoma19_centered.svg" alt="Hacklahoma Logo" style="background: #a9d9bc; object-fit: contain;">',
			desc: `<p>The first MLH hackathon in Oklahoma!</p>
				   <p>As ACM secretary (2018) and a member of the Hacklahoma advertising and media board, I'm lucky to have been a part of the great student team that made this event happen. (I worked on the website (<a href="https://2019.hacklahoma.org/">2019</a>, <a href="https://2018.hacklahoma.org/">2018</a>) quite a bit, and some other stuff.)</p>
				   <p>Thanks to all our sponsors, mentors, and attendees for making Hacklahoma awesome.</p>`
		}, {
			title: '<a href="https://github.com/draekris/Barrage/">Barrage</a>',
			img: '<img src="https://raw.githubusercontent.com/draekris/Barrage/master/examples/barrage-example.png" alt="Barrage Screenshot" style="object-fit: contain; background-color: rgba(0, 0, 0, 0.1)">',
			desc: `<p>An implementation of a minimal music player.</p>
                   <p>Built on Electron, with howler.js for audio and additional packages to handle metadata.  I only spent a couple of days on this, so the code isn't exactly debugged, optimized, and documented.</p>
				   <p>Since this application does quite a bit of processing to create a real-time frequency visualization, I wouldn't recommend it for mobile devices, though it's not too heavy on desktop.</p>
				   <p>Design copied from renders by <a href="http://annemunition.tv/">AnneMunition</a>.  Example audio is "After midnight kiss" by <a href="https://bisoudelenfantsauvage.bandcamp.com/">Bisou de l'enfant sauvage</a>.</p>
				   <p><a href="https://github.com/draekris/Barrage/">GitHub</a></p>`
		}, {
			title: 'Other Contributions',
			img: `<ul>
					  <li><a href="https://github.com/notartom/ffreszoom/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">ffreszoom</a> (<a href="https://github.com/notartom/ffreszoom">GitHub</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/ffreszoom/">Firefox extension</a>)</li>
					  <li><a href="https://github.com/nose-devs/nose2/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">nose2</a> (<a href="https://github.com/nose-devs/nose2">GitHub</a>)</li>
				  </ul>`,
			desc: false
		}, {
			title: '<a href="inversesquare.html">Attraction</a>',
			img: '<iframe src="inversesquarethumb.html" style="border: 0;"></iframe>',
			desc: `<p>This Javascript doodle was put together during my high school physics class, when I should have been studying.  It's an inverse square vector field with respect to the mouse position.  Faster than it used to be.</p>
				   <p>(Thanks to Chris for the idea!)</p>
				   <p><a href="inversesquare.html">Full Size</a></p>`
		}, {
			title: '<a href="https://github.com/jwlarocque/Python-Python">Python Python</a>',
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

	#blurb {
		margin: 2em 4em 0;
	}

	#project-list {
		max-width: 112em;
		padding: 2em;
		display: flex;
		flex-wrap: wrap;
	}

</style>

<main>
	<div id="horizontal-nav">
		<h1 class="current">John LaRocque</h1>
		<a href="https://github.com/jwlarocque" target="_blank"><h1>Github&#8599;</h1></a>
		<a href="https://gitlab.com/jwlarocque" target="_blank"><h1>Gitlab&#8599;</h1></a>
		<a href="https://www.linkedin.com/in/jwlarocque/" target="_blank"><h1>LinkedIn&#8599;</h1></a>
		<hr/>
	</div>
	<div id="blurb">
		<div class="row row-left" id="intro">
			<p>Hi, my name is John.  I'm a programmer, rock climber, and ravenous reader.  I've just finished studying computer science at the University of Oklahoma!</p>
			<p>On this page you can find a few projects I've created or contributed to.</p>
		</div>
		<div class="row row-left" id="links">
			<p>You can contact me via email: <a href="mailto:john@jwlarocque.com">john@jwlarocque.com</a></p>
		</div>
	</div>
	<div id="project-list">
		{#each projects as project}
			<Project title={project.title} img={project.img} desc={project.desc}/>
		{/each}
	</div>
</main>
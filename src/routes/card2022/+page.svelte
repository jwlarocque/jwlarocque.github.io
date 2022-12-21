<script lang="ts">
    import { dev } from '$app/environment';
    import type { PageData } from './$types';
    export let data: PageData;

    import Nav from "$lib/components/Nav.svelte";
    import ImageTimeline from "$lib/components/ImageTimeline.svelte";

    $: console.log(data)

    async function phoneHome() {
        const resp = await fetch(
            "https://fxgwpcxgjdpckrdkohmi.functions.supabase.co/phone-home", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Z3dwY3hnamRwY2tyZGtvaG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1NzI3MTYsImV4cCI6MTk4NzE0ODcxNn0.8J3cQI4EpBdqKlWDADwE6dgA7LlSJr9mtOpTfaGyi-g"
                },
                body: '{"name":"Functions"}'
            });
        return resp;
    }

    if (!dev) {
        phoneHome();
    }
</script>

<style>
    main#main {
        margin: 4em;
        max-width: 80em;
    }

    main > div {
        margin: 4em 0;
    }

    #plotted-card {
        max-width: 26em;
        display: block;
        margin: auto;
        padding: 1em;
        background-color: black;
    }
</style>

<title>Christmas Card 2022</title>

<Nav current="2022 Christmas Card"></Nav>

<main id="main">
    <div>
        <p>
            This year I decided (at the very last moment) to put together a pen-plotter-based Christmas card to send out to friends and family. This page is about the process used to create the front of the card; even if you're not interested in the technical details you can scroll through and get a general sense of how I put it together.
            <br/>
            Also, you can navigate through the sections with the arrow keys.
        </p>
        <p>
            Also also, if you didn't get one or received yours somewhat after Christmas I apologize - each card took quite a lot of machine time to make and I had fewer than I would've liked.
        </p>
    </div>
    <ImageTimeline data={data.card2022Data}></ImageTimeline>
    <div>
        <p>
            Tremendous thanks to my mom for hand-writing the message on the reverse side of the cards, for providing everyone's address, and for actually posting all of these cards.
        </p>
        <p>
            From the LaRocques, Merry Christmas.
        </p>
        <img id="plotted-card" src="img/card2022_plotted.jpg" alt="A photograph of the plotted card."/>
    </div>
</main>
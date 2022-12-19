<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    import Nav from "$lib/components/Nav.svelte";
    import ImageTimeline from "$lib/components/ImageTimeline.svelte";

    $: console.log(data)
</script>

<style>
    main#main {
        margin: 4em;
    }
</style>

<Nav current="2022 Christmas Card"></Nav>

<main id="main">
    <ImageTimeline data={data.card2022Data}></ImageTimeline>
</main>
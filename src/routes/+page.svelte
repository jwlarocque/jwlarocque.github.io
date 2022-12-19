<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import navExternals from "$lib/data/navExternals.json";
    import additionalPosts from "$lib/data/additionalPosts.json";
    import PostThumb from "$lib/components/PostThumb.svelte";
</script>

<style>
    #project-list {
		max-width: 112em;
		padding: 2em;
		display: flex;
		flex-wrap: wrap;
	}
</style>

<Nav current={"John LaRocque"} externals={navExternals}/>

<!-- <div id="project-list">
    {#each additionalPosts as post}
        <PostThumb post={post}></PostThumb>
    {/each}
</div> -->

<div style="width: 100%; text-align: center; margin: 4em 0;">
    <h1>Under Construction</h1>
    <p><a href="/card2022">Maybe you were looking for this page about our Christmas card? (click me)</a></p>
</div>

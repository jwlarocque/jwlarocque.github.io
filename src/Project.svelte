<script>
    export let title;
    export let img;
    export let desc;

    let focused = false;
    let hovered = false;
</script>

<style>
    main {
        max-width: 32em;
        min-width: 32em;
        width: 50%;
        margin: 0em 2em 2em;
        cursor: pointer;
    }

    :global(.project h3) {
        font-weight: 400;
        margin: 0.5em 0;
    }

    .project .img {
        position: relative;
    }

    :global(.project img, .project iframe, .project video) {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 350px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    .desc {
        pointer-events: none;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 2em;
        box-sizing: border-box;
        transition: 200ms ease-in-out;
        opacity: 0%;
        background-color: rgba(0, 0, 0, 0.75);
        color: #eef2f3;
    }

    :global(.project .desc *) {
        pointer-events: all;
        cursor: auto;
    }

    :global(.project .desc a) {
        color: lightblue;
        cursor: pointer;
    }

    .visible {
        opacity: 100%;
    }

    @media (max-width: 40em) {
		main {
            max-width: 100%;
            min-width: 0%;
            width: 100%;
        }

        .project .img {
            overflow-y: scroll;
        }

        .desc {
            min-height: 100%;
            height: auto;
            display: none;
        }

        .visible {
            display: block;
        }
	}
</style>

<main 
    class="project" 
    on:click={() => {focused = !focused; hovered = focused;}} 
    on:mouseenter={() => {hovered = true;}} 
    on:mouseleave={() => {hovered = false;}}
>
    <h3>{@html title}</h3>
    <div class="img">
        {@html img}
        {#if desc}
            <div class={focused || hovered ? "desc visible" : "desc"}>
                {@html desc}
            </div>
        {/if}
    </div>
</main>
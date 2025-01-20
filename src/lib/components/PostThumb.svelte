<script lang="ts">
    interface Props {
        post: any;
    }

    let { post }: Props = $props();
    let focused = $state(false);
    let hovered = $state(false);
</script>

<style>
    .project {
        max-width: 32em;
        min-width: 32em;
        width: 50%;
        margin: 0em 2em 2em;
        cursor: pointer;
    }
    .project h3 {
        font-weight: 400;
        margin: 0.5em 0;
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .project h3 > * {
        margin-right: 0.5em;
    }
    .project .links > * {
        margin-right: 0.3em;
    }
    .project .links img {
        height: 1em;
        object-fit: cover;
    }
    .when {
        margin-right: 0;
        flex-grow: 1;
        text-align: right;
        color: rgba(0, 0, 0, 0.4) !important;
    }
    .project .img {
        position: relative;
    }
    .project .img img, .project .img iframe, .project .img video {
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
    .project .desc * {
        pointer-events: all;
        cursor: auto;
    }
    .project .desc a {
        color: lightblue;
        cursor: pointer;
    }
    .visible {
        opacity: 100%;
    }
    @media (max-width: 40em) {
		.project {
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

<div 
    class="project" 
    onclick={() => {focused = !focused; hovered = focused;}} 
    onkeydown={() => {focused = !focused; hovered = focused;}} 
    onmouseenter={() => {hovered = true;}} 
    onmouseleave={() => {hovered = false;}}
>
    <h3 class="title">{@html post.title}{#if "when" in post}<div class="when">{post.when}</div>{/if}</h3>
    <div class="img">
        {#if "img" in post}
            <img src={post.img.src} alt={post.img.alt}/>
        {/if}
        {#if "desc" in post}
            <div class={focused || hovered ? "desc visible" : "desc"}>
                <p>{post.desc}</p>
            </div>
        {/if}
    </div>
</div>
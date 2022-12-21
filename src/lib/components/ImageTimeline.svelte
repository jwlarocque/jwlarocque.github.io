<script lang="ts">
    export let data:any;

    $: console.log(data);

    let y:number;
    $: handleScroll(y)
    let curr = 0;
    let desc;
    let descRefs:Array<any> = [];
    let slideRef:any;
    let topOffset = 0;
    let bottomOffset = 0;
    let slideHeight = 0;
    // TODO: recompute on page resize
    $: if (descRefs.length > 0) {
        topOffset = descRefs[0].getBoundingClientRect().top + window.scrollY;
        bottomOffset = descRefs[descRefs.length - 1].offsetHeight;
        console.log("top: %d, bottom: %d", topOffset, bottomOffset);
    }
    $: if (slideRef) {
        slideHeight = slideRef.offsetHeight;
    }

    function handleWindowKeydown(e:KeyboardEvent) {
        console.log(e);
        if (["ArrowRight", "ArrowDown", "d", "s", "l", "k"].includes(e.key)) {
            console.log("next")
            goTo(curr + 1);
        } else if (["ArrowLeft", "ArrowUp", "w", "a", "i", "j"].includes(e.key)) {
            goTo(curr - 1);
        }
        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            e.preventDefault();
        }
    }

    function handleScroll(y:number) {
        for (let i = 0; i < descRefs.length; i++) {
            if (descRefs[i].getBoundingClientRect().bottom >= topOffset) {
                curr = i;
                return;
            }
        }
    }

    function clampCurr(val:number) {
        return Math.min(Math.max(0, val), data.items.length - 1);
    }

    function goTo(to:number) {
        // curr = clampCurr(to);
        let target = descRefs[clampCurr(to)]
        let em = parseFloat(getComputedStyle(target).fontSize);
        window.scroll({ top: target.offsetTop, behavior: 'smooth' });
    }

    function setCurr(to:number) {
        curr = clampCurr(to);
        // location.href = "#"+curr.toString();
    }
</script>

<style>
    main {
        position: relative;
        max-width: 80em;
        display: flex;
        flex-direction: row;
        justify-content: left;
        gap: 1em;
    }

    img {
        width: 100%;
        aspect-ratio: 1 / 1;
    }

    #slide {
        min-width: 40%;
        align-self: flex-start;
        position: sticky;
        top: 11em;
        max-width: 32em;
    }

    #imgContainer {
        clear: both;
        display: grid;
        place-items: center;
        grid-template-areas: "inner-div";
    }

    #imgContainer img {
        grid-area: inner-div;
        transition: all 0.5s;
        clip-path:polygon(0 0,200% 0,100% 100%,0 200%);
        background-color: var(--bg-light);
    }

    #imgContainer img.prevImg {
        clip-path:polygon(-100% -100%,100% -100%,0 0,-100% 100%);
    }

    #controls, #controls > p {
        display: flex;
        flex-direction: row;
        gap: 1em;
        justify-content: space-between;
    }

    #controls span {
        cursor: pointer;
    }

    #controls > * {
        user-select: none;
    }

    #pageNum {
        float: right;
    }

    #desc {
        flex: 1 1 auto;
        /* max-width: 50%; */
        /* padding-top: 2em; */
        color: var(--deemph-light);
        margin-bottom: calc(100vh - 17em);
    }

    #desc > div {
        opacity: 0.5;
    }

    div#desc :global(:first-child h3) {
        margin-top: 0;
    }

    :global(#desc a) {
        color: var(--deemph-light);
    }

    #desc > .currDesc, :global(#desc .currDesc a) {
        color: black;
        opacity: 1.0;
    }
</style>

<svelte:window bind:scrollY={y} on:keydown={handleWindowKeydown}/>

<main>
    <div id="slide" style="top: {topOffset}px;" bind:this={slideRef}>
        <div id="imgContainer">
            {#each data.items as item, index}
                <img
                    src={data.imgPath + item.img} 
                    alt=""
                    style="z-index: {data.items.length - index}"
                    class={curr > index ? "prevImg" : ""}
                >
            {/each}
        </div>
        <div id="controls">
            <p>
                <span
                    href="#{clampCurr(curr - 1)}"
                    on:click={() => goTo(curr - 1)}
                    on:keypress={() => goTo(curr - 1)}
                >
                    Prev
                </span>
                
                <span
                    on:click={() => goTo(curr + 1)}
                    on:keypress={() => goTo(curr + 1)}
                >
                    Next
                </span>
            </p>
            <p id="pageNum">{curr + 1} / {data.items.length}</p>
        </div>
    </div>
    <div 
        id="desc" 
        bind:this={desc} 
        style="margin-bottom: {slideHeight - bottomOffset}px;"
    >
        {#each data.items as item, index}
            <div 
                bind:this={descRefs[index]}
                class={index == curr ? "currDesc" : ""}
                id={index.toString()}
                on:click={() => setCurr(index)}
                on:keypress={() => setCurr(index)}
            >
                {@html item.descHtml}
            </div>
        {/each}
    </div>
</main>
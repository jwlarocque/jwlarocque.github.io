<script lang="ts">
    export let data:any;

    $: console.log(data);

    let mobile = false;
    let y:number;
    $: handleScroll(y)
    let curr = 0;
    let desc:any;
    let mainRef:any;
    let descRefs:Array<any> = [];
    let slideRef:any;
    let topOffset = 0;
    let bottomOffset = 0;
    let slideHeight = 0;
    // TODO: recompute on page resize
    $: if (descRefs.length > 0) {
        if (desc.getBoundingClientRect().top != mainRef.getBoundingClientRect().top) {
            // wrapped, mobile mode
            console.log("desc top: %d, timeline top: %d", desc.getBoundingClientRect().top, mainRef.getBoundingClientRect().top);
            
            console.log("mobile!!!");
            
            mobile = true;
            topOffset = 0;
        } else {
            topOffset = desc.getBoundingClientRect().top + window.scrollY;
        }
        bottomOffset = descRefs[descRefs.length - 1].offsetHeight;
        console.log("top: %d, bottom: %d", topOffset, bottomOffset);
    }
    $: if (slideRef) {
        slideHeight = slideRef.offsetHeight;
        console.log(slideHeight)
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
        let em = 0;
        if (desc) {
            em = parseFloat(getComputedStyle(desc).fontSize);
        }
        for (let i = 0; i < descRefs.length; i++) {
            if (mobile) {
                if (descRefs[i].getBoundingClientRect().bottom - slideHeight >= topOffset) {
                    curr = i;
                    return;
                }
            } else if (descRefs[i].getBoundingClientRect().bottom - 4 * em >= topOffset) {
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
        if (mobile) {
            window.scroll({ top: target.offsetTop + slideHeight - 9 * em, behavior: 'smooth' });
        } else {
            window.scroll({ top: target.offsetTop - 4 * em, behavior: 'smooth' });
        }
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
        flex-wrap: wrap;
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
        box-sizing: content-box;
        max-width: 32em;
        background-color: var(--bg-light);
        padding-top: 4em;
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
        flex: 1 1 26em;
        /* max-width: 50%; */
        padding-top: 4em;
        color: var(--deemph-light);
        /* margin-bottom: calc(100vh - 17em); */
        z-index: -1;
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

<main bind:this={mainRef}>
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
        style="margin-bottom: {mobile ? 0 : slideHeight - bottomOffset}px;"
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
<script lang="ts">
	interface Props {
		current: string;
		externals?: Array<[string, string]>;
	}

	let { current, externals = [] }: Props = $props();
</script>

<style>
	nav {
		overflow: visible;
		margin: 4em 4em 0 4em;
	}

	nav * {
		display: inline;
	}

	nav h1 {
		font-size: 1.8em;
		font-weight: 400;
		color: var(--deemph-light);
		margin: 0 1em 0 0;
		text-transform: uppercase;
	}

	nav hr {
		display: block;
		width: 100vw;
		height: 4px;
		border-width: 0;
		background-color: var(--emph-light);
	}

	nav .current {
		color: black;
	}
</style>

<nav>
    <h1 class="current">{current}</h1>
    {#each externals as [external_text, external_link]}
        <a href="{external_link}" target="_blank" rel="noreferrer"><h1>{external_text}&#8599;</h1></a>
    {/each}
    <hr/>
</nav>
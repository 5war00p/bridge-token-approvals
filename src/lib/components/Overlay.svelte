<script>
	export let show = false;
</script>

{#if show}
	<div class="flex overlay items-center justify-center">
		<span class="text-white font-semibold text-lg">
			DApp supports only the <span class="font-bold text-violet-800">Polygon</span>
			chain.<br />
			Please switch your network from your MetaMask wallet.
		</span>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(3px);
		background: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
		z-index: 9999; /* Make sure it's on top of other elements */
	}
</style>

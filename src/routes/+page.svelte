<script>
	import LastUpdateBadge from '$lib/components/LastUpdateBadge.svelte';
	import TokenList from '$lib/components/TokenList.svelte';
	import { lastUpdated, walletAddress } from '$lib/store';
</script>

<div class="flex flex-col items-end justify-center overflow-hidden">
	<TokenList />
	{#if $walletAddress && $lastUpdated}
		<LastUpdateBadge />
	{/if}
</div>

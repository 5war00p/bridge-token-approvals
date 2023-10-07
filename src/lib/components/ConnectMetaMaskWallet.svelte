<script lang="ts">
	import IconPlus from './IconPlus.svelte';
	import IconCheck from './IconCheck.svelte';
	import { walletClient } from '$lib/client';
	import { walletAddress } from '$lib/store';

	async function connectWallet() {
		const [address] = await walletClient.request({ method: 'eth_requestAccounts' });
		walletAddress.set(address);
		localStorage.setItem('userWalletAddress', address);
	}
	async function disconnectWallet() {
		walletAddress.set(null);
		localStorage.removeItem('userWalletAddress');
	}
</script>

<button
	type="button"
	class="inline-flex items-center gap-x-2 rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-orange-400"
	on:click={!!$walletAddress ? disconnectWallet : connectWallet}
>
	{#if $walletAddress}
		<IconCheck />
		Connected
	{:else}
		<IconPlus />
		Connect MetaMask
	{/if}
</button>

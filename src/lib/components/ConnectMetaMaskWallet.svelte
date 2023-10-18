<script lang="ts">
	import IconPlus from './IconPlus.svelte';
	import IconCheck from './IconCheck.svelte';
	import { walletClient } from '$lib/client';
	import { walletAddress, wakuNodeStatus } from '$lib/store';
	import { node, waitForRemotePeers } from '$lib/waku';
	import { scheduleApprovalsFetching, interval } from '$lib/backend/scheduledFetch';
	import { onMount } from 'svelte';

	async function establishWakuConnection() {
		console.log('>>> hereer');
		wakuNodeStatus.set('connecting');
		// start waku's light node
		node
			.start()
			.then(() => {
				console.log(node.isStarted());
				if (node.isStarted()) return waitForRemotePeers();
			})
			.then(() => {
				return node.connectionManager.getPeersByDiscovery();
			})
			.then((data) => {
				console.log(data);
				if (
					node.libp2p.getConnections().length ||
					data.CONNECTED.bootstrap.length ||
					data.CONNECTED['peer-exchange'].length
				) {
					// !DEBT: always use dynamic import once node has started else it throws undefined error
					import('$lib/backend/receiver').then((data) => data.subscribeTopic());
					wakuNodeStatus.set('connected');
					scheduleApprovalsFetching();
				}
			})
			.catch((err) => {
				console.error(err);
				wakuNodeStatus.set('failed');
			});
	}

	onMount(async () => {
		wakuNodeStatus.set('disconnected');
		if ($walletAddress) {
			await establishWakuConnection();
		}
	});

	async function connectWallet() {
		const [address] = await walletClient.request({ method: 'eth_requestAccounts' });
		walletAddress.set(address);
		localStorage.setItem('userWalletAddress', address);
		await establishWakuConnection();
	}

	async function disconnectWallet() {
		walletAddress.set(null);
		localStorage.removeItem('userWalletAddress');
		localStorage.removeItem('lastSynced');
		// !DEBT: always use dynamic import once node has started else it throws undefined error
		import('$lib/backend/receiver').then((data) => data.unsubscribeTopic()).catch(console.error);
		// stop waku's light node
		await node.stop();
		wakuNodeStatus.set('disconnected');
		clearInterval(interval);
	}
</script>

<div class="flex flex-col items-end">
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
	{#if $walletAddress}
		<p class="text-xs text-gray-400">{$walletAddress}</p>
	{/if}
</div>

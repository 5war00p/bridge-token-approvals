<script lang="ts">
	import IconPlus from './IconPlus.svelte';
	import IconCheck from './IconCheck.svelte';
	import IconDownload from './IconDownload.svelte';
	import { publicClient, walletClient } from '$lib/client';
	import { walletAddress, wakuNodeStatus } from '$lib/store';
	import { wakuNode, waitForRemotePeers } from '$lib/waku';
	import { scheduleApprovalsFetching, interval } from '$lib/backend/scheduledFetch';
	import { onMount } from 'svelte';
	import { polygon } from 'viem/chains';
	import { switchToPolygon } from '$lib/approvals';
	import Overlay from './Overlay.svelte';

	let showOverlay = false;
	let buttonText = 'Connect MetaMask';
	$: {
		if (!walletClient) {
			buttonText = 'Install MetaMask';
		}

		if (walletClient && !$walletAddress) {
			buttonText = 'Connect MetaMask';
		}

		if (walletClient && $walletAddress) {
			buttonText = 'Connected';
		}
	}

	async function establishWakuConnection() {
		wakuNodeStatus.set('connecting');
		// start waku's light node
		wakuNode
			.start()
			.then(() => {
				if (wakuNode.isStarted()) return waitForRemotePeers();
			})
			.then(() => {
				return wakuNode.connectionManager.getPeersByDiscovery();
			})
			.then((data) => {
				if (
					wakuNode.libp2p.getConnections().length ||
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
			const currentChainId = await publicClient?.getChainId();

			if (currentChainId !== polygon.id) {
				showOverlay = true;
				await switchToPolygon();
			}
			await establishWakuConnection();
		}
	});

	async function connectWallet() {
		if (!walletClient) {
			return;
		}
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
		await wakuNode.stop();
		wakuNodeStatus.set('disconnected');
		clearInterval(interval);
	}

	async function onClick() {
		if (!walletClient) {
			window.open('https://metamask.io/download/', '_blank', 'noreferrer');
		}

		if (walletClient && !$walletAddress) {
			connectWallet();
		}

		if (walletClient && $walletAddress) {
			disconnectWallet();
		}
	}

	$: {
		if (window.ethereum) {
			window.ethereum.on('chainChanged', async (data: string) => {
				// 0x89 is Hexadecimal representation of Polygon chainId (137)
				if (data !== '0x89') {
					showOverlay = true;
					await switchToPolygon();
				} else {
					showOverlay = false;
				}
			});
		}
	}
</script>

<div class="flex flex-col items-end">
	<button
		type="button"
		class="inline-flex items-center gap-x-2 rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-orange-400"
		on:click={onClick}
	>
		{#if !walletClient}
			<IconDownload />
		{:else if walletClient && $walletAddress}
			<IconCheck />
		{:else}
			<IconPlus />
		{/if}
		{buttonText}
	</button>
	{#if $walletAddress}
		<p class="text-xs text-gray-400">{$walletAddress}</p>
	{/if}
</div>
<Overlay show={showOverlay} />

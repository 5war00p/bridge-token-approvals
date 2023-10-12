<script>
	import ConnectMetaMaskWallet from './ConnectMetaMaskWallet.svelte';
	import LastUpdateBadge from './LastUpdateBadge.svelte';
	import PeerConnectionBadge from './PeerConnectionBadge.svelte';
</script>

<div class="md:flex md:items-center md:justify-between p-4">
	<div class="flex flex-1 min-w-0 gap-4">
		<h2
			class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
		>
			Token Approvals
		</h2>
		<LastUpdateBadge />
		<PeerConnectionBadge type={'connecting'} />
	</div>
	<div class="mt-4 flex md:ml-4 md:mt-0">
		<ConnectMetaMaskWallet />
	</div>
</div>

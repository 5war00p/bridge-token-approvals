<script lang="ts">
	import { grantApproval, revokeApproval } from '$lib/approvals';
	import { walletAddress } from '$lib/store';

	export let isApproved: boolean;
	export let token: App.Token;
	const onClick = async (approved: boolean, token: App.Token) => {
		if ($walletAddress) {
			if (approved) {
				await revokeApproval(token.address, $walletAddress, token.router);
			} else {
				await grantApproval(token.address, $walletAddress, token.router);
			}
		}
	};
</script>

{#if isApproved === undefined}
	LOADING...
{:else}
	<button
		class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
		on:click={async () => await onClick(isApproved, token)}
	>
		{#if isApproved}
			Unapprove
		{:else}
			Approve
		{/if}
	</button>
{/if}

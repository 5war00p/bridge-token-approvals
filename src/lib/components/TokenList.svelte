<script lang="ts">
	import { allTokenApprovals, grantApproval, revokeApproval } from '$lib/approvals';
	import { walletAddress } from '$lib/store';
	import tokens from '$lib/tokens';

	const multicallApprovals = allTokenApprovals(tokens, $walletAddress!);

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

<div class="w-1/4 h-[680px] ml-auto p-4 overflow-auto">
	<section class="font-medium text-lg text-center p-2">Hop Tokens</section>
	<ul role="list" class="divide-y divide-gray-100">
		{#each tokens as token, index}
			<li class="flex items-center justify-between gap-x-4 px-2 py-4 hover:bg-gray-50">
				<div class="flex min-w-0 gap-x-4">
					<img
						class="h-12 w-12 flex-none rounded-full bg-gray-50"
						src={token.logoUrl}
						alt={token.symbol}
					/>
					<div class="min-w-0 flex-auto">
						<p class="text-sm font-semibold leading-6 text-gray-900">{token.name}</p>
						<p class="mt-1 truncate text-xs leading-5 text-gray-500">{token.symbol}</p>
					</div>
				</div>
				{#if $walletAddress}
					{#await multicallApprovals}
						LOADING...
					{:then approvals}
						{@const isTokenApproved = !!approvals[index].result}
						<button
							class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
							on:click={async () => await onClick(isTokenApproved, token)}
						>
							{#if isTokenApproved}
								Unapprove
							{:else}
								Approve
							{/if}
						</button>
					{/await}
				{/if}
			</li>
		{/each}
	</ul>
</div>

<script lang="ts">
	import { allTokenApprovals, grantApproval, revokeApproval } from '$lib/approvals';
	import { walletAddress, tokenStatusList } from '$lib/store';
	import tokens from '$lib/tokens';
	import ApprovalButton from './ApprovalButton.svelte';

	allTokenApprovals(tokens, $walletAddress!).then((approvals) => {
		const data = tokens.map((token, index) => {
			return {
				tokenName: token.name,
				isApproved: !!approvals[index].result
			};
		});
		tokenStatusList.set(data);
	});
</script>

<div class="min-w-full h-[680px] ml-auto p-4 overflow-auto">
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
					{#key $tokenStatusList}
						<ApprovalButton isApproved={$tokenStatusList?.[index]?.isApproved} {token} />
					{/key}
				{/if}
			</li>
		{/each}
	</ul>
</div>

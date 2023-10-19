import { get } from 'svelte/store'
import { walletAddress } from "$lib/store";
import { MILLISECONDS_IN_ONE_MINUTE } from "$lib/constants";
import { allTokenApprovals } from '$lib/approvals';
import tokens from '$lib/tokens';
import type { Address } from 'viem';
import { TokenApprovalWakuMessage, serializeMessage } from '$lib/waku/protobuf';
import { encoder, wakuNode } from '$lib/waku';

export let interval: NodeJS.Timeout;
export const scheduleApprovalsFetching = () => {

    const address = get(walletAddress) as Address
    const intervalHandler = () => {
        allTokenApprovals(tokens, address).then((data) => {
            const message = data.map((token, index) => ({
                token: tokens[index].name,
                isApproved: !!token.result
            }))

            const stringifiedList = JSON.stringify(message)
            const protoData = TokenApprovalWakuMessage.create({ result: stringifiedList })
            return wakuNode.lightPush.send(encoder, { payload: serializeMessage(protoData) })
        }).catch(console.error)
    }

    interval = setInterval(intervalHandler, MILLISECONDS_IN_ONE_MINUTE)
}
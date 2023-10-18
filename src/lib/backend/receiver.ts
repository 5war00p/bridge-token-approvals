import { decoder, node } from "$lib/waku";
import type { IMessage } from "@waku/sdk";
import { TokenApprovalWakuMessage } from "$lib/waku/protobuf";
import { get } from 'svelte/store'
import { lastUpdated, showWakuToast, tokenStatusList } from "$lib/store";

export const callback = (wakuMessage: IMessage) => {
    // Check if there is a payload on the message
    if (!wakuMessage.payload) return;

    const messageObj = TokenApprovalWakuMessage.decode(wakuMessage.payload).toJSON();

    if (messageObj.result !== JSON.stringify(get(tokenStatusList)))
        showWakuToast.set(true)

    const result = JSON.parse(messageObj.result ?? '[]');
    tokenStatusList.set(result)
    lastUpdated.set(new Date())
};


// Subscribe & Unsubscribe to content topics
export const subscribeTopic = async () => await node.filter.subscribe([decoder], callback)
export const unsubscribeTopic = await node.filter.subscribe([decoder], callback);
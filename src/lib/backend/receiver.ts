import { decoder, wakuNode } from "$lib/waku";
import type { IMessage, Unsubscribe } from "@waku/sdk";
import { TokenApprovalWakuMessage } from "$lib/waku/protobuf";
import { get } from 'svelte/store'
import { lastUpdated, showWakuToast, tokenStatusList } from "$lib/store";

export const callback = (wakuMessage: IMessage) => {
    // Check if there is a payload on the message
    if (!wakuMessage.payload) return;

    const messageObj = TokenApprovalWakuMessage.decode(wakuMessage.payload).toJSON();

    const storedList = get(tokenStatusList)
    const stringifiedList = JSON.stringify(storedList)
    if (storedList.length && messageObj.result !== stringifiedList)
        showWakuToast.set(true)

    const result = JSON.parse(messageObj.result ?? '[]');
    tokenStatusList.set(result)
    lastUpdated.set(new Date().toString())
    localStorage.setItem('lastSynced', new Date().toString());
};


// Subscribe & Unsubscribe to content topics
export let unsubscribeTopic: Unsubscribe = () => { }
export const subscribeTopic = async () => {
    unsubscribeTopic = await wakuNode.filter.subscribe([decoder], callback)
}
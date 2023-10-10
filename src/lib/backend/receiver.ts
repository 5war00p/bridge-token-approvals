import { decoder, node } from "$lib/waku";
import type { IMessage } from "@waku/sdk";
import { TokenApprovalWakuMessage } from "$lib/waku/protobuf";
import { tokenStatusList } from "$lib/store";

// Create the callback function
const callback = (wakuMessage: IMessage) => {
    // Check if there is a payload on the message
    if (!wakuMessage.payload) return;
    // Render the messageObj as desired in your application
    const messageObj = TokenApprovalWakuMessage.decode(wakuMessage.payload).toJSON();
    const result = JSON.parse(messageObj.result ?? '[]');
    tokenStatusList.set(result)
};


// Subscribe & Unsubscribe to content topics
export const subscribeTopic = async () => await node.filter.subscribe([decoder], callback)
export const unsubscribeTopic = await node.filter.subscribe([decoder], callback);
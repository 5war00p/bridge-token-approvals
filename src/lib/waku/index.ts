import {
    createEncoder, createDecoder, createLightNode, Protocols, waitForRemotePeer
} from "@waku/sdk";

export const wakuNode = await createLightNode({
    defaultBootstrap: true,
})

export const waitForRemotePeers = async () => {
    // Wait for a successful peer connection
    await waitForRemotePeer(wakuNode, [
        Protocols.LightPush,
        Protocols.Filter,
    ]);
}

// Choose a content topic
const contentTopic = "/bridge-token-approvals/1/approvals/proto";

// message encoder and decoder
export const encoder = createEncoder({ contentTopic, ephemeral: true });
export const decoder = createDecoder(contentTopic);

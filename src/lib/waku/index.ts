import {
    createEncoder, createDecoder, createLightNode, Protocols, waitForRemotePeer
} from "@waku/sdk";

export const waitForRemotePeers = async () => {
    // Wait for a successful peer connection
    await waitForRemotePeer(node, [
        Protocols.LightPush,
        Protocols.Filter,
    ]);
}

// Create and start a Light Node
export const node = await createLightNode({
    defaultBootstrap: true,
});


// Choose a content topic
const contentTopic = "/bridge-token-approvals/1/approvals/proto";

// message encoder and decoder
export const encoder = createEncoder({ contentTopic, ephemeral: true });
export const decoder = createDecoder(contentTopic);

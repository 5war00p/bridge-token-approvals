import { polygon } from 'viem/chains';
import { createPublicClient, createWalletClient, custom } from 'viem';

export const publicClient = createPublicClient({
    chain: polygon,
    transport: custom(window.ethereum)
});

export const walletClient = createWalletClient({
    chain: polygon,
    transport: custom(window.ethereum)
})
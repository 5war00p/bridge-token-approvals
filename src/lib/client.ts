import { polygon } from 'viem/chains';
import { createPublicClient, createWalletClient, custom } from 'viem';

export const walletClient = window?.ethereum ? createWalletClient({
    chain: polygon,
    transport: custom(window?.ethereum)
}) : null

export const publicClient = window?.ethereum ? createPublicClient({
    chain: polygon,
    transport: custom(window?.ethereum)
}) : null;
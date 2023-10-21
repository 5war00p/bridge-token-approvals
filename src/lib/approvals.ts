import type { Address } from 'viem';
import { erc20ABI } from './erc20ABI';
import { publicClient, walletClient } from './client';
import { DEFAULT_ALLOWANCE_VALUE, MAX_ALLOWANCE_VALUE } from './constants';
import { polygon } from 'viem/chains';
export const isApproved = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<boolean> => {
    if (publicClient) {
        const result = await publicClient.readContract({
            abi: erc20ABI,
            account: walletAddress,
            address: tokenAddress,
            functionName: 'allowance',
            args: [walletAddress, spender]
        }) as string
        return BigInt(result) !== BigInt(0)
    } else {
        return false
    }
}

export const grantApproval = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<void> => {
    if (publicClient) {
        const { request } = await publicClient.simulateContract({
            account: walletAddress,
            address: tokenAddress,
            abi: erc20ABI,
            functionName: 'approve',
            args: [spender, MAX_ALLOWANCE_VALUE]
        })
        if (walletClient)
            await walletClient.writeContract(request)
    }
}

export const revokeApproval = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<void> => {
    if (publicClient) {
        const { request } = await publicClient.simulateContract({
            account: walletAddress,
            address: tokenAddress,
            abi: erc20ABI,
            functionName: 'approve',
            args: [spender, DEFAULT_ALLOWANCE_VALUE]
        })
        if (walletClient)
            await walletClient.writeContract(request)
    }
}

export const allTokenApprovals = async (tokens: App.Token[], walletAddress: Address) => {

    const baseContractObj = {
        abi: erc20ABI,
        account: walletAddress,
    } as const
    const contracts = tokens.map(token => {
        return {
            ...baseContractObj,
            address: token.address,
            functionName: 'allowance',
            args: [walletAddress,
                token.router]
        }
    })

    if (publicClient) {
        return await publicClient.multicall({ contracts })
    } else {
        return Promise.resolve([])
    }
}

export const switchToPolygon = async (): Promise<void> => {
    if (walletClient)
        await walletClient.switchChain({ id: polygon.id })
}
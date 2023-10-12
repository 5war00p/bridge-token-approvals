import { writable } from 'svelte/store'
import type { Address } from 'viem'

const getLocalStoredValue = localStorage.getItem('userWalletAddress') as Address | null
const walletAddress = writable<Address | null>(getLocalStoredValue)

const tokenStatusList = writable<App.TokenStatus[]>([])

const lastUpdated = writable<Date>(new Date())

export { walletAddress, tokenStatusList, lastUpdated }

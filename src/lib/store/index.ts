import { writable } from 'svelte/store'
import type { Address } from 'viem'

const getLocalStoredValue = localStorage.getItem('userWalletAddress') as Address | null
const walletAddress = writable<Address | null>(getLocalStoredValue)

const tokenStatusList = writable<App.TokenStatus[]>([])

const lastSyncedStoreValue = localStorage.getItem('lastSynced') as string | null
const lastUpdated = writable<string | null>(lastSyncedStoreValue)
lastUpdated.subscribe((val) => {
    if (val) {
        localStorage.setItem('lastSynced', val)
    }
})

const showWakuToast = writable<boolean>(false)

const wakuNodeStatus = writable<App.WakuNodeStatus>('disconnected')

export { walletAddress, tokenStatusList, lastUpdated, showWakuToast, wakuNodeStatus }

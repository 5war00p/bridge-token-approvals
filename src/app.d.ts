// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Address } from "viem"
import { MetaMaskInpageProvider } from '@metamask/providers'
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Token {
			address: Address,
			name: string
			symbol: string
			decimals: number
			logoUrl: string
			router: Address
		}
	}
	interface Window {
		ethereum?: MetaMaskInpageProvider
	}
}

export { };

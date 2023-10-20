## The Intro

To exchange crypto tokens from one token to another, we will use a bridge's where bridge uses its own liquidity pools for supported tokens and it takes care of transfering/exchanging tokens. Inorder to make that happen users should approve the bridge contracts on their wallets for each token. Approved means they are allowing their tokens to consume on that bridge which allows the brdige smart contract exchange from one token to another or the same token from one chain to another.

## The Problem

Live Updates. As its a blockchain transaction, the result won't reflect immediately and frontend ends up with showing previous state until a page refresh/reload. Updating the  UI in relatime would be nice UX for most of the applications.

## The Decentralized Solution

Idea: Polling -> updating state -> re-rendering

With ideal polling you can synchronize within the device but what if I say there is a solutoin where we sync across devices or may be across different nodes based on your use case. Waku's lightpush and filter protocol is what we needed over here, this enables us to syncronize across devices/sessions.

## The Project

As for the protype, I'm keeping the token list limited to Polygon chain and the bridge is  [Hop](https://hop.exchange/). The initial requirements for this project is to have a defined token list with required data - bridge address, token address and the additonals lik tokename, token symbol, icon to make it readable for the users.

*Data: Tokens.ts*

```typescript
// Reference: https://github.com/hop-protocol/subgraph/blob/master/config/matic.json
const tokens: App.Token[] = [
    {
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        name: "DAI Stablecoin",
        symbol: "DAI",
        decimals: 18,
        logoUrl: "https://assets.coingecko.com/coins/images/9956/large/4943.png",
        router: '0xEcf268Be00308980B5b3fcd0975D47C4C8e1382a'
    },
    {
        address: "0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC",
        name: "Hop",
        symbol: "HOP",
        decimals: 18,
        logoUrl: "https://assets.coingecko.com/coins/images/25445/large/hop.png",
        router: '0x58c61AeE5eD3D748a1467085ED2650B697A66234'
    },
    {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoUrl:
            "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
        router: '0x553bC791D746767166fA3888432038193cEED5E2'
    },
    {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        logoUrl:
            "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        router: "0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8",
    },
    {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        logoUrl:
            "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/128/Tether-USDT-icon.png",
        router: "0x6c9a1ACF73bd85463A46B0AFc076FBdf602b690B",
    },
    {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        logoUrl:
            "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
        router: "0xb98454270065A31D71Bf635F6F7Ee6A518dFb849",
    },
]
export default tokens
```

The following techstack I'm going to use to build this idea:

- Metamask

- Protobuf

- Svelte

- TailwindCSS

- Viem

- Waku

As the main purpose of this blog is to showcase the waku's usecase, I will talk more on waku setup and assuming readers you are already familiar with Svelte and other frameworks.

Let's start with svelte installation, along with ESLint, Prettier and TypeScript. 

![svelte-installation.png](C:\Users\Swaroop\Desktop\waku\svelte-installation.png)

Before heading up, let's look into the UI & UX.

![UI_UX.png](C:\Users\Swaroop\Desktop\waku\UI_UX.png)

Elements:

- Wallet Connect Button

- Peer Connection Badge

- Token List with approval/unapproval buttons

- Last synced from Waku

- Toast to show waku message notification

User flow:

![userflow.drawio.png](C:\Users\Swaroop\Downloads\userflow.drawio.png)

Approval flow with Waku:

![](C:\Users\Swaroop\AppData\Roaming\marktext\images\2023-10-20-12-59-43-image.png)

As we are gonna deal with smart contract addresses the core thing that we would need is a wallet connection and disconnection facility, so that user can perform transactions. 

I'm gonna use metamask wallet (chrome extension only).

References:

- https://metamask.io/download/

- https://docs.metamask.io/

And Viem, takes care of batching, reading and writing contracts. In our case, we need this to grant, revoke and read token contracts. 

*Utils: approvals.ts*

```typescript
import type { Address } from 'viem';
import { erc20ABI } from './erc20ABI';
import { publicClient, walletClient } from './client';
import { DEFAULT_ALLOWANCE_VALUE, MAX_ALLOWANCE_VALUE } from './constants';
export const isApproved = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<boolean> => {
    const result = await publicClient.readContract({
        abi: erc20ABI,
        account: walletAddress,
        address: tokenAddress,
        functionName: 'allowance',
        args: [walletAddress, spender]
    }) as string
    return BigInt(result) !== BigInt(0)
}

export const grantApproval = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<void> => {
    const { request } = await publicClient.simulateContract({
        account: walletAddress,
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, MAX_ALLOWANCE_VALUE]
    })
    await walletClient.writeContract(request)
}

export const revokeApproval = async (tokenAddress: Address, walletAddress: Address, spender: Address): Promise<void> => {
    const { request } = await publicClient.simulateContract({
        account: walletAddress,
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, DEFAULT_ALLOWANCE_VALUE]
    })
    await walletClient.writeContract(request)
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
            args: [walletAddress, token.router]
        }
    })
    return await publicClient.multicall({ contracts })
}
```

As it mentioned in flowchart,  with Waku you need to do several steps before utilizing sending and filtering functions.

#### Create a Waku lightnode

```typescript
import { createLightNode } from "@waku/sdk";

export const wakuNode = await createLightNode({
    defaultBootstrap: true,
})
```

#### Wait for Peers

```typescript
import { Protocols, waitForRemotePeer } from "@waku/sdk";

export const waitForRemotePeers = async () => {
    // Wait for a successful peer connection
    await waitForRemotePeer(wakuNode, [
        Protocols.LightPush,
        Protocols.Filter,
    ]);
}
```

#### Encoder & Decoder

Refer to the waku docs for content-topic naming format: https://docs.waku.org/overview/concepts/content-topics

```typescript
import { createEncoder, createDecoder } from "@waku/sdk";

// Choose a content topic
const contentTopic = "/bridge-token-approvals/1/approvals/proto";

// message encoder and decoder
export const encoder = createEncoder({ contentTopic, ephemeral: true });
export const decoder = createDecoder(contentTopic);
```

#### Protobuf

- Define  a protobuf schema
  
  ```typescript
  import protobuf from "protobufjs";
  
  // Message structure with Protobuf
  export const TokenApprovalWakuMessage = new protobuf.Type('TokenApproval')
      .add(new protobuf.Field('result', 1, 'string'))
  
  }
  ```

- Serialization of message with  protobuf schema before sending it
  
  ```typescript
  import { Message } from "protobufjs";
  
  export const serializeMessage = (protoMessage: Message) => {
      return TokenApprovalWakuMessage.encode(protoMessage).finish()
  }
  ```

#### Subscribe and Unsubscribe

```typescript
// Subscribe & Unsubscribe to content topics
export let unsubscribeTopic: Unsubscribe = () => {}
export const subscribeTopic = async () => {
    unsubscribeTopic = await wakuNode.filter.subscribe([decoder], callback)
}
```

The `subscribe` method returns the `unsubscribe` method, but in my case I segregate these methods and import them on demand.

#### Sender

Here is where the polling runs and does batch calling to all the token contracts and sends to the waku topic that we reated.

```typescript
import { get } from 'svelte/store'
import { walletAddress } from "$lib/store";
import { MILLISECONDS_IN_ONE_MINUTE } from "$lib/constants";
import { allTokenApprovals } from '$lib/approvals';
import tokens from '$lib/tokens';
import type { Address } from 'viem';
import { TokenApprovalWakuMessage, serializeMessage } from '$lib/waku/protobuf';
import { encoder, wakuNode } from '$lib/waku';

export let interval: NodeJS.Timeout;
export const scheduleApprovalsFetching = () => {

    const address = get(walletAddress) as Address
    const intervalHandler = () => {
        allTokenApprovals(tokens, address).then((data) => {
            const message = data.map((token, index) => ({
                token: tokens[index].name,
                isApproved: !!token.result
            }))

            const stringifiedList = JSON.stringify(message)
            const protoData = TokenApprovalWakuMessage.create({ result: stringifiedList })
            return wakuNode.lightPush.send(encoder, { payload: serializeMessage(protoData) })
        }).catch(console.error)
    }

    interval = setInterval(intervalHandler, MILLISECONDS_IN_ONE_MINUTE)
}
```

#### Receiver

The receiver uses a `callback` where you can implement your business logic. In my case I will simply update the state so that the frontend will re-render.

```typescript
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
```

Now we had our backend polling logic and waku setup ready, lets import these function in frontend. As  I mentioned earlier wallet connection is the gateway to do transactions, we will be calling these function on wallet connection and disconnection.

*Function: connectWallet*

```typescript
    async function connectWallet() {
        if (!walletClient) {
            return;
        }
        const [address] = await walletClient.request({ method: 'eth_requestAccounts' });
        walletAddress.set(address);
        localStorage.setItem('userWalletAddress', address);
        await establishWakuConnection(erval(interval);
    }
```

*Function: disconnectWallet*

```typescript
    async function disconnectWallet() {
        walletAddress.set(null);
        localStorage.removeItem('userWalletAddress');
        localStorage.removeItem('lastSynced');
        // !DEBT: always use dynamic import once node has started else it throws undefined error
        import('$lib/backend/receiver').then((data) => data.unsubscribeTopic()).catch(console.error);
        // stop waku's light node
        await wakuNode.stop();
        wakuNodeStatus.set('disconnected');
        clearInterval(interval);
    }
```

*Function: establishWakuC``onnection*

```typescript
    async function establishWakuConnection() {
        wakuNodeStatus.set('connecting');
        // start waku's light node
        wakuNode
            .start()
            .then(() => {
                if (wakuNode.isStarted()) return waitForRemotePeers();
            })
            .then(() => {
                return wakuNode.connectionManager.getPeersByDiscovery();
            })
            .then((data) => {
                if (
                    wakuNode.libp2p.getConnections().length ||
                    data.CONNECTED.bootstrap.length ||
                    data.CONNECTED['peer-exchange'].length
                ) {
                    // !DEBT: always use dynamic import once node has started else it throws undefined error
                    import('$lib/backend/receiver').then((data) => data.subscribeTopic());
                    wakuNodeStatus.set('connected');
                    scheduleApprovalsFetching();
                }
            })
            .catch((err) => {
                console.error(err);
                wakuNodeStatus.set('failed');
            });
    }
```

You will notice the code blocks above uses other state values like wakuNodeStatus, lastSynced these are metrics to show user the peer connection status and last received time of a waku message.

#### Wrap

Although the problem that I solved here can be implmented many ways, having decentralized solutions makes your app fully decentralized. Waku can be applied in several other cases too.

Do checkout the usecases over here: https://docs.waku.org/overview/use-cases

#### Links

- GitHub Repository: [5war00p/bridge-token-approvals](https://github.com/5war00p/bridge-token-approvals/)

- Loom Video: https://www.loom.com/share/8e52ac7ffffa44d4adc7ce869d315f6d?sid=6c05627b-90ea-4e49-b78a-65780e22c0c2

- Vercel Deployed URL: https://bridge-token-approvals.vercel.app/

- IPFS Deployed URL: https://k51qzi5uqu5dj57htsj70dwksocisgckponvlw3o1476p888d3aebuq5q22s6b.ipns.4everland.io/

#### References

- [Svelte](https://svelte.dev/docs/introduction)

- [Waku](https://docs.waku.org/)

- [Protobuf.js](https://protobufjs.github.io/protobuf.js/)

- [Viem](https://viem.sh/docs/getting-started.html)

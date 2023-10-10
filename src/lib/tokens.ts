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
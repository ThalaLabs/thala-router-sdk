# Thala Router

SDK to get optimal swap routing for ThalaSwap. Currently, we support finding routes of no more than 3 hops.

## Examples

```
const router = new ThalaswapRouter(API_URL);
const fromToken = "0x1::aptos_coin::AptosCoin";
const toToken = "0xec84c05cc40950c86d8a8bed19552f1e8ebb783196bb021c916161d22dc179f7::asset::USDC";
const amountIn = 0.1;

const route = await router.getRouteGivenExactInput(
    fromToken,
    toToken,
    amountIn
);

console.log("Route:", route);
console.log("Entry function payload with 0.5% slippage:", router.encodeRoute(route!, 0.5).rawPayload);
```

See `examples.ts` for more details

## Development

This package uses Bun for development and package management.

```
# install dependencies
bun install

# test the app
bun test

# build the app, available under dist
bun run build
```

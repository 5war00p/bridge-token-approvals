# Live Token Approvals Status with Waku
This project checks for approval status of Hop bridge contract on user's wallet for all the listed tokens on Polygon Chain. To get live updates, we use Waku lightpush and filter protocol.

## Installing dependencies

If you're seeing this, you've probably already done this step. Congrats!

```bash
pnpm install
```

## Developing

Once you've created a project and installed dependencies, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

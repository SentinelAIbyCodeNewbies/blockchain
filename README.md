# SentinelAI Blockchain Trust Layer

This package currently anchors media fingerprints on Solana Devnet using the Memo program.

## Current Mode

- `src/anchor.ts` submits memo transactions to Devnet.
- `src/config.ts` is configured with the Solana Memo program ID.
- `scripts/deploy.ts` is a deployment preflight script:
  - It loads the backend wallet from `BACKEND_PRIVATE_KEY`.
  - It checks the Devnet balance for the deployer wallet.
  - It detects whether this repo has a real Anchor workspace.
  - If no `Anchor.toml` and `programs/` directory exist, it explains that the project is still in Memo mode.

## Run The Deployment Preflight

```bash
npm run deploy:check
```

## If You Later Add A Custom Anchor Program

Create an Anchor workspace in this package, then use:

```bash
anchor build
anchor deploy --provider.cluster devnet
```

You will also need an `Anchor.toml` that points to the deployed program ID and your wallet path.

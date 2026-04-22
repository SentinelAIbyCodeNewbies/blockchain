import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

const ROOT_DIR = path.resolve(__dirname, "..");
const ANCHOR_TOML_PATH = path.join(ROOT_DIR, "Anchor.toml");
const PROGRAMS_DIR = path.join(ROOT_DIR, "programs");

function loadBackendWallet(): Keypair {
  const rawSecret = process.env.BACKEND_PRIVATE_KEY || "[]";
  const secretKey = Uint8Array.from(JSON.parse(rawSecret));

  if (secretKey.length === 0) {
    throw new Error("BACKEND_PRIVATE_KEY not found in .env");
  }

  return Keypair.fromSecretKey(secretKey);
}

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const wallet = loadBackendWallet();

  console.log("🚀 Starting deployment process...");
  console.log("Cluster: devnet");
  console.log("Identity:", wallet.publicKey.toBase58());

  const balance = await connection.getBalance(wallet.publicKey);
  console.log(
    `Balance: ${(balance / anchor.web3.LAMPORTS_PER_SOL).toFixed(4)} SOL`
  );

  if (balance < 1 * anchor.web3.LAMPORTS_PER_SOL) {
    console.log("⚠️  Warning: Balance low. You need at least 1-2 SOL on Devnet to deploy.");
    console.log("Run: solana airdrop 2", wallet.publicKey.toBase58());
  }

  const hasAnchorToml = fs.existsSync(ANCHOR_TOML_PATH);
  const hasProgramsDir = fs.existsSync(PROGRAMS_DIR);

  if (hasAnchorToml && hasProgramsDir) {
    console.log("✅ Anchor workspace detected.");
    console.log("Next steps:");
    console.log("1. anchor build");
    console.log("2. anchor deploy --provider.cluster devnet");
    console.log(`3. Confirm ${ANCHOR_TOML_PATH} points at the deployed program ID`);
    return;
  }

  console.log("ℹ️  No Anchor workspace detected in this package.");
  console.log("This repository is currently wired around the Solana Memo Program for anchoring.");
  console.log("Memo Program ID: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
  console.log("If you want a custom Anchor program, add an Anchor workspace with Anchor.toml and programs/ first.");
  console.log("Until then, no on-chain custom program deployment is required for the current trust-layer flow.");
}

main().catch((err) => {
  console.error("❌ Deployment preflight failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});

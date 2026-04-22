import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

// Use devnet for testing
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// The Memo Program is the fastest way to anchor data on Solana
export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function loadBackendAuthority(): Keypair {
  const rawSecret = process.env.BACKEND_PRIVATE_KEY || '[]';
  const secretKey = Uint8Array.from(JSON.parse(rawSecret));

  if (secretKey.length === 0) {
    throw new Error('BACKEND_PRIVATE_KEY not found in blockchain-suso/.env');
  }

  return Keypair.fromSecretKey(secretKey);
}

// Your backend's "Authority" wallet (needs to sign for automated anchoring)
export const BACKEND_AUTHORITY = loadBackendAuthority();

export const MERCHANT_WALLET = new PublicKey(
  (process.env.PUBLIC_KEY || 'gVbwmUU2Ej4E1pBPdSHcLn4anq2AXndRhggXMhWCNCg').replace(/"/g, '').trim()
);

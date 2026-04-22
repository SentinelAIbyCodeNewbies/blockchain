import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { connection, MEMO_PROGRAM_ID, BACKEND_AUTHORITY } from './config';

export const anchorFileHash = async (fileHash: string) => {
  const tx = new Transaction().add(
    new TransactionInstruction({
      keys: [{ pubkey: BACKEND_AUTHORITY.publicKey, isSigner: true, isWritable: true }],
      data: Buffer.from(`SentinelAI_Fingerprint:${fileHash}`),
      programId: MEMO_PROGRAM_ID,
    })
  );

  const signature = await connection.sendTransaction(tx, [BACKEND_AUTHORITY]);
  await connection.confirmTransaction(signature);
  
  return {
    signature,
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
  };
};
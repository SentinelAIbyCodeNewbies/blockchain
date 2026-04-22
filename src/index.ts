import express from 'express';
import { anchorFileHash } from './anchor';
import { verifySubscriptionPayment } from './payments';
import { BACKEND_AUTHORITY, MERCHANT_WALLET } from './config';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'blockchain-suso',
    authority: BACKEND_AUTHORITY.publicKey.toBase58(),
    merchantWallet: MERCHANT_WALLET.toBase58(),
  });
});

// Endpoint for FastAPI to call after AI analysis
app.post('/anchor', async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash || typeof hash !== 'string') {
      res.status(400).json({ error: 'hash is required' });
      return;
    }

    const result = await anchorFileHash(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown anchoring error',
    });
  }
});

// Endpoint to verify if a user has paid for Pro
app.post('/verify-pay', async (req, res) => {
  try {
    const { signature, amount } = req.body;
    if (!signature || typeof signature !== 'string') {
      res.status(400).json({ error: 'signature is required' });
      return;
    }

    const result = await verifySubscriptionPayment(signature, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown verification error',
    });
  }
});

app.listen(3001, () => console.log('Blockchain-suso service running on port 3001'));

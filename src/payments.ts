import { connection, MERCHANT_WALLET } from './config';

export const verifySubscriptionPayment = async (txSignature: string, expectedAmount: number) => {
  try {
    const tx = await connection.getTransaction(txSignature, { commitment: 'confirmed' });

    if (!tx) {
      return { success: false, status: "Payment_Not_Found", message: "Transaction not found" };
    }

    // Basic validation for hackathon mode:
    // confirm the merchant wallet participated in the transaction.
    const isValid = tx.transaction.message.accountKeys.some((key) => key.equals(MERCHANT_WALLET));

    return {
      success: isValid,
      status: isValid ? "Pro_Unlocked" : "Payment_Failed",
      message: isValid
        ? "Payment verified successfully"
        : "Merchant wallet was not found in the transaction",
    };
  } catch (error) {
    return {
      success: false,
      status: "Payment_Error",
      message: error instanceof Error ? error.message : "Unknown payment verification error",
    };
  }
};

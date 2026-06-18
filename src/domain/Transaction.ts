enum TransactionDirection {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FAILED = 'failed',
}

interface Transaction {
  transaction_id: string;
  merchant: string;
  amount: number;
  direction: TransactionDirection;
  created_at: string;
  account_id: string;
  status: TransactionStatus;
  account_name: string;
  extra_data?: Record<string, unknown>;
  user_created?: boolean;
}

export {TransactionStatus, TransactionDirection};
export type {Transaction};

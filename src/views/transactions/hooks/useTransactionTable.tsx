import {useMemo} from 'react';
import {isValid, parseISO} from 'date-fns';

import {Transaction} from '@/domain/Transaction';
import {capitalizeFirstLetter} from '@/utils/formatter.utils';
import {
  FlexxColumn,
  FlexxTableRow,
} from '@components/FlexxTable/domain/FlexxTable';

const toTimestamp = (value: string): number | null => {
  const date = parseISO(value);
  return isValid(date) ? date.getTime() : null;
};

const accountColumn: FlexxColumn = {field: 'account', headerName: 'Account'};

const baseColumns: FlexxColumn[] = [
  {field: 'date', headerName: 'Date', dateFormat: 'sm', defaultSort: 'desc'},
  {field: 'merchant', headerName: 'Merchant'},
  {field: 'amount', headerName: 'Amount', currency: true, align: 'right'},
  {field: 'direction', headerName: 'Direction'},
  {field: 'status', headerName: 'Status'},
];

interface UseTransactionTableOptions {
  // The per-account drawer already scopes to one account, so it hides the
  // Account column; the global transactions dashboard shows it.
  showAccount?: boolean;
}

const useTransactionTable = (
  transactions: Transaction[] | undefined,
  {showAccount = false}: UseTransactionTableOptions = {},
) => {
  const columns = useMemo<FlexxColumn[]>(() => {
    if (!showAccount) return baseColumns;
    const [dateColumn, ...rest] = baseColumns;
    return [dateColumn, accountColumn, ...rest];
  }, [showAccount]);

  const rows: FlexxTableRow[] = useMemo(() => {
    if (!transactions) return [];

    return transactions.map(transaction => ({
      data: {
        date: toTimestamp(transaction.created_at),
        ...(showAccount && {account: transaction.account_name}),
        merchant: transaction.merchant,
        amount: transaction.amount,
        direction: capitalizeFirstLetter(transaction.direction),
        status: capitalizeFirstLetter(transaction.status),
      },
    }));
  }, [transactions, showAccount]);

  return {columns, rows};
};

export default useTransactionTable;

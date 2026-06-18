import React from 'react';

import {Stack, Typography} from '@mui/material';
import {useGlobalSearch} from '@core/hooks/useGlobalSearch';
import {FlexxTable} from '@components/FlexxTable/FlexxTable';
import useFetchAccountTransactions from '@/hooks/useFetchAccountTransactions';
import useTransactionTable from '@views/transactions/hooks/useTransactionTable';

interface AccountTransactionsTableProps {
  accountId: string;
}

const AccountTransactionsTable: React.FC<AccountTransactionsTableProps> = ({
  accountId,
}) => {
  const {searchQuery} = useGlobalSearch();
  const {data, isLoading, isError} = useFetchAccountTransactions({
    accountId,
    searchQuery,
  });
  const {columns, rows} = useTransactionTable(data);

  return (
    <Stack gap='1rem' flexGrow={1}>
      <Typography variant='h4'>Transactions</Typography>
      <FlexxTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        emptyState='No transactions found'
      />
    </Stack>
  );
};

export default AccountTransactionsTable;

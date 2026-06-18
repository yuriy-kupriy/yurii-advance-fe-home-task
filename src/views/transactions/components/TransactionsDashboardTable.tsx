'use client';

import React from 'react';

import {useGlobalSearch} from '@core/hooks/useGlobalSearch';
import {FlexxTable} from '@components/FlexxTable/FlexxTable';
import useFetchTransactions from '@/hooks/useFetchTransactions';
import useTransactionTable from '@views/transactions/hooks/useTransactionTable';

const TransactionsDashboardTable: React.FC = () => {
  const {searchQuery} = useGlobalSearch();
  const {data, isLoading, isError} = useFetchTransactions({searchQuery});
  const {columns, rows} = useTransactionTable(data, {showAccount: true});

  return (
    <FlexxTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      emptyState='No transactions found'
    />
  );
};

export default TransactionsDashboardTable;

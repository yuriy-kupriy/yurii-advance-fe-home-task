'use client';

import React from 'react';

import {Account} from '@/domain/Account';
import useFetchAccounts from '@/hooks/useFetchAccounts';
import {useGlobalSearch} from '@core/hooks/useGlobalSearch';
import {FlexxTable} from '@components/FlexxTable/FlexxTable';
import useAccountsDashboardTable from '@views/accounts/hooks/useAccountsDashboardTable';

interface AccountsDashboardTableProps {
  onRowClick?: (account: Account) => void;
}

const AccountsDashboardTable: React.FC<AccountsDashboardTableProps> = ({
  onRowClick,
}) => {
  const {searchQuery} = useGlobalSearch();
  const {data, isLoading, isError} = useFetchAccounts({searchQuery});
  const {columns, rows} = useAccountsDashboardTable(data, onRowClick);

  return (
    <FlexxTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      emptyState='No accounts found'
    />
  );
};

export default AccountsDashboardTable;

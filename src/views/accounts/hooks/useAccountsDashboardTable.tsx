import React, {useMemo} from 'react';

import {Account} from '@/domain/Account';
import {
  FlexxColumn,
  FlexxTableRow,
} from '@components/FlexxTable/domain/FlexxTable';
import AdvanceAccountNumberDisplay from '@components/AdvanceAccountNumberDisplay/AdvanceAccountNumberDisplay';

const columns: FlexxColumn[] = [
  {field: 'name', headerName: 'Name'},
  {field: 'bank', headerName: 'Bank'},
  {field: 'accountNumber', headerName: 'Account Number'},
  {field: 'status', headerName: 'Status'},
  {field: 'balance', headerName: 'Balance', currency: true, align: 'right'},
];

const useAccountsDashboardTable = (
  accounts: Account[] | undefined,
  onRowClick?: (account: Account) => void,
) => {
  const rows: FlexxTableRow[] = useMemo(() => {
    if (!accounts) return [];

    return accounts.map(account => ({
      onClick: onRowClick ? () => onRowClick(account) : undefined,
      data: {
        name: account.name,
        bank: account.bank_name,
        accountNumber: account.account_number ? (
          <AdvanceAccountNumberDisplay
            accountNumber={account.account_number}
            variant='body2'
          />
        ) : (
          'N/A'
        ),
        status: account.status,
        balance: account.balance,
      },
    }));
  }, [accounts, onRowClick]);

  return {columns, rows};
};

export default useAccountsDashboardTable;

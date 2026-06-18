'use client';

import React from 'react';

import AccountsCtas from '@views/accounts/components/AccountsCtas';
import {useAccountDrawer} from '@views/accounts/hooks/useAccountDrawer';
import {useCreateAccount} from '@views/accounts/hooks/useCreateAccount';
import {useMoveMoneyDrawer} from '@views/accounts/hooks/useMoveMoneyDrawer';
import AccountsDashboardTable from '@views/accounts/components/AccountsDashboardTable';

const AccountsView: React.FC = () => {
  const {openForAccount, AccountDrawer} = useAccountDrawer();
  const {openDrawer: openCreateDrawer, CreateAccountDrawer} = useCreateAccount({
    onCreated: openForAccount,
  });
  const {openDrawer: openMoveMoneyDrawer, MoveMoneyDrawer} =
    useMoveMoneyDrawer();

  return (
    <>
      <AccountsCtas
        onAddAccount={openCreateDrawer}
        onMoveMoney={openMoveMoneyDrawer}
      />
      <AccountsDashboardTable onRowClick={openForAccount} />
      {AccountDrawer}
      {CreateAccountDrawer}
      {MoveMoneyDrawer}
    </>
  );
};

export default AccountsView;

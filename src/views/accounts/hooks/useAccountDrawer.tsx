import ReactDOM from 'react-dom';
import React, {useCallback, useMemo, useState} from 'react';

import {Stack} from '@mui/material';
import {Account} from '@/domain/Account';
import {useBoolean} from '@/hooks/useBoolean';
import useFetchAccounts from '@/hooks/useFetchAccounts';
import {useDrawerExpansion} from '@/hooks/useDrawerExpansion';
import DrawerWrapper from '@components/DrawerWrapper/DrawerWrapper';
import MoveMoneyForm from '@views/accounts/components/MoveMoneyForm';
import AccountDrawerHeader from '@views/accounts/components/AccountDrawerHeader';
import AccountTransactionsTable from '@views/accounts/components/AccountTransactionsTable';

export const useAccountDrawer = () => {
  const {value: isOpen, onTrue: setOpen, onFalse: setClosed} = useBoolean();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fallbackAccount, setFallbackAccount] = useState<Account | null>(null);

  // Derive the displayed account from the live accounts cache so the header
  // (balance/status) stays current after an in-drawer transfer. Fall back to
  // the captured object until the list resolves (e.g. a just-created account).
  const {data: accounts} = useFetchAccounts();
  const account = useMemo(
    () =>
      accounts?.find(item => item.account_id === selectedId) ?? fallbackAccount,
    [accounts, selectedId, fallbackAccount],
  );

  // `setClosed` from useBoolean is already a stable callback.
  const closeDrawer = setClosed;

  const {
    collapsedComponent,
    collapsedComponentWidth,
    handleExpand,
    handleCloseExpansion,
    handleCollapseExpansion,
  } = useDrawerExpansion({onCloseDrawer: closeDrawer});

  const openForAccount = useCallback(
    (nextAccount: Account) => {
      handleCollapseExpansion();
      setSelectedId(nextAccount.account_id);
      setFallbackAccount(nextAccount);
      setOpen();
    },
    [handleCollapseExpansion, setOpen],
  );

  const handleMoveMoney = useCallback(() => {
    if (!account) return;
    handleExpand(
      <MoveMoneyForm
        defaultSourceAccountId={account.account_id}
        lockSource
        onSuccess={handleCollapseExpansion}
      />,
      'fill',
    );
  }, [account, handleExpand, handleCollapseExpansion]);

  const AccountDrawer = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return ReactDOM.createPortal(
      <DrawerWrapper
        open={isOpen}
        onClose={handleCloseExpansion}
        removePaddingBottom
        drawerWidth='md'
        actions={[
          {
            icon: 'fluent--dismiss-24-regular',
            onClick: handleCloseExpansion,
          },
        ]}
        extraComponent={collapsedComponent ?? undefined}
        extraComponentWidth={collapsedComponentWidth}
      >
        {account && (
          <Stack gap='2rem' flexGrow={1}>
            <AccountDrawerHeader
              account={account}
              onMoveMoney={handleMoveMoney}
            />
            <AccountTransactionsTable accountId={account.account_id} />
          </Stack>
        )}
      </DrawerWrapper>,
      document.body,
    );
  }, [
    isOpen,
    account,
    handleCloseExpansion,
    handleMoveMoney,
    collapsedComponent,
    collapsedComponentWidth,
  ]);

  return {
    isOpen,
    account,
    openForAccount,
    closeDrawer,
    AccountDrawer,
  };
};

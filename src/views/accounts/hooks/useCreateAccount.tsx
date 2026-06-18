import React, {useCallback} from 'react';

import {Account} from '@/domain/Account';
import useFormDrawer from '@/hooks/useFormDrawer';
import CreateAccountForm from '@views/accounts/components/CreateAccountForm';

interface UseCreateAccountArgs {
  onCreated?: (account: Account) => void;
}

export const useCreateAccount = ({onCreated}: UseCreateAccountArgs = {}) => {
  const renderForm = useCallback(
    (close: () => void) => (
      <CreateAccountForm
        onClose={close}
        onCreated={account => onCreated?.(account)}
      />
    ),
    [onCreated],
  );

  const {isOpen, openDrawer, closeDrawer, Drawer} = useFormDrawer({renderForm});

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    CreateAccountDrawer: Drawer,
  };
};

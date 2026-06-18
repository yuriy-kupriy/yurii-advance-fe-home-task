import React, {useCallback} from 'react';

import useFormDrawer from '@/hooks/useFormDrawer';
import MoveMoneyForm from '@views/accounts/components/MoveMoneyForm';

export const useMoveMoneyDrawer = () => {
  const renderForm = useCallback(
    (close: () => void) => <MoveMoneyForm onSuccess={close} />,
    [],
  );

  const {isOpen, openDrawer, closeDrawer, Drawer} = useFormDrawer({renderForm});

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    MoveMoneyDrawer: Drawer,
  };
};

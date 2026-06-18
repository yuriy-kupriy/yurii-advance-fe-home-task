import React from 'react';

import {Stack} from '@mui/material';
import {ActionButtonConfig} from '@components/AdvanceActionButtons/types';
import AdvanceActionButtons from '@components/AdvanceActionButtons/AdvanceActionButtons';

interface AccountsCtasProps {
  onAddAccount: () => void;
  onMoveMoney: () => void;
}

const AccountsCtas: React.FC<AccountsCtasProps> = ({
  onAddAccount,
  onMoveMoney,
}) => {
  const actions: ActionButtonConfig[] = [
    {
      name: 'Add Account',
      variant: 'outlined',
      onClick: onAddAccount,
      startIcon: 'fluent--add-circle-20-regular',
    },
    {
      name: 'Move Money',
      variant: 'outlined',
      onClick: onMoveMoney,
      startIcon: 'fluent--arrow-swap-20-regular',
    },
  ];

  return (
    <Stack direction='row' gap={'1rem'} alignItems={'center'}>
      <AdvanceActionButtons actions={actions} />
    </Stack>
  );
};

export default AccountsCtas;

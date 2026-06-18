import React from 'react';

import {Chip, Stack, Typography} from '@mui/material';
import {Account, AccountStatus} from '@/domain/Account';
import {ActionButtonConfig} from '@components/AdvanceActionButtons/types';
import AdvanceRoutingNumberDisplay from '@components/AdvanceRoutingNumberDisplay';
import AdvanceCurrencyText from '@components/AdvanceCurrencyText/AdvanceCurrencyText';
import AdvanceActionButtons from '@components/AdvanceActionButtons/AdvanceActionButtons';
import AdvanceAccountNumberDisplay from '@components/AdvanceAccountNumberDisplay/AdvanceAccountNumberDisplay';

interface AccountDrawerHeaderProps {
  account: Account;
  onMoveMoney: () => void;
}

const statusColor: Record<AccountStatus, 'success' | 'default' | 'error'> = {
  [AccountStatus.OPEN]: 'success',
  [AccountStatus.CLOSED]: 'default',
  [AccountStatus.INVALID]: 'error',
};

const Field: React.FC<{label: string; children: React.ReactNode}> = ({
  label,
  children,
}) => (
  <Stack gap='0.25rem'>
    {children}
    <Typography variant='subtitle2' color='text.secondary'>
      {label}
    </Typography>
  </Stack>
);

const AccountDrawerHeader: React.FC<AccountDrawerHeaderProps> = ({
  account,
  onMoveMoney,
}) => {
  const actions: ActionButtonConfig[] = [
    {
      name: 'Move Money',
      variant: 'outlined',
      onClick: onMoveMoney,
      startIcon: 'fluent--arrow-swap-20-regular',
    },
  ];

  return (
    <Stack gap='1.5rem'>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        gap='1rem'
        flexWrap='wrap'
      >
        <Stack gap='0.25rem'>
          <Stack direction='row' alignItems='center' gap='0.75rem'>
            <Typography variant='h1'>{account.name}</Typography>
            <Chip
              label={account.status}
              size='small'
              color={statusColor[account.status] ?? 'default'}
            />
          </Stack>
          <Typography variant='body1' color='text.secondary'>
            {account.bank_name}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction='row' gap='3rem' flexWrap='wrap'>
        <Field label='Account Number'>
          <AdvanceAccountNumberDisplay
            accountNumber={account.account_number}
            variant='h5'
          />
        </Field>
        <Field label='Routing Number'>
          <AdvanceRoutingNumberDisplay
            routingNumber={account.routing_number}
            variant='h5'
          />
        </Field>
        <AdvanceActionButtons
          actions={actions}
          containerProps={{marginLeft: 'auto'}}
        />
      </Stack>

      <Field label='Balance'>
        <AdvanceCurrencyText amount={account.balance} variant='h4' />
      </Field>
    </Stack>
  );
};

export default AccountDrawerHeader;

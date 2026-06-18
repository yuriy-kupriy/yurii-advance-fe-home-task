'use client';

import React from 'react';

import {Typography} from '@mui/material';
import AccountsView from '@views/accounts/AccountsView';
import FlexxDashboardWrapper from '@/components/FlexxDashboardWrapper';

const AccountsPage = () => {
  return (
    <FlexxDashboardWrapper>
      <Typography variant='h4' sx={{fontWeight: 600}}>
        Accounts
      </Typography>
      <AccountsView />
    </FlexxDashboardWrapper>
  );
};

export default AccountsPage;

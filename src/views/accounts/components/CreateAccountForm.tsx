import React from 'react';
import {useForm} from 'react-hook-form';

import {LoadingButton} from '@mui/lab';
import {Account} from '@/domain/Account';
import {Stack, Typography} from '@mui/material';
import {MAX_NAME_LENGTH} from '@/constants/fieldValidation';
import useCreateAccountMutation from '@/hooks/useCreateAccountMutation';
import ControlledTextField from '@components/FlexxCustomTextInputs/ControlledTextField';

interface CreateAccountFormValues {
  name: string;
  bank_name: string;
  routing_number: string;
  account_number: string;
}

interface CreateAccountFormProps {
  onClose: () => void;
  onCreated: (account: Account) => void;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onClose,
  onCreated,
}) => {
  const {mutate: createAccount, isLoading: isSubmitting} =
    useCreateAccountMutation({
      onSuccess: account => {
        onClose();
        onCreated(account);
      },
    });

  const {control, handleSubmit, formState} = useForm<CreateAccountFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      bank_name: '',
      routing_number: '',
      account_number: '',
    },
  });

  const onSubmit = (values: CreateAccountFormValues) => {
    createAccount(values);
  };

  return (
    <Stack
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      gap='1rem'
      flexGrow={1}
    >
      <Typography variant='h1'>Create Account</Typography>

      <ControlledTextField
        control={control}
        name='name'
        label='Account Name'
        placeholder='Enter account name'
        required
        rules={{
          required: 'Account name is required',
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: `Account name must be at most ${MAX_NAME_LENGTH} characters`,
          },
        }}
      />

      <ControlledTextField
        control={control}
        name='bank_name'
        label='Bank Name'
        placeholder='Enter bank name'
        required
        rules={{
          required: 'Bank name is required',
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: `Bank name must be at most ${MAX_NAME_LENGTH} characters`,
          },
        }}
      />

      <ControlledTextField
        control={control}
        name='routing_number'
        label='Routing Number'
        placeholder='Enter routing number'
        required
        rules={{
          required: 'Routing number is required',
          pattern: {
            value: /^\d{9}$/,
            message: 'Routing number must be 9 digits',
          },
        }}
      />

      <ControlledTextField
        control={control}
        name='account_number'
        label='Account Number'
        placeholder='Enter account number'
        required
        rules={{
          required: 'Account number is required',
          pattern: {
            value: /^\d{4,17}$/,
            message: 'Account number must be 4–17 digits',
          },
        }}
      />

      <LoadingButton
        type='submit'
        variant='contained'
        fullWidth
        disabled={!formState.isValid}
        loading={isSubmitting}
      >
        Add Account
      </LoadingButton>
    </Stack>
  );
};

export default CreateAccountForm;

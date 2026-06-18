import React, {useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';

import {LoadingButton} from '@mui/lab';
import useMoveMoney from '@/hooks/useMoveMoney';
import {Account, AccountStatus} from '@/domain/Account';
import useFetchAccounts from '@/hooks/useFetchAccounts';
import {Checkbox, FormControlLabel, Stack, Typography} from '@mui/material';
import FlexxTextField from '@components/FlexxCustomTextInputs/FlexxTextField';
import ControlledTextField from '@components/FlexxCustomTextInputs/ControlledTextField';
import {SelectOption} from '@components/FlexxCustomTextInputs/domain/FlexxTextFields.type';

interface MoveMoneyFormValues {
  source_account_id: string;
  destination_account_id: string;
  amount: string;
  confirmed: boolean;
}

interface MoveMoneyFormProps {
  defaultSourceAccountId?: string;
  lockSource?: boolean;
  onSuccess?: () => void;
}

const toOption = (account: Account): SelectOption => ({
  id: account.account_id,
  value: account.account_id,
  label: `${account.name} · ${account.bank_name}`,
});

const MoveMoneyForm: React.FC<MoveMoneyFormProps> = ({
  defaultSourceAccountId,
  lockSource,
  onSuccess,
}) => {
  const {data: accounts} = useFetchAccounts();
  const {mutate: moveMoney, isLoading: isSubmitting} = useMoveMoney({
    onSuccess,
  });

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState,
  } = useForm<MoveMoneyFormValues>({
    mode: 'onChange',
    defaultValues: {
      source_account_id: defaultSourceAccountId ?? '',
      destination_account_id: '',
      amount: '',
      confirmed: false,
    },
  });

  const sourceAccountId = watch('source_account_id');
  const confirmed = watch('confirmed');

  const openAccounts = useMemo(
    () =>
      (accounts ?? []).filter(account => account.status === AccountStatus.OPEN),
    [accounts],
  );

  const sourceOptions = useMemo(() => {
    const options = openAccounts.map(toOption);

    if (lockSource && defaultSourceAccountId) {
      const isLockedIncluded = options.some(
        option => option.value === defaultSourceAccountId,
      );
      if (!isLockedIncluded) {
        const lockedAccount = accounts?.find(
          account => account.account_id === defaultSourceAccountId,
        );
        if (lockedAccount) {
          return [toOption(lockedAccount), ...options];
        }
      }
    }

    return options;
  }, [openAccounts, accounts, lockSource, defaultSourceAccountId]);

  const destinationOptions = useMemo(
    () =>
      openAccounts
        .filter(account => account.account_id !== sourceAccountId)
        .map(toOption),
    [openAccounts, sourceAccountId],
  );

  const sourceBalance = useMemo(
    () =>
      accounts?.find(account => account.account_id === sourceAccountId)
        ?.balance,
    [accounts, sourceAccountId],
  );

  const onSubmit = (values: MoveMoneyFormValues) => {
    moveMoney({
      source_account_id: values.source_account_id,
      destination_account_id: values.destination_account_id,
      amount: Number(values.amount),
    });
  };

  const canSubmit = formState.isValid && confirmed;

  return (
    <Stack
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      gap='1rem'
      flexGrow={1}
    >
      <Typography variant='h1'>Move Money</Typography>

      <Controller
        name='source_account_id'
        control={control}
        rules={{required: 'Source account is required'}}
        render={({field, fieldState}) => (
          <FlexxTextField
            name={field.name}
            label='Source Account'
            placeholder='Select source account'
            required
            select
            disabled={lockSource}
            disableClearable
            options={sourceOptions}
            value={field.value}
            onOptionChange={(_event, option) => {
              const nextSourceId = option?.value ?? '';
              field.onChange(nextSourceId);

              if (getValues('destination_account_id') === nextSourceId) {
                setValue('destination_account_id', '', {shouldValidate: true});
              }

              void trigger(['destination_account_id', 'amount']);
            }}
            externalError={!!fieldState.error}
            externalHelperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name='destination_account_id'
        control={control}
        rules={{
          required: 'Destination account is required',
          validate: value =>
            value !== getValues('source_account_id') ||
            'Source and destination must differ',
        }}
        render={({field, fieldState}) => (
          <FlexxTextField
            name={field.name}
            label='Destination Account'
            placeholder='Select destination account'
            required
            select
            disableClearable
            options={destinationOptions}
            value={field.value}
            onOptionChange={(_event, option) =>
              field.onChange(option?.value ?? '')
            }
            externalError={!!fieldState.error}
            externalHelperText={fieldState.error?.message}
          />
        )}
      />

      <ControlledTextField
        control={control}
        name='amount'
        label='Amount'
        placeholder='Enter amount'
        required
        currency
        min={0}
        rules={{
          required: 'Amount is required',
          validate: value => {
            const amount = Number(value);
            if (!(amount > 0)) return 'Amount must be greater than 0';
            if (sourceBalance !== undefined && amount > sourceBalance) {
              return 'Amount exceeds available balance';
            }
            return true;
          },
        }}
      />

      <Controller
        name='confirmed'
        control={control}
        render={({field}) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={event => field.onChange(event.target.checked)}
              />
            }
            label='I confirm this transfer'
          />
        )}
      />

      <LoadingButton
        type='submit'
        variant='contained'
        fullWidth
        disabled={!canSubmit}
        loading={isSubmitting}
      >
        Move Money
      </LoadingButton>
    </Stack>
  );
};

export default MoveMoneyForm;

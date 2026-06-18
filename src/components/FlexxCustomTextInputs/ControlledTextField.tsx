import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import FlexxTextField from '@components/FlexxCustomTextInputs/FlexxTextField';
import {FlexxTextFieldProps} from '@components/FlexxCustomTextInputs/domain/FlexxTextFields.type';

// Wires a react-hook-form field to FlexxTextField once: value, the
// event->onChange unwrap, and error -> externalError/externalHelperText. All
// other FlexxTextField props (label, placeholder, required, currency, min, ...)
// pass straight through. Use it for plain controlled text/amount inputs; the
// select and checkbox fields keep their bespoke Controllers.
type ControlledTextFieldProps<TValues extends FieldValues> = Omit<
  FlexxTextFieldProps,
  'name' | 'value' | 'onChange' | 'externalError' | 'externalHelperText'
> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  rules?: RegisterOptions<TValues, FieldPath<TValues>>;
};

const ControlledTextField = <TValues extends FieldValues>({
  control,
  name,
  rules,
  ...fieldProps
}: ControlledTextFieldProps<TValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({field, fieldState}) => (
      <FlexxTextField
        {...fieldProps}
        name={field.name}
        value={field.value}
        onChange={event => field.onChange(event.target.value)}
        externalError={!!fieldState.error}
        externalHelperText={fieldState.error?.message}
      />
    )}
  />
);

export default ControlledTextField;

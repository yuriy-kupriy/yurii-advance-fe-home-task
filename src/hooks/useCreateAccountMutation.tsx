import {toast} from 'react-toastify';
import {useMutation, useQueryClient} from 'react-query';

import {Account} from '@/domain/Account';
import {QueryClientIds} from '@/QueryClient/queryClient.ids';
import flexxApiService, {
  CreateAccountRequest,
} from '@/flexxApi/flexxApiService';

const useCreateAccountMutation = (options?: {
  onSuccess?: (account: Account) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, CreateAccountRequest>(
    body => flexxApiService().createAccount(body),
    {
      onSuccess: account => {
        queryClient.invalidateQueries([QueryClientIds.ACCOUNTS]);
        toast.success('Account created successfully');
        options?.onSuccess?.(account);
      },
      // The user-facing error toast is emitted by FlexxApiClientService for
      // non-GET failures; we only forward the error so the caller can react
      // (the drawer stays open because it closes solely in onSuccess).
      onError: error => {
        options?.onError?.(error);
      },
    },
  );
};

export default useCreateAccountMutation;

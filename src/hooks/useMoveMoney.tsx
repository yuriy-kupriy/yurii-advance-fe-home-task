import {toast} from 'react-toastify';
import {useMutation, useQueryClient} from 'react-query';

import {Transaction} from '@/domain/Transaction';
import {QueryClientIds} from '@/QueryClient/queryClient.ids';
import flexxApiService, {MoveMoneyRequest} from '@/flexxApi/flexxApiService';

const useMoveMoney = (options?: {
  onSuccess?: (transactions: Transaction[]) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<Transaction[], Error, MoveMoneyRequest>(
    body => flexxApiService().moveMoney(body),
    {
      onSuccess: transactions => {
        queryClient.invalidateQueries([QueryClientIds.ACCOUNTS]);
        queryClient.invalidateQueries([QueryClientIds.TRANSACTIONS]);
        queryClient.invalidateQueries([QueryClientIds.ACCOUNT_TRANSACTIONS]);
        toast.success('Money moved successfully');
        options?.onSuccess?.(transactions);
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

export default useMoveMoney;

import {useQuery} from 'react-query';

import {Transaction} from '@/domain/Transaction';
import flexxApiService from '@/flexxApi/flexxApiService';
import {QueryClientIds} from '@/QueryClient/queryClient.ids';

interface useFetchAccountTransactionsArgs {
  accountId?: string;
  searchQuery?: string;
}

const useFetchAccountTransactions = ({
  accountId,
  searchQuery,
}: useFetchAccountTransactionsArgs) => {
  return useQuery<Transaction[]>(
    [QueryClientIds.ACCOUNT_TRANSACTIONS, accountId, searchQuery],
    () => {
      if (!accountId) {
        return Promise.reject(new Error('accountId is required'));
      }

      return flexxApiService().fetchAccountTransactions({
        account_id: accountId,
        search_term: searchQuery,
      });
    },
    {enabled: !!accountId},
  );
};

export default useFetchAccountTransactions;

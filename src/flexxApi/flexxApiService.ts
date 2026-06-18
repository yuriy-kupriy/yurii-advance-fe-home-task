import {Transaction} from '@/domain/Transaction';
import {Account, AccountStatus} from '@/domain/Account';
import {get, post, put, remove} from '@/flexxApi/FlexxApiClientService';

interface CreateAccountRequest {
  name: string;
  routing_number: string;
  account_number: string;
  bank_name: string;
  bank_icon?: string;
  status?: AccountStatus;
  balance?: number;
}

interface MoveMoneyRequest {
  source_account_id: string;
  destination_account_id: string;
  amount: number;
  merchant?: string;
}

class FlexxApiService {
  private formatQueryParams(
    params?: Record<
      string,
      string | number | boolean | undefined | string[] | number[] | Date
    >,
  ): string {
    if (!params) return '';
    const queryParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, String(item)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    }
    return queryParams.toString();
  }

  async fetchAccounts(params: {search_term?: string}): Promise<Account[]> {
    const queryParams = this.formatQueryParams(params);
    return get<Account[]>({endpoint: `pages/accounts?${queryParams}`});
  }

  async createAccount(body: CreateAccountRequest): Promise<Account> {
    return post<Account>({endpoint: 'pages/accounts', body});
  }

  async fetchAccountTransactions(params: {
    account_id: string;
    search_term?: string;
  }): Promise<Transaction[]> {
    const {account_id, ...rest} = params;
    const queryParams = this.formatQueryParams(rest);
    return get<Transaction[]>({
      endpoint: `pages/accounts/${account_id}/transactions?${queryParams}`,
    });
  }

  async fetchTransactions(params: {
    search_term?: string;
  }): Promise<Transaction[]> {
    const queryParams = this.formatQueryParams(params);
    return get<Transaction[]>({endpoint: `pages/transactions?${queryParams}`});
  }

  async moveMoney(body: MoveMoneyRequest): Promise<Transaction[]> {
    return post<Transaction[]>({endpoint: 'pages/move-money', body});
  }
}

let instance: FlexxApiService | null = null;

const flexxApiService = (): FlexxApiService => {
  if (!instance) {
    instance = new FlexxApiService();
  }

  return instance;
};

export default flexxApiService;

export {get, put, post, remove, FlexxApiService};
export type {MoveMoneyRequest, CreateAccountRequest};

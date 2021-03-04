import Transaction from '../models/Transaction';

interface Transactions {
  transactions: Transaction[];
  balance: Balance;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transactions {
    const transactions = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((acumulador, valorAtual) => {
      if (valorAtual.type === 'income') {
        return acumulador + valorAtual.value;
      }
      return acumulador;
    }, 0);

    const outcome = this.transactions.reduce((acumulador, valorAtual) => {
      if (valorAtual.type === 'outcome') {
        return acumulador + valorAtual.value;
      }
      return acumulador;
    }, 0);

    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome') {
      const saldo = this.getBalance().total;
      if (saldo - transaction.value < 0) {
        throw Error('The desired amount exceeds the account limit');
      }
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;

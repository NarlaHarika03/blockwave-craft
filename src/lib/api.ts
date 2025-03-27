
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = "http://127.0.0.1:5000";

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  proof: number;
  previous_hash: string;
}

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
}

export interface ChainResponse {
  chain: Block[];
  length: number;
}

export interface TransactionResponse {
  message: string;
}

export interface MineResponse {
  message: string;
  block: Block;
}

export const fetchChain = async (): Promise<ChainResponse> => {
  try {
    const response = await axios.get(`${API_URL}/chain`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blockchain:", error);
    toast({
      title: "Error",
      description: "Failed to fetch blockchain data",
      variant: "destructive",
    });
    return { chain: [], length: 0 };
  }
};

export const mineBlock = async (): Promise<MineResponse> => {
  try {
    const response = await axios.get(`${API_URL}/mine`);
    toast({
      title: "Success",
      description: "New block mined successfully",
    });
    return response.data;
  } catch (error) {
    console.error("Error mining block:", error);
    toast({
      title: "Error",
      description: "Failed to mine a new block",
      variant: "destructive",
    });
    throw error;
  }
};

export const createTransaction = async (
  sender: string,
  recipient: string,
  amount: string
): Promise<TransactionResponse> => {
  try {
    const response = await axios.post(`${API_URL}/transactions/new`, {
      sender,
      recipient,
      amount: parseFloat(amount)
    });
    toast({
      title: "Success",
      description: "Transaction created successfully",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    toast({
      title: "Error",
      description: "Failed to create transaction",
      variant: "destructive",
    });
    throw error;
  }
};

import { PeraWalletConnect } from "@perawallet/connect";
import { useState } from "react";

const peraWallet = new PeraWalletConnect();

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnect = () => {
    peraWallet.disconnect();
    setAccount(null);
  };

  return { account, connect, disconnect };
}

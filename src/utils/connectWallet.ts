import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export async function connectWallet(): Promise<string> {
  const accounts = await peraWallet.connect();
  return accounts[0]; // the user address
}

export function disconnectWallet() {
  return peraWallet.disconnect();
}

export function reconnectWallet() {
  return peraWallet.reconnectSession();
}

export default peraWallet;

import detectEthereumProvider from "@metamask/detect-provider";
import { BigNumber, ethers } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/localStorage";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

function createCtx<ContextType>() {
  const ctx = createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

const [makeWallet, CtxProvider] = createCtx<WalletContextType>();
export const useWallet = makeWallet;

export interface WalletContextType {
  provider: ethers.providers.Web3Provider,
  account: string,
  balance: BigNumber,
  status: ConnectionStatus,
  connect: () => Promise<void>,
  disconnect: () => Promise<void>,
}


export interface WalletProviderProps {
  allowedChains?: string[]
}

export const WalletProvider: React.FC<WalletProviderProps & React.ReactNode> = ({ children }) => {

  const [status, setConnStatus] = useLocalStorage<ConnectionStatus>('spuris.connectionStatus','disconnected');
  const [account, setAccount] = useState<string>("")
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

  async function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      console.log('no more accounts found');
      await disconnect();
    } else {
      const acc = accounts[0];
      console.log(`got accounts: ${JSON.stringify(accounts)}`);
      setAccount(acc);
      console.log(`got account: ${JSON.stringify(acc)}`);
      await provider.getBalance(acc).then(setBalance);
      setConnStatus('connected');
    }
  }

  function doReload(_chainId: string) { window.location.reload() }

  async function checkConnection() {
    const ethProvider = await detectEthereumProvider();

    if ( ethProvider !== window.ethereum) {
      throw new Error("metamask is not installed or active")
    }

    if ( status === "connected") {
      try {
        const accounts = await provider.send('eth_accounts', []);
        await handleAccountsChanged(accounts);
        (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
        (window.ethereum as any).on('chainChanged', doReload);
      } catch (err: any) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
          await disconnect();
        } else {
          console.error(err);
        }
      }
    }
  }

  async function connect() {
    console.info("starting connect on wallet")
    if (account !== "") {
      return;
    }
    try {
      const accounts = await provider.send('eth_requestAccounts', [{eth_accounts:[]}]);
      await handleAccountsChanged(accounts);
      const newAccounts = await provider.send("wallet_requestPermissions", [{ eth_accounts: [] }]);
      console.log(`newAccounts: ${JSON.stringify(newAccounts[0].caveats[1])}`)
    } catch (err: any) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    }
  }

  async function disconnect() {
    setAccount("");
    setConnStatus("disconnected");
  }

  useEffect(() => {
    checkConnection()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => {    
    return {
      provider,
      account,
      balance,
      status,
      connect,
      disconnect,
    }
  }, [status, provider, account, balance]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <CtxProvider value={value}>{children}</CtxProvider>
  )
}

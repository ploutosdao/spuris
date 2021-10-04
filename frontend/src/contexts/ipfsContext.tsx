import { IPFS } from 'ipfs-core';
import { create } from 'ipfs-client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

function createCtx<ContextType>() {
  const ctx = createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

const [makeIpfs, CtxProvider] = createCtx<IpfsContextType>();
export const useIpfs = makeIpfs;

export interface IpfsContextType {
  ready: boolean,
  initError: any,
  api?: IPFS | null,
}


export interface IpfsProviderProps {
  repo: string
}

export const IpfsProvider: React.FC<IpfsProviderProps & React.ReactNode> = ({ repo, children }) => {
  const [isIpfsReady, setIpfsReady] = useState(false);
  const [ipfsInitError, setIpfsInitError] = useState<any>(null);
  const [handle, setHandle] = useState<IPFS|null>(null);

  useEffect(() => {
    async function startIpfs() {
      if (handle) {
        console.log("IPFS already started");        
      } else {
        try {
          console.time('IPFS started');
          // const hh = await create({
          //   repo,
          //   init: {
          //     emptyRepo: true,
          //     algorithm: "Ed25519"
          //   }
          // });
          const hh = await create({
            http: repo,
          });
          setHandle(hh);
          console.timeEnd('IPFS started');
        } catch (err) {
          console.error("IPFS init error:", err);
          setHandle(null);
          setIpfsInitError(err);
        }
      }
    }

    startIpfs();
    return () => {
      if (handle && handle.stop) {
        console.log("stopping IPFS");
        handle.stop().catch(err => console.error(err));
        setHandle(null);
        setIpfsReady(false);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => {
    return {
      ready: isIpfsReady,
      initError: ipfsInitError,
      api: handle,
    }
  }, [isIpfsReady, ipfsInitError, handle]);
  return (
    <CtxProvider value={value}>{children}</CtxProvider>
  )
}
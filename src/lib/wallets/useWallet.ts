import { useAccount, useNetwork, useSigner, useBalance } from "wagmi";
import { useState } from 'react'
import { REQUEST_API_URL } from "config/backend";
import { useThrottleFn } from 'react-use';

let lock = false

export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const balance = useBalance({address})
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [user] = useState(null)
  const [loading, setLoading] = useState(false)

  useThrottleFn(async () => {
    if (!user && isConnected && !loading && !lock) {
      lock = true
      try {
        await fetch(`${REQUEST_API_URL}/a/u/scaned`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            net: chain?.network,
            address
          })
        })
        // const json = await res.json()
      } catch (error) {}
      lock = false
      setLoading(true)
    }
    
  }, 200, [])

  return {
    account: address,
    balance,
    active: isConnected,
    connector,
    chainId: chain?.id,
    signer: signer ?? undefined,
  };
}

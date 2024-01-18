import { getToken } from "config/tokens";
import { BigNumber } from "ethers";
import useSWR from "swr";
import { TokenPricesData } from "./types";
import { useOracleKeeperFetcher } from "./useOracleKeeperFetcher";
import { parseContractPrice } from "./utils";
import { DEX_STATS_API_URL } from "config/backend";
import { zeroAddress } from "viem";
import { request } from "lib/request";

type TokenPricesDataResult = {
  pricesData?: TokenPricesData;
  updatedAt?: number;
};

export function useTokenRecentPrices(chainId: number): TokenPricesDataResult {
  const oracleKeeperFetcher = useOracleKeeperFetcher(chainId);

  const { data } = useSWR([chainId, oracleKeeperFetcher.oracleKeeperUrl, "useTokenRecentPrices"], {
    fetcher: async ([chainId]) => {

      const url = `${DEX_STATS_API_URL}/a/quote/quote/s/r`

      try {
        const result: TokenPricesData = {};
        // const response = await fetch(url)
        const response = await request({
          url,
          data: {
            "id": 32,
          }
        });
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        let tokenConfig: any;
        // const json = await response.json()
        try {
          tokenConfig = getToken(chainId, zeroAddress);
        } catch (e) {
          // ignore unknown token errors

          return;
        }
        result[zeroAddress] = {
          minPrice: parseContractPrice(BigNumber.from(response.data.o), tokenConfig.decimals),
          maxPrice: parseContractPrice(BigNumber.from(response.data.h), tokenConfig.decimals),
        };
        return result
      } catch {

      }
      // return oracleKeeperFetcher.fetchTickers().then((priceItems) => {
      //   const result: TokenPricesData = {};

      //   priceItems.forEach((priceItem) => {
      //     let tokenConfig: any;

      //     try {
      //       tokenConfig = getToken(chainId, priceItem.tokenAddress);
      //     } catch (e) {
      //       // ignore unknown token errors

      //       return;
      //     }

      //     result[tokenConfig.address] = {
      //       minPrice: parseContractPrice(BigNumber.from(priceItem.minPrice), tokenConfig.decimals),
      //       maxPrice: parseContractPrice(BigNumber.from(priceItem.maxPrice), tokenConfig.decimals),
      //     };
      //   });

      //   const wrappedToken = getWrappedToken(chainId);

      //   if (result[wrappedToken.address] && !result[NATIVE_TOKEN_ADDRESS]) {
      //     result[NATIVE_TOKEN_ADDRESS] = result[wrappedToken.address];
      //   }

      //   return {
      //     pricesData: result,
      //     updatedAt: Date.now(),
      //   };
      // })
    },
    refreshWhenHidden: true,
  });

  return {
    pricesData: data?.pricesData,
    updatedAt: data?.updatedAt,
  };
}

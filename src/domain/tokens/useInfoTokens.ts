// import VaultReader from "abis/VaultReader.json";
import { DEX_STATS_API_URL } from "config/backend";
import { getContract } from "config/contracts";
import { getTokens, getV1Tokens, getWhitelistedV1Tokens } from "config/tokens";
import { BigNumber, ethers, Signer } from "ethers";
// import { contractFetcher } from "lib/contracts";
import { DEFAULT_MAX_USDG_AMOUNT, MAX_PRICE_DEVIATION_BASIS_POINTS, USD_DECIMALS, USDG_ADDRESS } from "lib/legacy";
import { BASIS_POINTS_DIVISOR } from "config/factors";
import { bigNumberify, expandDecimals } from "lib/numbers";
import useSWR from "swr";
import { InfoTokens, Token, TokenInfo } from "./types";
import { getSpread } from "./utils";
// import { zeroAddress } from "viem";
import { request } from "lib/request";
import { WOW } from "config/chains";

export function useInfoTokens(
  signer: Signer | undefined,
  chainId: number,
  active: boolean,
  tokenBalances?: BigNumber[],
  fundingRateInfo?: BigNumber[],
  vaultPropsLength?: number
) {
  const tokens = getV1Tokens(chainId);
  // const vaultReaderAddress = getContract(chainId, "VaultReader");
  // const vaultAddress = getContract(chainId, "Vault");
  // const positionRouterAddress = getContract(chainId, "PositionRouter");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");

  const whitelistedTokens = getWhitelistedV1Tokens(chainId);
  // const whitelistedTokenAddresses = whitelistedTokens.map((token) => token.address);

  // console.log('vaultTokenInfo', signer, VaultReader)
  // const url = `${DEX_STATS_API_URL}/a/quote/f/r`
  // const { data: vaultTokenInfo } = useSWR<BigNumber[], any>(
  //   // [`useInfoTokens:${active}`, chainId, vaultReaderAddress, "getVaultTokenInfoV4"],
  //   url,
  //   {
  //     fetcher: async () => {

  //     }
  //     // fetcher: contractFetcher(signer, VaultReader, [
  //     //   vaultAddress,
  //     //   positionRouterAddress,
  //     //   nativeTokenAddress,
  //     //   expandDecimals(1, 18),
  //     //   whitelistedTokenAddresses,
  //     // ]) as any,
  //   }
  // );

  // const indexPricesUrl = getServerUrl(chainId, "/prices");
  const indexPricesUrl = `${DEX_STATS_API_URL}/a/quote/quote/s/l`;
  const alltokens = getTokens(WOW)

  const { data: res } = useSWR(indexPricesUrl, {
    // @ts-ignore spread args incorrect type
    fetcher: (url) => request({
      url,
      data: {
        "tickerIds": tokens.map(item => item.id).filter(Boolean),
      }
    }),
    refreshInterval: 500,
    refreshWhenHidden: true,
  });


  const closes = {}
  const vaultTokenInfo: BigNumber[] = []
  if (res) {
    for (const [key, value] of Object.entries(res.data) as any) {
      const token = alltokens.find(item => item.id! === +key)!
      // const json = await response.json()
      const n = ethers.utils.parseUnits(String(value.c), 12)
      closes[token.address] = n
      // {
      //   minPrice: parseContractPrice(BigNumber.from(value.c), tokenConfig.decimals),
      //   maxPrice: parseContractPrice(BigNumber.from(value.h), tokenConfig.decimals),
      // };
      // console.log('vaultTokenInfo', n, value.c, token)
      vaultTokenInfo.push(n)
    }
  }
  // console.log('vaultTokenInfo', vaultTokenInfo)
  // const close = bigNumberify(Math.pow(10, 12) * 1 || 0)!
  // const open = bigNumberify(Math.pow(10, 12) * 1 || 0)!
  // const hight = bigNumberify(Math.pow(10, 12) * 1 || 0)!
  // const low = bigNumberify(Math.pow(10, 12) * 1 || 0)!

  return {
    infoTokens: getInfoTokens(
      tokens,
      tokenBalances,
      whitelistedTokens,
      vaultTokenInfo,
      fundingRateInfo,
      vaultPropsLength,
      closes,
      nativeTokenAddress
    ),
  };
}

function getInfoTokens(
  tokens: Token[],
  tokenBalances: BigNumber[] | undefined,
  whitelistedTokens: Token[],
  vaultTokenInfo: BigNumber[] | undefined,
  fundingRateInfo: BigNumber[] | undefined,
  vaultPropsLength: number | undefined,
  indexPrices: { [address: string]: BigNumber },
  nativeTokenAddress: string
): InfoTokens {
  if (!vaultPropsLength) {
    vaultPropsLength = 15;
  }
  const fundingRatePropsLength = 2;
  const infoTokens: InfoTokens = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = JSON.parse(JSON.stringify(tokens[i])) as TokenInfo;

    if (tokenBalances) {
      token.balance = tokenBalances[i];
    }

    if (token.address === USDG_ADDRESS) {
      token.minPrice = expandDecimals(1, USD_DECIMALS);
      token.maxPrice = expandDecimals(1, USD_DECIMALS);
    }

    infoTokens[token.address] = token;
  }

  for (let i = 0; i < whitelistedTokens.length; i++) {
    const token = JSON.parse(JSON.stringify(whitelistedTokens[i])) as TokenInfo;

    if (vaultTokenInfo?.length) {
      vaultTokenInfo[i] = vaultTokenInfo[i] ?? bigNumberify(1)
      token.poolAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength];
      token.reservedAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 1];
      token.availableAmount = token.poolAmount?.sub(token.reservedAmount);
      token.usdgAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 2];
      token.redemptionAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 3];
      token.weight = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 4];
      token.bufferAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 5];
      token.maxUsdgAmount = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 6];
      token.globalShortSize = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 7];
      token.maxGlobalShortSize = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 8];
      token.maxGlobalLongSize = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 9];
      token.minPrice = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 10];
      token.maxPrice = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 11];
      token.spread = getSpread({
        minPrice: token.minPrice,
        maxPrice: token.maxPrice,
      });
      token.guaranteedUsd = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 12];
      token.maxPrimaryPrice = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 13];
      token.minPrimaryPrice = vaultTokenInfo[i]//vaultTokenInfo[i * vaultPropsLength + 14];

      // save minPrice and maxPrice as setTokenUsingIndexPrices may override it
      token.contractMinPrice = token.minPrice;
      token.contractMaxPrice = token.maxPrice;

      token.maxAvailableShort = bigNumberify(0)!;

      token.hasMaxAvailableShort = false;
      if (token.maxGlobalShortSize.gt(0)) {
        token.hasMaxAvailableShort = true;
        if (token.maxGlobalShortSize.gt(token.globalShortSize)) {
          token.maxAvailableShort = token.maxGlobalShortSize.sub(token.globalShortSize);
        }
      }

      if (token.maxUsdgAmount.eq(0)) {
        token.maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
      }

      token.availableUsd = token.isStable
        ? token.poolAmount.mul(token.minPrice).div(expandDecimals(1, token.decimals))
        : token.availableAmount.mul(token.minPrice).div(expandDecimals(1, token.decimals));

      token.maxAvailableLong = bigNumberify(0)!;
      token.hasMaxAvailableLong = false;
      if (token.maxGlobalLongSize.gt(0)) {
        token.hasMaxAvailableLong = true;

        if (token.maxGlobalLongSize.gt(token.guaranteedUsd)) {
          const remainingLongSize = token.maxGlobalLongSize.sub(token.guaranteedUsd);
          token.maxAvailableLong = remainingLongSize.lt(token.availableUsd) ? remainingLongSize : token.availableUsd;
        }
      } else {
        token.maxAvailableLong = token.availableUsd;
      }

      token.maxLongCapacity =
        token.maxGlobalLongSize.gt(0) && token.maxGlobalLongSize.lt(token.availableUsd.add(token.guaranteedUsd))
          ? token.maxGlobalLongSize
          : token.availableUsd.add(token.guaranteedUsd);

      token.managedUsd = token.availableUsd.add(token.guaranteedUsd);
      token.managedAmount = token.managedUsd.mul(expandDecimals(1, token.decimals)).div(token.minPrice);

      setTokenUsingIndexPrices(token, indexPrices, nativeTokenAddress);
    }

    if (fundingRateInfo) {
      token.fundingRate = fundingRateInfo[i * fundingRatePropsLength];
      token.cumulativeFundingRate = fundingRateInfo[i * fundingRatePropsLength + 1];
    }

    if (infoTokens[token.address]) {
      token.balance = infoTokens[token.address].balance;
    }

    infoTokens[token.address] = token;
  }

  return infoTokens;
}

function setTokenUsingIndexPrices(
  token: TokenInfo,
  indexPrices: { [address: string]: BigNumber },
  nativeTokenAddress: string
) {
  if (!indexPrices) {
    return;
  }

  const tokenAddress = token.isNative ? nativeTokenAddress : token.address;

  const indexPrice = indexPrices[tokenAddress];

  // console.log('indexPrice', indexPrice, tokenAddress)

  if (!indexPrice) {
    return;
  }

  const indexPriceBn = bigNumberify(indexPrice)!;

  if (indexPriceBn.eq(0)) {
    return;
  }

  const spread = token.maxPrice!.sub(token.minPrice!);
  const spreadBps = spread.mul(BASIS_POINTS_DIVISOR).div(token.maxPrice!.add(token.minPrice!).div(2));

  if (spreadBps.gt(MAX_PRICE_DEVIATION_BASIS_POINTS - 50)) {
    // only set one of the values as there will be a spread between the index price and the Chainlink price
    if (indexPriceBn.gt(token.minPrimaryPrice!)) {
      token.maxPrice = indexPriceBn;
    } else {
      token.minPrice = indexPriceBn;
    }
    return;
  }

  const halfSpreadBps = spreadBps.div(2).toNumber();
  token.maxPrice = indexPriceBn.mul(BASIS_POINTS_DIVISOR + halfSpreadBps).div(BASIS_POINTS_DIVISOR);
  token.minPrice = indexPriceBn.mul(BASIS_POINTS_DIVISOR - halfSpreadBps).div(BASIS_POINTS_DIVISOR);
}

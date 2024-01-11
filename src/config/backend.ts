import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, BCS_MAINNET } from "./chains";

export const GMX_STATS_API_URL = "https://stats.gmx.io/api";

export const DEX_STATS_API_URL = "https://quote.onetradefinance.co/xstock_api";

export const REQUEST_API_URL = "https://api.onetradefinance.co/xstock_api_test";

export const TRADE_API_URL = "https://dextd.onetradefinance.co/exchange-engine";

const BACKEND_URLS = {
  default: "https://gmx-server-mainnet.uw.r.appspot.com",

  [BCS_MAINNET]: "https://gambit-server-staging.uc.r.appspot.com",
  [ARBITRUM_GOERLI]: "https://gambit-server-devnet.uc.r.appspot.com",
  [ARBITRUM]: "https://gmx-server-mainnet.uw.r.appspot.com",
  [AVALANCHE]: "https://gmx-avax-server.uc.r.appspot.com",
};

export function getServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  if (document.location.hostname.includes("deploy-preview")) {
    const fromLocalStorage = localStorage.getItem("SERVER_BASE_URL");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }
  }

  return BACKEND_URLS[chainId] || BACKEND_URLS.default;
}

export function getServerUrl(chainId: number, path: string) {
  return `${getServerBaseUrl(chainId)}${path}`;
}

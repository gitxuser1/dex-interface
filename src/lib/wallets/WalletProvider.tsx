import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, RainbowKitProvider, Theme, WalletList, lightTheme } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  safeWallet,
  rabbyWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  imTokenWallet,
  zerionWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli, avalanche, avalancheFuji, bsc, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import merge from "lodash/merge";
import { isDevelopment } from "config/env";
// import wowIcon from "img/wow.svg";
import { coreWallet } from "./connecters/core/coreWallet";
import { bitgetWallet } from "./connecters/bitgetWallet/bitgetWallet";
import binanceWallet from "./connecters/binanceW3W/binanceWallet";

const WALLET_CONNECT_PROJECT_ID = "de24cddbaf2a68f027eae30d9bb5df58";
const APP_NAME = "DEX";

export const wow: Chain = {
  id: 1916,
  name: 'WOW',
  network: 'WOW',
  nativeCurrency: {
    decimals: 18,
    name: 'WOW',
    symbol: 'WOW',
  },
  rpcUrls: {
    public: { http: ['https://rpc.wowearn.io'] },
    default: { http: ['https://rpc.wowearn.io'] },
  },
  blockExplorers: {
    default: { name: 'WOW', url: 'https://www.wowearn.io' },
  },
  // contracts: {
    // multicall3: {
      // address: '0x5ACF4a178641d8A74e670A146b789ADccd3FCb24',
      // blockCreated: 11_907_934,
    // },
  // },
  testnet: false,
};

const walletTheme = merge(lightTheme(), {
  colors: {
    modalBackground: "#fff",
    accentColor: "#9da5f2",
    menuItemBackground: "#808aff14",
  },
  radii: {
    modal: "4px",
    menuButton: "4px",
  },
} as Theme);

const { chains, provider } = configureChains(
  [wow, arbitrum, avalanche, bsc, mainnet, ...(isDevelopment() ? [arbitrumGoerli, avalancheFuji] : [])],
  [jsonRpcProvider({
    rpc: () => ({
      http: `https://rpc.wowearn.io`,
    }),
  }), publicProvider()]
);

const recommendedWalletList: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      safeWallet({ chains }),
      rabbyWallet({ chains }),
      metaMaskWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      walletConnectWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
    ],
  },
];

const othersWalletList: WalletList = [
  {
    groupName: "Others",
    wallets: [
      coreWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      coinbaseWallet({ appName: APP_NAME, chains }),
      binanceWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      okxWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      ledgerWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      rainbowWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      bitgetWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      zerionWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      imTokenWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
    ],
  },
];

const connectors = connectorsForWallets([...recommendedWalletList, ...othersWalletList]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function WalletProvider({ children }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={walletTheme} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

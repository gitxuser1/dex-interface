import { ARBITRUM, AVALANCHE, WOW, BCS_MAINNET, ETH_MAINNET } from "./chains";

export function getIsSyntheticsSupported(chainId: number) {
  return true;
}

export function getIsV1Supported(chainId: number) {
  return [WOW, AVALANCHE, ARBITRUM, BCS_MAINNET, ETH_MAINNET ].includes(chainId);
}

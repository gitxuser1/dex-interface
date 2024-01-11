import { ARBITRUM, AVALANCHE, WOW } from "./chains";

export function getIsSyntheticsSupported(chainId: number) {
  return true;
}

export function getIsV1Supported(chainId: number) {
  return [WOW, AVALANCHE, ARBITRUM].includes(chainId);
}

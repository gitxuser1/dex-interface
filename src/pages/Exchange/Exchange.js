import { Plural, Trans, t } from "@lingui/macro";
import cx from "classnames";
import { ethers } from "ethers";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import useSWR from "swr";

import { WOW, getConstant, getExplorerUrl } from "config/chains";
import { approvePlugin, cancelMultipleOrders } from "domain/legacy";
import {
  LONG,
  SHORT,
  SWAP,
  USD_DECIMALS,
  getPageTitle,
  getPositionKey,
  useAccountOrders,
} from "lib/legacy";
// import { BASIS_POINTS_DIVISOR } from "config/factors";

import { getContract } from "config/contracts";

// import Reader from "abis/ReaderV2.json";
import Router from "abis/Router.json";
// import Token from "abis/Token.json";
// import VaultV2 from "abis/VaultV2.json";

import Checkbox from "components/Checkbox/Checkbox";
import ExchangeBanner from "components/Exchange/ExchangeBanner";
import ExchangeTVChart, { getChartToken } from "components/Exchange/ExchangeTVChart";
import ExchangeWalletTokens from "components/Exchange/ExchangeWalletTokens";
import OrdersList from "components/Exchange/OrdersList";
import OrdersListHistory from "components/Exchange/OrdersListHistory";
import PositionsList from "components/Exchange/PositionsList";
import SwapBox from "components/Exchange/SwapBox";
// import TradeHistory from "components/Exchange/TradeHistory";
// import Footer from "components/Footer/Footer";
import Tab from "components/Tab/Tab";

import UsefulLinks from "components/Exchange/UsefulLinks";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getPriceDecimals, getToken, getTokenBySymbol, getV1Tokens, getWhitelistedV1Tokens } from "config/tokens";
import { useInfoTokens } from "domain/tokens";
import { getTokenInfo } from "domain/tokens/utils";
// import { useChainId } from "lib/chains";
import { contractFetcher } from "lib/contracts";
import { helperToast } from "lib/helperToast";
import { useLocalStorageByChainId, useLocalStorageSerializeKey } from "lib/localStorage";
import { bigNumberify, formatAmount } from "lib/numbers";
// import { getLeverage, getLeverageStr } from "lib/positions/getLeverage";
import "./Exchange.css";
import { getIsV1Supported } from "config/features";
import useWallet from "lib/wallets/useWallet";
import { request } from "lib/request";
const { AddressZero } = ethers.constants;

// const PENDING_POSITION_VALID_DURATION = 600 * 1000;
// const UPDATED_POSITION_VALID_DURATION = 60 * 1000;

const notifications = {};

function pushSuccessNotification(chainId, message, e) {
  const { transactionHash } = e;
  const id = ethers.utils.id(message + transactionHash);
  if (notifications[id]) {
    return;
  }

  notifications[id] = true;

  const txUrl = getExplorerUrl(chainId) + "tx/" + transactionHash;
  helperToast.success(
    <div>
      {message}{" "}
      <ExternalLink href={txUrl}>
        <Trans>View</Trans>
      </ExternalLink>
    </div>
  );
}

function pushErrorNotification(chainId, message, e) {
  const { transactionHash } = e;
  const id = ethers.utils.id(message + transactionHash);
  if (notifications[id]) {
    return;
  }

  notifications[id] = true;

  const txUrl = getExplorerUrl(chainId) + "tx/" + transactionHash;
  helperToast.error(
    <div>
      {message}{" "}
      <ExternalLink href={txUrl}>
        <Trans>View</Trans>
      </ExternalLink>
    </div>
  );
}

const getTokenAddress = (token, nativeTokenAddress) => {
  if (token.address === AddressZero) {
    return nativeTokenAddress;
  }
  return token.address;
};

// function applyPendingChanges(position, pendingPositions) {
//   if (!pendingPositions) {
//     return;
//   }
//   const { key } = position;

//   if (
//     pendingPositions[key] &&
//     pendingPositions[key].updatedAt &&
//     pendingPositions[key].pendingChanges &&
//     pendingPositions[key].updatedAt + PENDING_POSITION_VALID_DURATION > Date.now()
//   ) {
//     const { pendingChanges } = pendingPositions[key];
//     if (pendingChanges.size && position.size.eq(pendingChanges.size)) {
//       return;
//     }

//     if (pendingChanges.expectingCollateralChange && !position.collateral.eq(pendingChanges.collateralSnapshot)) {
//       return;
//     }

//     position.hasPendingChanges = true;
//     position.pendingChanges = pendingChanges;
//   }
// }

export function getPositions(
  chainId,
  positionQuery,
  positionData,
  infoTokens,
  includeDelta,
  showPnlAfterFees,
  account,
  pendingPositions,
  updatedPositions
) {
  // const propsLength = getConstant(chainId, "positionReaderPropsLength");
  const positions = [];
  const positionsMap = {};
  if (!positionData) {
    return { positions, positionsMap };
  }
  for (const item of positionData) {
    positionsMap[item.id] = item
  }
  return {
    positions: positionData,
    positionsMap
  }
}

export function getPositionQuery(tokens, nativeTokenAddress) {
  const collateralTokens = [];
  const indexTokens = [];
  const isLong = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.isStable) {
      continue;
    }
    if (token.isWrapped) {
      continue;
    }
    collateralTokens.push(getTokenAddress(token, nativeTokenAddress));
    indexTokens.push(getTokenAddress(token, nativeTokenAddress));
    isLong.push(true);
  }

  for (let i = 0; i < tokens.length; i++) {
    const stableToken = tokens[i];
    if (!stableToken.isStable) {
      continue;
    }

    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      if (token.isStable) {
        continue;
      }
      if (token.isWrapped) {
        continue;
      }
      collateralTokens.push(stableToken.address);
      indexTokens.push(getTokenAddress(token, nativeTokenAddress));
      isLong.push(false);
    }
  }

  return { collateralTokens, indexTokens, isLong };
}

export const Exchange = forwardRef((props, ref) => {
  const {
    savedIsPnlInLeverage,
    setSavedIsPnlInLeverage,
    savedShowPnlAfterFees,
    savedSlippageAmount,
    pendingTxns,
    setPendingTxns,
    savedShouldShowPositionLines,
    setSavedShouldShowPositionLines,
    savedShouldDisableValidationForTesting,
    tradePageVersion,
    setTradePageVersion,
    openSettings,
  } = props;
  const [showBanner, setShowBanner] = useLocalStorageSerializeKey("showBanner", true);
  const [bannerHidden, setBannerHidden] = useLocalStorageSerializeKey("bannerHidden", null);

  const [pendingPositions, setPendingPositions] = useState({});
  const [updatedPositions, setUpdatedPositions] = useState({});

  const hideBanner = () => {
    const hiddenLimit = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
    setBannerHidden(hiddenLimit);
    setShowBanner(false);
  };

  useEffect(() => {
    if (new Date() > new Date("2021-11-30")) {
      setShowBanner(false);
    } else {
      if (bannerHidden && new Date(bannerHidden) > new Date()) {
        setShowBanner(false);
      } else {
        setBannerHidden(null);
        setShowBanner(true);
      }
    }
  }, [showBanner, bannerHidden, setBannerHidden, setShowBanner]);

  const { active, account, signer } = useWallet();
  // const { chainId } = useChainId();
  const chainId = WOW;
  const currentAccount = account;

  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");

  const vaultAddress = getContract(chainId, "Vault");
  const positionRouterAddress = getContract(chainId, "PositionRouter");
  const readerAddress = getContract(chainId, "Reader");
  // const usdgAddress = getContract(chainId, "USDG");

  const whitelistedTokens = getWhitelistedV1Tokens(chainId);
  // const whitelistedTokenAddresses = whitelistedTokens.map((token) => token.address);

  const positionQuery = getPositionQuery(whitelistedTokens, nativeTokenAddress);

  const defaultCollateralSymbol = getConstant(chainId, "defaultCollateralSymbol");
  const defaultTokenSelection = useMemo(
    () => ({
      [SWAP]: {
        from: AddressZero,
        to: getTokenBySymbol(chainId, defaultCollateralSymbol).address,
      },
      [LONG]: {
        from: AddressZero,
        to: AddressZero,
      },
      [SHORT]: {
        from: getTokenBySymbol(chainId, defaultCollateralSymbol).address,
        to: AddressZero,
      },
    }),
    [chainId, defaultCollateralSymbol]
  );

  const [tokenSelection, setTokenSelection] = useLocalStorageByChainId(
    chainId,
    "Exchange-token-selection-v2",
    defaultTokenSelection
  );
  const [swapOption, setSwapOption] = useLocalStorageByChainId(chainId, "Swap-option-v2", LONG);

  const fromTokenAddress = tokenSelection[swapOption].from;
  const toTokenAddress = tokenSelection[swapOption].to;

  const setFromTokenAddress = useCallback(
    (selectedSwapOption, address) => {
      const newTokenSelection = JSON.parse(JSON.stringify(tokenSelection));
      newTokenSelection[selectedSwapOption].from = address;
      setTokenSelection(newTokenSelection);
    },
    [tokenSelection, setTokenSelection]
  );

  const setToTokenAddress = useCallback(
    (selectedSwapOption, address) => {
      const newTokenSelection = JSON.parse(JSON.stringify(tokenSelection));
      newTokenSelection[selectedSwapOption].to = address;
      if (selectedSwapOption === LONG || selectedSwapOption === SHORT) {
        newTokenSelection[LONG].to = address;
        newTokenSelection[SHORT].to = address;
      }
      setTokenSelection(newTokenSelection);
    },
    [tokenSelection, setTokenSelection]
  );

  const setMarket = (selectedSwapOption, toTokenAddress) => {
    setSwapOption(selectedSwapOption);
    const newTokenSelection = JSON.parse(JSON.stringify(tokenSelection));
    newTokenSelection[selectedSwapOption].to = toTokenAddress;
    if (selectedSwapOption === LONG || selectedSwapOption === SHORT) {
      newTokenSelection[LONG].to = toTokenAddress;
      newTokenSelection[SHORT].to = toTokenAddress;
    }
    setTokenSelection(newTokenSelection);
  };

  const [isConfirming, setIsConfirming] = useState(false);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);

  const tokens = getV1Tokens(chainId);

  // const tokenAddresses = tokens.map((token) => token.address);
  // const { data: tokenBalances } = useSWR(active && [active, chainId, readerAddress, "getTokenBalances", account], {
  //   fetcher: contractFetcher(signer, Reader, [tokenAddresses]),
  // });

  const { data: positionData, error: positionDataError } = useSWR(
    active && [active, chainId, readerAddress, "getPositions", vaultAddress, account],
    {
      fetcher: async () => {
        const res = await request({
          url: 'https://dextd.onetradefinance.co/exchange-engine/positions/queryByUid/dex',
          data: {
            "uid": localStorage.getItem('uid'),
            "state": "opening"
          }
        })
        return res.data
      },
    }
  );

  const positionsDataIsLoading = active && !positionData && !positionDataError;

  // const { data: fundingRateInfo } = useSWR([active, chainId, readerAddress, "getFundingRates"], {
  //   fetcher: contractFetcher(signer, Reader, [vaultAddress, nativeTokenAddress, whitelistedTokenAddresses]),
  // });

  // const { data: totalTokenWeights } = useSWR(
  //   [`Exchange:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
  //   {
  //     fetcher: contractFetcher(signer, VaultV2),
  //   }
  // );

  const totalTokenWeights = undefined;

  // const { data: usdgSupply } = useSWR([`Exchange:usdgSupply:${active}`, chainId, usdgAddress, "totalSupply"], {
  //   fetcher: contractFetcher(signer, Token),
  // });

  const usdgSupply = undefined;

  const orderBookAddress = getContract(chainId, "OrderBook");
  const routerAddress = getContract(chainId, "Router");
  const { data: orderBookApproved } = useSWR(
    active && [active, chainId, routerAddress, "approvedPlugins", account, orderBookAddress],
    {
      fetcher: contractFetcher(signer, Router),
    }
  );

  const { data: positionRouterApproved } = useSWR(
    active && [active, chainId, routerAddress, "approvedPlugins", account, positionRouterAddress],
    {
      fetcher: contractFetcher(signer, Router),
    }
  );

  const { infoTokens } = useInfoTokens(signer, chainId, active);
  // const { minExecutionFee, minExecutionFeeUSD, minExecutionFeeErrorMessage } = useExecutionFee(
  //   signer,
  //   active,
  //   chainId,
  //   infoTokens
  // );

  useEffect(() => {
    const fromToken = getTokenInfo(infoTokens, fromTokenAddress);
    const toToken = getTokenInfo(infoTokens, toTokenAddress);
    let selectedToken = getChartToken(swapOption, fromToken, toToken, chainId);
    const selectedTokenPriceDecimal = getPriceDecimals(chainId, selectedToken?.symbol);

    if (!selectedToken) {
      return;
    }

    let currentTokenPriceStr = formatAmount(selectedToken.maxPrice, USD_DECIMALS, selectedTokenPriceDecimal, true);
    let title = getPageTitle(
      currentTokenPriceStr + ` | ${selectedToken.symbol}${selectedToken.isStable ? "" : "-USD"}`
    );
    document.title = title;
  }, [tokenSelection, swapOption, infoTokens, chainId, fromTokenAddress, toTokenAddress]);

  const { positions, positionsMap } = getPositions(
    chainId,
    positionQuery,
    positionData,
    infoTokens,
    savedIsPnlInLeverage,
    savedShowPnlAfterFees,
    account,
    pendingPositions,
    updatedPositions
  );

  console.log('positions', positionData)

  useImperativeHandle(ref, () => ({
    onUpdatePosition(key, size, collateral, averagePrice, entryFundingRate, reserveAmount, realisedPnl) {
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        if (position.contractKey === key) {
          updatedPositions[position.key] = {
            size,
            collateral,
            averagePrice,
            entryFundingRate,
            reserveAmount,
            realisedPnl,
            updatedAt: Date.now(),
          };
          setUpdatedPositions({ ...updatedPositions });
          break;
        }
      }
    },
    onClosePosition(key, size, collateral, averagePrice, entryFundingRate, reserveAmount, realisedPnl, e) {
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        if (position.contractKey === key) {
          updatedPositions[position.key] = {
            size: bigNumberify(0),
            collateral: bigNumberify(0),
            averagePrice,
            entryFundingRate,
            reserveAmount,
            realisedPnl,
            updatedAt: Date.now(),
          };
          setUpdatedPositions({ ...updatedPositions });
          break;
        }
      }
    },

    onIncreasePosition(key, account, collateralToken, indexToken, collateralDelta, sizeDelta, isLong, price, fee, e) {
      if (account !== currentAccount) {
        return;
      }

      const indexTokenItem = getToken(chainId, indexToken);
      const tokenSymbol = indexTokenItem.isWrapped ? getConstant(chainId, "nativeTokenSymbol") : indexTokenItem.symbol;
      const longOrShortText = isLong ? t`Long` : t`Short`;
      let message;
      if (sizeDelta.eq(0)) {
        message = t`Deposited ${formatAmount(
          collateralDelta,
          USD_DECIMALS,
          2,
          true
        )} USD into ${tokenSymbol} ${longOrShortText}`;
      } else {
        message = t`Increased ${tokenSymbol} ${longOrShortText}, +${formatAmount(
          sizeDelta,
          USD_DECIMALS,
          2,
          true
        )} USD.`;
      }

      pushSuccessNotification(chainId, message, e);
    },

    onDecreasePosition(key, account, collateralToken, indexToken, collateralDelta, sizeDelta, isLong, price, fee, e) {
      if (account !== currentAccount) {
        return;
      }

      const indexTokenItem = getToken(chainId, indexToken);
      const tokenSymbol = indexTokenItem.isWrapped ? getConstant(chainId, "nativeTokenSymbol") : indexTokenItem.symbol;
      const longOrShortText = isLong ? t`Long` : t`Short`;

      let message;
      if (sizeDelta.eq(0)) {
        message = t`Withdrew ${formatAmount(
          collateralDelta,
          USD_DECIMALS,
          2,
          true
        )} USD from ${tokenSymbol} ${longOrShortText}.`;
      } else {
        message = t`Decreased ${tokenSymbol} ${longOrShortText}, -${formatAmount(
          sizeDelta,
          USD_DECIMALS,
          2,
          true
        )} USD.`;
      }

      pushSuccessNotification(chainId, message, e);
    },

    onCancelIncreasePosition(
      account,
      path,
      indexToken,
      amountIn,
      minOut,
      sizeDelta,
      isLong,
      acceptablePrice,
      executionFee,
      blockGap,
      timeGap,
      e
    ) {
      if (account !== currentAccount) {
        return;
      }
      const indexTokenItem = getToken(chainId, indexToken);
      const tokenSymbol = indexTokenItem.isWrapped ? getConstant(chainId, "nativeTokenSymbol") : indexTokenItem.symbol;
      const longOrShortText = isLong ? t`Long` : t`Short`;

      const message = t`Could not increase ${tokenSymbol} ${longOrShortText} within the allowed slippage, you can adjust the allowed slippage in the settings on the top right of the page.`;
      pushErrorNotification(chainId, message, e);

      const key = getPositionKey(account, path[path.length - 1], indexToken, isLong);
      pendingPositions[key] = {};
      setPendingPositions({ ...pendingPositions });
    },

    onCancelDecreasePosition(
      account,
      path,
      indexToken,
      collateralDelta,
      sizeDelta,
      isLong,
      receiver,
      acceptablePrice,
      minOut,
      executionFee,
      blockGap,
      timeGap,
      e
    ) {
      if (account !== currentAccount) {
        return;
      }
      const indexTokenItem = getToken(chainId, indexToken);
      const tokenSymbol = indexTokenItem.isWrapped ? getConstant(chainId, "nativeTokenSymbol") : indexTokenItem.symbol;
      const longOrShortText = isLong ? t`Long` : t`Short`;

      const message = t`Could not decrease ${tokenSymbol} ${longOrShortText} within the allowed slippage, you can adjust the allowed slippage in the settings on the top right of the page.`;

      pushErrorNotification(chainId, message, e);

      const key = getPositionKey(account, path[path.length - 1], indexToken, isLong);
      pendingPositions[key] = {};
      setPendingPositions({ ...pendingPositions });
    },
  }));

  const flagOrdersEnabled = true;
  const [orders] = useAccountOrders(flagOrdersEnabled);

  const [isWaitingForPluginApproval, setIsWaitingForPluginApproval] = useState(false);
  const [isWaitingForPositionRouterApproval, setIsWaitingForPositionRouterApproval] = useState(false);
  const [isPluginApproving, setIsPluginApproving] = useState(false);
  const [isPositionRouterApproving, setIsPositionRouterApproving] = useState(false);
  const [isCancelMultipleOrderProcessing, setIsCancelMultipleOrderProcessing] = useState(false);
  const [cancelOrderIdList, setCancelOrderIdList] = useState([]);

  const onMultipleCancelClick = useCallback(
    async function () {
      setIsCancelMultipleOrderProcessing(true);
      try {
        const tx = await cancelMultipleOrders(chainId, signer, cancelOrderIdList, {
          successMsg: t`Orders cancelled.`,
          failMsg: t`Cancel failed.`,
          sentMsg: t`Cancel submitted.`,
          pendingTxns,
          setPendingTxns,
        });
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          setCancelOrderIdList([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setIsCancelMultipleOrderProcessing(false);
      }
    },
    [
      chainId,
      signer,
      pendingTxns,
      setPendingTxns,
      setCancelOrderIdList,
      cancelOrderIdList,
      setIsCancelMultipleOrderProcessing,
    ]
  );

  const approveOrderBook = () => {
    setIsPluginApproving(true);
    return approvePlugin(chainId, orderBookAddress, {
      signer,
      pendingTxns,
      setPendingTxns,
      sentMsg: t`Enable orders sent.`,
      failMsg: t`Enable orders failed.`,
    })
      .then(() => {
        setIsWaitingForPluginApproval(true);
      })
      .finally(() => {
        setIsPluginApproving(false);
      });
  };

  const approvePositionRouter = ({ sentMsg, failMsg }) => {
    setIsPositionRouterApproving(true);
    return approvePlugin(chainId, positionRouterAddress, {
      signer,
      pendingTxns,
      setPendingTxns,
      sentMsg,
      failMsg,
    })
      .then(() => {
        setIsWaitingForPositionRouterApproval(true);
      })
      .finally(() => {
        setIsPositionRouterApproving(false);
      });
  };
  const POSITIONS = "Positions";
  const ORDERS = "Orders";
  const TRADES = "Trades";

  const LIST_SECTIONS = [POSITIONS, flagOrdersEnabled && ORDERS, TRADES].filter(Boolean);
  let [listSection, setListSection] = useLocalStorageByChainId(chainId, "List-section-v2", LIST_SECTIONS[0]);
  const LIST_SECTIONS_LABELS = {
    [ORDERS]: orders.length ? t`Orders (${orders.length})` : t`Orders`,
    [POSITIONS]: positions.length ? t`Positions (${positions.length})` : t`Positions`,
    [TRADES]: t`Trades`,
  };
  if (!LIST_SECTIONS.includes(listSection)) {
    listSection = LIST_SECTIONS[0];
  }

  if (!getToken(chainId, toTokenAddress)) {
    return null;
  }

  const renderCancelOrderButton = () => {
    if (cancelOrderIdList.length === 0) return;
    return (
      <button
        className="muted font-base cancel-order-btn"
        disabled={isCancelMultipleOrderProcessing}
        type="button"
        onClick={onMultipleCancelClick}
      >
        <Plural value={cancelOrderIdList.length} one="Cancel order" other="Cancel # orders" />
      </button>
    );
  };

  const getListSection = () => {
    return (
      <div>
        <div className="Exchange-list-tab-container">
          <Tab
            options={LIST_SECTIONS}
            optionLabels={LIST_SECTIONS_LABELS}
            option={listSection}
            onChange={(section) => setListSection(section)}
            type="inline"
            className="Exchange-list-tabs"
          />
          <div className="align-right Exchange-should-show-position-lines">
            {renderCancelOrderButton()}
            <Checkbox
              isChecked={savedShouldShowPositionLines}
              setIsChecked={setSavedShouldShowPositionLines}
              className={cx("muted chart-positions", { active: savedShouldShowPositionLines })}
            >
              <span>
                <Trans>Chart positions</Trans>
              </span>
            </Checkbox>
          </div>
        </div>
        {listSection === POSITIONS && (
          <PositionsList
            positionsDataIsLoading={positionsDataIsLoading}
            pendingPositions={pendingPositions}
            setPendingPositions={setPendingPositions}
            setListSection={setListSection}
            setIsWaitingForPluginApproval={setIsWaitingForPluginApproval}
            setIsWaitingForPositionRouterApproval={setIsWaitingForPositionRouterApproval}
            approveOrderBook={approveOrderBook}
            approvePositionRouter={approvePositionRouter}
            isPluginApproving={isPluginApproving}
            isPositionRouterApproving={isPositionRouterApproving}
            isWaitingForPluginApproval={isWaitingForPluginApproval}
            isWaitingForPositionRouterApproval={isWaitingForPositionRouterApproval}
            orderBookApproved={orderBookApproved}
            positionRouterApproved={positionRouterApproved}
            positions={positions}
            positionsMap={positionsMap}
            infoTokens={infoTokens}
            active={active}
            account={account}
            signer={signer}
            pendingTxns={pendingTxns}
            setPendingTxns={setPendingTxns}
            flagOrdersEnabled={flagOrdersEnabled}
            savedIsPnlInLeverage={savedIsPnlInLeverage}
            chainId={chainId}
            nativeTokenAddress={nativeTokenAddress}
            setMarket={setMarket}
            orders={orders}
            showPnlAfterFees={savedShowPnlAfterFees}
            // minExecutionFee={minExecutionFee}
            // minExecutionFeeUSD={minExecutionFeeUSD}
            // minExecutionFeeErrorMessage={minExecutionFeeErrorMessage}
            usdgSupply={usdgSupply}
            totalTokenWeights={totalTokenWeights}
            openSettings={openSettings}
          />
        )}
        {listSection === ORDERS && (
          <OrdersList
            account={account}
            active={active}
            signer={signer}
            pendingTxns={pendingTxns}
            setPendingTxns={setPendingTxns}
            infoTokens={infoTokens}
            positionsMap={positionsMap}
            chainId={chainId}
            orders={orders}
            totalTokenWeights={totalTokenWeights}
            usdgSupply={usdgSupply}
            savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
            cancelOrderIdList={cancelOrderIdList}
            setCancelOrderIdList={setCancelOrderIdList}
          />
        )}
        {listSection === TRADES && (
          <OrdersListHistory
            account={account}
            active={active}
            signer={signer}
            pendingTxns={pendingTxns}
            setPendingTxns={setPendingTxns}
            infoTokens={infoTokens}
            positionsMap={positionsMap}
            chainId={chainId}
            orders={[]}
            totalTokenWeights={totalTokenWeights}
            usdgSupply={usdgSupply}
            hideActions
            savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
            cancelOrderIdList={cancelOrderIdList}
            setCancelOrderIdList={setCancelOrderIdList}
          />
          // <OrdersListHistory
          //   account={account}
          //   infoTokens={infoTokens}
          //   getTokenInfo={getTokenInfo}
          //   chainId={chainId}
          //   nativeTokenAddress={nativeTokenAddress}
          //   shouldShowPaginationButtons={true}
          // />
        )}
      </div>
    );
  };

  const onSelectWalletToken = (token) => {
    setFromTokenAddress(swapOption, token.address);
  };

  const renderChart = () => {
    return (
      <ExchangeTVChart
        fromTokenAddress={fromTokenAddress}
        toTokenAddress={toTokenAddress}
        infoTokens={infoTokens}
        swapOption={swapOption}
        chainId={WOW}
        positions={positions}
        savedShouldShowPositionLines={savedShouldShowPositionLines}
        orders={orders}
        setToTokenAddress={setToTokenAddress}
        tradePageVersion={tradePageVersion}
        setTradePageVersion={setTradePageVersion}
        setSwapOption={setSwapOption}
      />
    );
  };

  return (
    <div className="Exchange page-layout">
      {showBanner && <ExchangeBanner hideBanner={hideBanner} />}
      <div className="Exchange-content">
        <div className="Exchange-left">
          {renderChart()}
          <div className="Exchange-lists large">{getListSection()}</div>
        </div>
        <div className="Exchange-right">
          {getIsV1Supported(chainId) && (
            <SwapBox
              pendingPositions={pendingPositions}
              setPendingPositions={setPendingPositions}
              setIsWaitingForPluginApproval={setIsWaitingForPluginApproval}
              setIsWaitingForPositionRouterApproval={setIsWaitingForPositionRouterApproval}
              approveOrderBook={approveOrderBook}
              approvePositionRouter={approvePositionRouter}
              isPluginApproving={isPluginApproving}
              isPositionRouterApproving={isPositionRouterApproving}
              isWaitingForPluginApproval={isWaitingForPluginApproval}
              isWaitingForPositionRouterApproval={isWaitingForPositionRouterApproval}
              orderBookApproved={orderBookApproved}
              positionRouterApproved={positionRouterApproved}
              orders={orders}
              flagOrdersEnabled={flagOrdersEnabled}
              chainId={chainId}
              infoTokens={infoTokens}
              positionsMap={positionsMap}
              fromTokenAddress={fromTokenAddress}
              setFromTokenAddress={setFromTokenAddress}
              toTokenAddress={toTokenAddress}
              setToTokenAddress={setToTokenAddress}
              swapOption={swapOption}
              setSwapOption={setSwapOption}
              pendingTxns={pendingTxns}
              setPendingTxns={setPendingTxns}
              tokenSelection={tokenSelection}
              setTokenSelection={setTokenSelection}
              isConfirming={isConfirming}
              setIsConfirming={setIsConfirming}
              isPendingConfirmation={isPendingConfirmation}
              setIsPendingConfirmation={setIsPendingConfirmation}
              savedIsPnlInLeverage={savedIsPnlInLeverage}
              setSavedIsPnlInLeverage={setSavedIsPnlInLeverage}
              nativeTokenAddress={nativeTokenAddress}
              savedSlippageAmount={savedSlippageAmount}
              totalTokenWeights={totalTokenWeights}
              usdgSupply={usdgSupply}
              savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
              // minExecutionFee={minExecutionFee}
              // minExecutionFeeUSD={minExecutionFeeUSD}
              // minExecutionFeeErrorMessage={minExecutionFeeErrorMessage}
              positions={positions}
            />
          )}

          <div className="Exchange-wallet-tokens">
            <div className="Exchange-wallet-tokens-content">
              <ExchangeWalletTokens tokens={tokens} infoTokens={infoTokens} onSelectToken={onSelectWalletToken} />
            </div>
          </div>
        </div>
        <div className="Exchange-lists small">{getListSection()}</div>
        <UsefulLinks className="Useful-links-exchange" />
      </div>
      {/* <Footer /> */}
    </div>
  );
});

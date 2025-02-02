import React, { useState, useCallback } from "react";
import { t, Trans } from "@lingui/macro";

import {
  SWAP,
  USD_DECIMALS,
  // getOrderError,
  getExchangeRateDisplay,
  getExchangeRate,
  getPositionForOrder,
} from "lib/legacy";
import { handleCancelOrder } from "domain/legacy";
import { getContract } from "config/contracts";

import Tooltip from "../Tooltip/Tooltip";
import OrderEditor from "./OrderEditor";

import "./OrdersList.css";
import Checkbox from "../Checkbox/Checkbox";
// import StatsTooltipRow from "../StatsTooltip/StatsTooltipRow";
// import { TRIGGER_PREFIX_ABOVE, TRIGGER_PREFIX_BELOW } from "config/ui";
import { getTokenInfo, getUsd } from "domain/tokens/utils";
import { formatAmount } from "lib/numbers";
// import ExternalLink from "components/ExternalLink/ExternalLink";
import {  getTokens } from "config/tokens";
import Button from "components/Button/Button";
import TokenIcon from "components/TokenIcon/TokenIcon";
import { WOW } from "config/chains";
import { format } from "date-fns";

function getOrderTitle(order) {
  // const orderTypeText = order.type === INCREASE ? t`Increase` : t`Decrease`;
  const longShortText = order.isLong ? t`Long` : t`Short`;
  // const sizeDeltaText = formatAmount(order.sourcePrice, USD_DECIMALS, 2, true);
  const tokens = getTokens(WOW)
  const token = tokens.find(item => item.id === +order.currency)
  if (!token) return null
  const symbolWithIcon = (
    <>
      <TokenIcon className="mx-xxs" symbol={token.symbol} displaySize={18} importSize={24} /> {token.symbol}
    </>
  );

  return (
    <span>
      {symbolWithIcon} {longShortText} by {order.sourcePrice}
    </span>
  );
}

export default function OrdersList(props) {
  const {
    account,
    signer,
    setPendingTxns,
    pendingTxns,
    infoTokens,
    positionsMap,
    totalTokenWeights,
    usdgSupply,
    orders,
    hideActions,
    chainId,
    savedShouldDisableValidationForTesting,
    cancelOrderIdList,
    setCancelOrderIdList,
  } = props;

  const [editingOrder, setEditingOrder] = useState(null);

  const onCancelClick = useCallback(
    (order) => {
      handleCancelOrder(chainId, signer, order, { pendingTxns, setPendingTxns });
    },
    [signer, pendingTxns, setPendingTxns, chainId]
  );

  const onEditClick = useCallback(
    (order) => {
      setEditingOrder(order);
    },
    [setEditingOrder]
  );

  const renderHead = useCallback(() => {
    // const isAllOrdersSelected = cancelOrderIdList?.length > 0 && cancelOrderIdList?.length === orders.length;
    return (
      <tr className="Exchange-list-header">
        {/* {!hideActions && orders.length > 0 && (
          <th>
            <div className="checkbox-inline ">
              <Checkbox
                isChecked={isAllOrdersSelected}
                setIsChecked={() => {
                  if (isAllOrdersSelected) {
                    setCancelOrderIdList([]);
                  } else {
                    const allOrderIds = orders.map((o) => `${o.type}-${o.index}`);
                    setCancelOrderIdList(allOrderIds);
                  }
                }}
              />
            </div>
          </th>
        )} */}

        <th>
          <div>
            <Trans>Contract</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Side</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Type</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Limit Price</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Transimssion Time</Trans>
          </div>
        </th>
      </tr>
    );
  }, []);

  const renderEmptyRow = useCallback(() => {
    if (orders && orders.length) {
      return null;
    }

    return (
      <tr>
        <td colSpan="5">
          <Trans>No open orders</Trans>
        </td>
      </tr>
    );
  }, [orders]);

  const renderActions = useCallback(
    (order) => {
      return (
        <>
          {/* <td>
            <button className="Exchange-list-action" onClick={() => onEditClick(order)}>
              <Trans>Edit</Trans>
            </button>
          </td> */}
          <td>
            <button className="Exchange-list-action" onClick={() => onCancelClick(order)}>
              <Trans>Cancel</Trans>
            </button>
          </td>
        </>
      );
    },
    [onCancelClick]
  );

  const renderLargeList = useCallback(() => {
    if (!orders || !orders.length) {
      return null;
    }
    return orders.map((order) => {
      if (order.type === SWAP) {
        const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
        const fromTokenInfo = getTokenInfo(infoTokens, order.path[0], true, nativeTokenAddress);
        const toTokenInfo = getTokenInfo(
          infoTokens,
          order.path[order.path.length - 1],
          order.shouldUnwrap,
          nativeTokenAddress
        );
        // const collateralUSD = getUsd(order.amountIn, fromTokenInfo.address, true, infoTokens);
        const markExchangeRate = getExchangeRate(fromTokenInfo, toTokenInfo);
        const orderId = `${order.type}-${order.index}`;
        const titleText = (
          <span>
            <Trans>Swap</Trans>{" "}
            {formatAmount(
              order.amountIn,
              fromTokenInfo.decimals,
              fromTokenInfo.isStable || fromTokenInfo.isUsdg ? 2 : 4,
              true
            )}{" "}
            <TokenIcon symbol={fromTokenInfo.symbol} displaySize={18} importSize={24} /> {fromTokenInfo.symbol} for{" "}
            {formatAmount(order.minOut, toTokenInfo.decimals, toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4, true)}{" "}
            <TokenIcon symbol={toTokenInfo.symbol} displaySize={18} importSize={24} /> {toTokenInfo.symbol}
          </span>
        );

        return (
          <tr className="Exchange-list-item" key={orderId}>
            {!hideActions && (
              <td>
                <div className="checkbox-inline ">
                  <Checkbox
                    isChecked={cancelOrderIdList?.includes(orderId)}
                    setIsChecked={() => {
                      setCancelOrderIdList((prevState) => {
                        if (prevState.includes(orderId)) {
                          return prevState.filter((i) => i !== orderId);
                        } else {
                          return prevState.concat(orderId);
                        }
                      });
                    }}
                  />
                </div>
              </td>
            )}
            <td className="Exchange-list-item-type">
              <Trans>Limit</Trans>
            </td>
            <td className="inline-flex">
              {titleText}
              {/* <Tooltip
                handle={titleText}
                position="right-bottom"
                className="Order-list-item-text"
                renderContent={() => {
                  return (
                    <StatsTooltipRow
                      label={t`Collateral`}
                      value={`${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (${formatAmount(
                        order.amountIn,
                        fromTokenInfo.decimals,
                        4,
                        true
                      )}
                      ${fromTokenInfo.baseSymbol || fromTokenInfo.symbol})`}
                    />
                  );
                }}
              /> */}
            </td>
            <td>
              {!hideActions ? (
                <Tooltip
                  handle={getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)}
                  renderContent={() => t`
                  You will receive at least ${formatAmount(
                    order.minOut,
                    toTokenInfo.decimals,
                    toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4,
                    true
                  )} ${
                    toTokenInfo.symbol
                  } if this order is executed. The execution price may vary depending on swap fees at the time the order is executed.
                `}
                />
              ) : (
                getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)
              )}
            </td>
            <td>{getExchangeRateDisplay(markExchangeRate, fromTokenInfo, toTokenInfo, true)}</td>
            {!hideActions && renderActions(order)}
          </tr>
        );
      }

      const indexToken = getTokenInfo(infoTokens, order.indexToken);
      // const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);

      // Longs Increase: max price
      // Longs Decrease: min price
      // Short Increase: min price
      // Short Decrease: max price
      // const maximisePrice = (order.type === INCREASE && order.isLong) || (order.type === DECREASE && !order.isLong);

      // const markPrice = maximisePrice ? indexToken.contractMaxPrice : indexToken.contractMinPrice;
      // const triggerPricePrefix = order.triggerAboveThreshold ? TRIGGER_PREFIX_ABOVE : TRIGGER_PREFIX_BELOW;
      const indexTokenSymbol = indexToken.isWrapped ? indexToken.baseSymbol : indexToken.symbol;

      // const error = getOrderError(account, order, positionsMap);
      // const orderId = `${order.type}-${order.index}`;
      const orderTitle = getOrderTitle(order, indexTokenSymbol);

      const orderText = (
        <>
          {orderTitle}
        </>
      );

      return (
        <tr className="Exchange-list-item" key={`${order.isLong}-${order.type}-${order.index}`}>
          {/* {!hideActions && (
            <td className="Exchange-list-item-type">
              <div>
                <Checkbox
                  isChecked={cancelOrderIdList?.includes(orderId)}
                  setIsChecked={() => {
                    setCancelOrderIdList((prevState) => {
                      if (prevState.includes(orderId)) {
                        return prevState.filter((i) => i !== orderId);
                      } else {
                        return prevState.concat(orderId);
                      }
                    });
                  }}
                />
              </div>
            </td>
          )} */}
          <td className="Exchange-list-item-type">{orderText}</td>
          <td className="inline-flex">
            {order.transactionType}
          </td>
          <td>
            {order.orderType}
            {/* {triggerPricePrefix} {formatAmount(order.triggerPrice, USD_DECIMALS, indexTokenPriceDecimal, true)} */}
          </td>
          <td>
            {order.orderType === 'limit' ? order.sourcePrice : '-'}
            {/* <Tooltip
              handle={formatAmount(markPrice, USD_DECIMALS, indexTokenPriceDecimal, true)}
              position="right-bottom"
              renderContent={() => {
                return (
                  <Trans>
                    <p>
                      The price that orders can be executed at may differ slightly from the chart price, as market
                      orders update oracle prices, while limit/trigger orders do not.
                    </p>
                    <p>
                      This can also cause limit/triggers to not be executed if the price is not reached for long enough.{" "}
                      <ExternalLink href="https://docs.gmx.io/docs/trading/v1#stop-loss--take-profit-orders">
                        Read more
                      </ExternalLink>
                      .
                    </p>
                  </Trans>
                );
              }}
            /> */}
          </td>
          <td>
            {format(+order.createTs, 'MM/dd/yyyy HH:mm:ss')}
          </td>
          {!hideActions && renderActions(order)}
        </tr>
      );
    });
  }, [
    orders,
    renderActions,
    infoTokens,
    hideActions,
    chainId,
    cancelOrderIdList,
    setCancelOrderIdList,
  ]);

  const renderSmallList = useCallback(() => {
    if (!orders || !orders.length) {
      return null;
    }

    return orders.map((order) => {
      if (order.type === SWAP) {
        const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
        const fromTokenInfo = getTokenInfo(infoTokens, order.path[0], true, nativeTokenAddress);
        const toTokenInfo = getTokenInfo(
          infoTokens,
          order.path[order.path.length - 1],
          order.shouldUnwrap,
          nativeTokenAddress
        );
        const markExchangeRate = getExchangeRate(fromTokenInfo, toTokenInfo);
        const collateralUSD = getUsd(order.amountIn, fromTokenInfo.address, true, infoTokens);
        const titleText = (
          <>
            Swap {formatAmount(order.amountIn, fromTokenInfo.decimals, fromTokenInfo.isStable ? 2 : 4, true)}{" "}
            <TokenIcon symbol={fromTokenInfo.symbol} displaySize={18} importSize={24} /> {fromTokenInfo.symbol} for{" "}
            {formatAmount(order.minOut, toTokenInfo.decimals, toTokenInfo.isStable ? 2 : 4, true)}{" "}
            <TokenIcon symbol={toTokenInfo.symbol} displaySize={18} importSize={24} /> {toTokenInfo.symbol}
          </>
        );
        return (
          <div key={`${order.type}-${order.index}`} className="App-card">
            <div className="App-card-content">
              <div className="Order-list-card-title">{titleText}</div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Price</Trans>
                </div>
                <div>
                {order.sourcePrice}
                  {/* <Tooltip
                    position="right-bottom"
                    handle={getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)}
                    renderContent={() => t`
                    You will receive at least ${formatAmount(
                      order.minOut,
                      toTokenInfo.decimals,
                      toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4,
                      true
                    )} ${
                      toTokenInfo.symbol
                    } if this order is executed. The exact execution price may vary depending on fees at the time the order is executed.
                  `}
                  /> */}
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Mark Price</Trans>
                </div>
                <div>{getExchangeRateDisplay(markExchangeRate, fromTokenInfo, toTokenInfo)}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Collateral</Trans>
                </div>
                <div>
                  ${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (
                  {formatAmount(order.amountIn, fromTokenInfo.decimals, 4, true)}{" "}
                  {fromTokenInfo.baseSymbol || fromTokenInfo.symbol})
                </div>
              </div>
            </div>
            <div>
              {!hideActions && (
                <>
                  <div className="App-card-divider"></div>
                  <div className="remove-top-margin">
                    <Button variant="secondary" className="mr-md mt-md" onClick={() => onEditClick(order)}>
                      <Trans>Edit</Trans>
                    </Button>
                    <Button variant="secondary" className="mt-md" onClick={() => onCancelClick(order)}>
                      <Trans>Cancel</Trans>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }

      const indexToken = getTokenInfo(infoTokens, order.indexToken);
      // const maximisePrice = (order.type === INCREASE && order.isLong) || (order.type === DECREASE && !order.isLong);
      // const markPrice = maximisePrice ? indexToken.contractMaxPrice : indexToken.contractMinPrice;
      // const triggerPricePrefix = order.triggerAboveThreshold ? TRIGGER_PREFIX_ABOVE : TRIGGER_PREFIX_BELOW;
      const indexTokenSymbol = indexToken.isWrapped ? indexToken.baseSymbol : indexToken.symbol;

      // const collateralTokenInfo = getTokenInfo(infoTokens, order.purchaseToken);
      // const collateralUSD = getUsd(order.purchaseTokenAmount, order.purchaseToken, true, infoTokens);

      // const error = getOrderError(account, order, positionsMap);
      const orderTitle = getOrderTitle(order, indexTokenSymbol);

      return (
        <div key={`${order.isLong}-${order.type}-${order.index}`} className="App-card">
          <div className="App-card-content">
            <div className="Order-list-card-title">
              {orderTitle}
            </div>
            <div className="App-card-divider"></div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Side</Trans>
              </div>
              <div>
                {order.transactionType}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Type</Trans>
              </div>
              <div>
                {order.orderType}
                {/* <Tooltip
                  handle={formatAmount(markPrice, USD_DECIMALS, 2, true)}
                  position="right-bottom"
                  renderContent={() => {
                    return (
                      <Trans>
                        The price that the order can be executed at may differ slightly from the chart price as market
                        orders can change the price while limit / trigger orders cannot.
                      </Trans>
                    );
                  }}
                /> */}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Limit Price</Trans>
              </div>
              <div>
                {order.orderType === 'limit' ? order.sourcePrice : '-'}
                {/* ${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (
                {formatAmount(order.purchaseTokenAmount, collateralTokenInfo.decimals, 4, true)}{" "}
                {collateralTokenInfo.baseSymbol || collateralTokenInfo.symbol}) */}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Transimssion Time</Trans>
              </div>
              <div>
                {format(+order.createTs, 'MM/dd/yyyy HH:mm:ss')}
                {/* ${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (
                {formatAmount(order.purchaseTokenAmount, collateralTokenInfo.decimals, 4, true)}{" "}
                {collateralTokenInfo.baseSymbol || collateralTokenInfo.symbol}) */}
              </div>
            </div>
          </div>
          <div>
            {!hideActions && (
              <>
                <div className="App-card-divider"></div>
                <div className="remove-top-margin">
                  {/* <Button variant="secondary" className="mr-md mt-md" onClick={() => onEditClick(order)}>
                    <Trans>Edit</Trans>
                  </Button> */}
                  <Button variant="secondary" className="mt-md" onClick={() => onCancelClick(order)}>
                    <Trans>Cancel</Trans>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    });
  }, [orders, onEditClick, onCancelClick, infoTokens, hideActions, chainId]);

  return (
    <React.Fragment>
      <table className="Exchange-list Orders App-box large">
        <tbody>
          {renderHead()}
          {renderEmptyRow()}
          {renderLargeList()}
        </tbody>
      </table>
      {(!orders || orders.length === 0) && (
        <div className="Exchange-empty-positions-list-note small App-card">
          <Trans>No open orders</Trans>
        </div>
      )}
      <div className="Exchange-list Orders small">{renderSmallList()}</div>
      {editingOrder && (
        <OrderEditor
          account={account}
          order={editingOrder}
          setEditingOrder={setEditingOrder}
          infoTokens={infoTokens}
          pendingTxns={pendingTxns}
          setPendingTxns={setPendingTxns}
          getPositionForOrder={getPositionForOrder}
          positionsMap={positionsMap}
          signer={signer}
          totalTokenWeights={totalTokenWeights}
          usdgSupply={usdgSupply}
          savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
        />
      )}
    </React.Fragment>
  );
}

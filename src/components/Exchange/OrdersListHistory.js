import React, { useState, useCallback } from "react";
import { t, Trans } from "@lingui/macro";

import {
  // SWAP,
  // INCREASE,
  // DECREASE,
  // USD_DECIMALS,
  // getOrderError,
  // getExchangeRateDisplay,
  // getExchangeRate,
  getPositionForOrder,
} from "lib/legacy";
// import { handleCancelOrder } from "domain/legacy";
// import { getContract } from "config/contracts";

// import Tooltip from "../Tooltip/Tooltip";
import OrderEditor from "./OrderEditor";

import "./OrdersList.css";
import Checkbox from "../Checkbox/Checkbox";
// import StatsTooltipRow from "../StatsTooltip/StatsTooltipRow";
// import { TRIGGER_PREFIX_ABOVE, TRIGGER_PREFIX_BELOW } from "config/ui";
// import { getTokenInfo, getUsd } from "domain/tokens/utils";
// import { formatAmount } from "lib/numbers";
// import ExternalLink from "components/ExternalLink/ExternalLink";
// import { getPriceDecimals } from "config/tokens";
// import Button from "components/Button/Button";
import TokenIcon from "components/TokenIcon/TokenIcon";
import useSWR from "swr";
import { request } from "lib/request";
import { getTokens } from "config/tokens";
import { WOW } from "config/chains";

const SymbolWithIcon = ({code}) => {
  const tokens = getTokens(WOW)

  const token = tokens.find(item => +item.id === +code)

  console.log('token', token, tokens, code)
  if (!token) return null
  return (
    <>
      <TokenIcon className="mx-xxs" symbol={token.symbol} displaySize={18} importSize={24} /> {token.symbol}
    </>
  )
}

// function getOrderTitle(order, indexTokenSymbol) {
//   const orderTypeText = order.type === INCREASE ? t`Increase` : t`Decrease`;
//   const longShortText = order.isLong ? t`Long` : t`Short`;
//   const sizeDeltaText = formatAmount(order.sourcePrice, USD_DECIMALS, 2, true);
  // const symbolWithIcon = (
  //   <>
  //     <TokenIcon className="mx-xxs" symbol={indexTokenSymbol} displaySize={18} importSize={24} /> {indexTokenSymbol}
  //   </>
  // );

//   return (
//     <span>
//       {orderTypeText} {symbolWithIcon} {longShortText} by ${sizeDeltaText}
//     </span>
//   );
// }

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
    // orders,
    hideActions,
    // chainId,
    savedShouldDisableValidationForTesting,
    cancelOrderIdList,
    setCancelOrderIdList,
  } = props;

  const { data: orders = [] } = useSWR(
    [`ordersListHistiry`],
    {
      fetcher: async () => {
        const res = await request({
          url: 'https://broker.onetradefinance.co/brokerage/c/getCList',
          data: {
            uid: localStorage.getItem('uid')
          }
        })
        return res.data
      },
    }
  );

  const [editingOrder, setEditingOrder] = useState(null);

  // const onCancelClick = useCallback(
  //   (order) => {
  //     handleCancelOrder(chainId, signer, order, { pendingTxns, setPendingTxns });
  //   },
  //   [signer, pendingTxns, setPendingTxns, chainId]
  // );

  // const onEditClick = useCallback(
  //   (order) => {
  //     setEditingOrder(order);
  //   },
  //   [setEditingOrder]
  // );

  const renderHead = useCallback(() => {
    const isAllOrdersSelected = cancelOrderIdList?.length > 0 && cancelOrderIdList?.length === orders.length;
    return (
      <tr className="Exchange-list-header">
        {!hideActions && orders.length > 0 && (
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
        )}

        <th>
          <div>
            <Trans>Type</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Order</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Price</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Done Price</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Size</Trans>
          </div>
        </th>
        <th>
          <div>
            <Trans>Type</Trans>
          </div>
        </th>
      </tr>
    );
  }, [cancelOrderIdList, orders, setCancelOrderIdList, hideActions]);

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

  // const renderActions = useCallback(
  //   (order) => {
  //     return (
  //       <>
  //         {/* <td>
  //           <button className="Exchange-list-action" onClick={() => onEditClick(order)}>
  //             <Trans>Edit</Trans>
  //           </button>
  //         </td> */}
  //         <td>
  //           <button className="Exchange-list-action" onClick={() => onCancelClick(order)}>
  //             <Trans>Cancel</Trans>
  //           </button>
  //         </td>
  //       </>
  //     );
  //   },
  //   [onCancelClick]
  // );

  const renderLargeList = useCallback(() => {
    if (!orders || !orders.length) {
      return null;
    }
    return orders.map((order) => {
      // if (order.type === SWAP) {
      //   const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
      //   const fromTokenInfo = getTokenInfo(infoTokens, order.path[0], true, nativeTokenAddress);
      //   const toTokenInfo = getTokenInfo(
      //     infoTokens,
      //     order.path[order.path.length - 1],
      //     order.shouldUnwrap,
      //     nativeTokenAddress
      //   );
      //   // const collateralUSD = getUsd(order.amountIn, fromTokenInfo.address, true, infoTokens);
      //   const markExchangeRate = getExchangeRate(fromTokenInfo, toTokenInfo);
      //   const orderId = `${order.type}-${order.index}`;
      //   const titleText = (
      //     <span>
      //       <Trans>Swap</Trans>{" "}
      //       {formatAmount(
      //         order.amountIn,
      //         fromTokenInfo.decimals,
      //         fromTokenInfo.isStable || fromTokenInfo.isUsdg ? 2 : 4,
      //         true
      //       )}{" "}
      //       <TokenIcon symbol={fromTokenInfo.symbol} displaySize={18} importSize={24} /> {fromTokenInfo.symbol} for{" "}
      //       {formatAmount(order.minOut, toTokenInfo.decimals, toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4, true)}{" "}
      //       <TokenIcon symbol={toTokenInfo.symbol} displaySize={18} importSize={24} /> {toTokenInfo.symbol}
      //     </span>
      //   );

      //   return (
      //     <tr className="Exchange-list-item" key={orderId}>
      //       {!hideActions && (
      //         <td>
      //           <div className="checkbox-inline ">
      //             <Checkbox
      //               isChecked={cancelOrderIdList?.includes(orderId)}
      //               setIsChecked={() => {
      //                 setCancelOrderIdList((prevState) => {
      //                   if (prevState.includes(orderId)) {
      //                     return prevState.filter((i) => i !== orderId);
      //                   } else {
      //                     return prevState.concat(orderId);
      //                   }
      //                 });
      //               }}
      //             />
      //           </div>
      //         </td>
      //       )}
      //       <td className="Exchange-list-item-type">
      //         <Trans>Limit</Trans>
      //       </td>
      //       <td className="inline-flex">
      //         {titleText}
      //         {/* <Tooltip
      //           handle={titleText}
      //           position="right-bottom"
      //           className="Order-list-item-text"
      //           renderContent={() => {
      //             return (
      //               <StatsTooltipRow
      //                 label={t`Collateral`}
      //                 value={`${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (${formatAmount(
      //                   order.amountIn,
      //                   fromTokenInfo.decimals,
      //                   4,
      //                   true
      //                 )}
      //                 ${fromTokenInfo.baseSymbol || fromTokenInfo.symbol})`}
      //               />
      //             );
      //           }}
      //         /> */}
      //       </td>
      //       <td>
      //         {!hideActions ? (
      //           <Tooltip
      //             handle={getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)}
      //             renderContent={() => t`
      //             You will receive at least ${formatAmount(
      //               order.minOut,
      //               toTokenInfo.decimals,
      //               toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4,
      //               true
      //             )} ${
      //               toTokenInfo.symbol
      //             } if this order is executed. The execution price may vary depending on swap fees at the time the order is executed.
      //           `}
      //           />
      //         ) : (
      //           getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)
      //         )}
      //       </td>
      //       <td>{getExchangeRateDisplay(markExchangeRate, fromTokenInfo, toTokenInfo, true)}</td>
      //       {!hideActions && renderActions(order)}
      //     </tr>
      //   );
      // }

      // const indexToken = getTokenInfo(infoTokens, order.indexToken);
      // const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
      // const indexTokenPriceDecimal = 2;

      // Longs Increase: max price
      // Longs Decrease: min price
      // Short Increase: min price
      // Short Decrease: max price
      // const maximisePrice = (order.type === INCREASE && order.isLong) || (order.type === DECREASE && !order.isLong);

      // const markPrice = maximisePrice ? indexToken.contractMaxPrice : indexToken.contractMinPrice;
      // const triggerPricePrefix = order.triggerAboveThreshold ? TRIGGER_PREFIX_ABOVE : TRIGGER_PREFIX_BELOW;
      // const indexTokenSymbol = indexToken.isWrapped ? indexToken.baseSymbol : indexToken.symbol;

      // const error = getOrderError(account, order, positionsMap);
      // const orderId = `${order.type}-${order.index}`;
      // const orderTitle = getOrderTitle(order, indexTokenSymbol);

      // const orderText = (
      //   <>
      //     {error ? (
      //       <Tooltip
      //         className="order-error"
      //         handle={orderTitle}
      //         position="right-bottom"
      //         handleClassName="plain"
      //         renderContent={() => <span className="negative">{error}</span>}
      //       />
      //     ) : (
      //       orderTitle
      //     )}
      //   </>
      // );

      return (
        <tr className="Exchange-list-item" key={`${order.orderType}-${order.type}-${order.id}`}>
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
          <td className="Exchange-list-item-type">{order.tradeType === 'long' ? t`Long` : t`Short`}</td>
          <td className="inline-flex">
            {order.tradeType === 'long' ? t`Long` : t`Short`} <SymbolWithIcon code={order.currency} />
          </td>
          <td>
            {order.sourcePrice}
          </td>
          <td>
            {order.donePrice}
          </td>
          <td>
            {order.sourceSize}
          </td>
          <td>
            {order.orderType}
          </td>
          {/* {!hideActions && renderActions(order)} */}
        </tr>
      );
    });
  }, [
    orders,
  ]);

  const renderSmallList = useCallback(() => {
    if (!orders || !orders.length) {
      return null;
    }

    return orders.map((order) => {
      // if (order.type === SWAP) {
      //   const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
      //   const fromTokenInfo = getTokenInfo(infoTokens, order.path[0], true, nativeTokenAddress);
      //   const toTokenInfo = getTokenInfo(
      //     infoTokens,
      //     order.path[order.path.length - 1],
      //     order.shouldUnwrap,
      //     nativeTokenAddress
      //   );
      //   const markExchangeRate = getExchangeRate(fromTokenInfo, toTokenInfo);
      //   const collateralUSD = getUsd(order.amountIn, fromTokenInfo.address, true, infoTokens);
      //   const titleText = (
      //     <>
      //       Swap {formatAmount(order.amountIn, fromTokenInfo.decimals, fromTokenInfo.isStable ? 2 : 4, true)}{" "}
      //       <TokenIcon symbol={fromTokenInfo.symbol} displaySize={18} importSize={24} /> {fromTokenInfo.symbol} for{" "}
      //       {formatAmount(order.minOut, toTokenInfo.decimals, toTokenInfo.isStable ? 2 : 4, true)}{" "}
      //       <TokenIcon symbol={toTokenInfo.symbol} displaySize={18} importSize={24} /> {toTokenInfo.symbol}
      //     </>
      //   );
      //   return (
      //     <div key={`${order.type}-${order.index}`} className="App-card">
      //       <div className="App-card-content">
      //         <div className="Order-list-card-title">{titleText}</div>
      //         <div className="App-card-divider"></div>
      //         <div className="App-card-row">
      //           <div className="label">
      //             <Trans>Price</Trans>
      //           </div>
      //           <div>
      //           {order.sourcePrice}
      //             {/* <Tooltip
      //               position="right-bottom"
      //               handle={getExchangeRateDisplay(order.triggerRatio, fromTokenInfo, toTokenInfo)}
      //               renderContent={() => t`
      //               You will receive at least ${formatAmount(
      //                 order.minOut,
      //                 toTokenInfo.decimals,
      //                 toTokenInfo.isStable || toTokenInfo.isUsdg ? 2 : 4,
      //                 true
      //               )} ${
      //                 toTokenInfo.symbol
      //               } if this order is executed. The exact execution price may vary depending on fees at the time the order is executed.
      //             `}
      //             /> */}
      //           </div>
      //         </div>
      //         <div className="App-card-row">
      //           <div className="label">
      //             <Trans>Mark Price</Trans>
      //           </div>
      //           <div>{getExchangeRateDisplay(markExchangeRate, fromTokenInfo, toTokenInfo)}</div>
      //         </div>
      //         <div className="App-card-row">
      //           <div className="label">
      //             <Trans>Collateral</Trans>
      //           </div>
      //           <div>
      //             ${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (
      //             {formatAmount(order.amountIn, fromTokenInfo.decimals, 4, true)}{" "}
      //             {fromTokenInfo.baseSymbol || fromTokenInfo.symbol})
      //           </div>
      //         </div>
      //       </div>
      //       <div>
      //         {!hideActions && (
      //           <>
      //             <div className="App-card-divider"></div>
      //             <div className="remove-top-margin">
      //               <Button variant="secondary" className="mr-md mt-md" onClick={() => onEditClick(order)}>
      //                 <Trans>Edit</Trans>
      //               </Button>
      //               <Button variant="secondary" className="mt-md" onClick={() => onCancelClick(order)}>
      //                 <Trans>Cancel</Trans>
      //               </Button>
      //             </div>
      //           </>
      //         )}
      //       </div>
      //     </div>
      //   );
      // }

      // const indexToken = getTokenInfo(infoTokens, order.indexToken);
      // const maximisePrice = (order.type === INCREASE && order.isLong) || (order.type === DECREASE && !order.isLong);
      // const markPrice = maximisePrice ? indexToken.contractMaxPrice : indexToken.contractMinPrice;
      // const triggerPricePrefix = order.triggerAboveThreshold ? TRIGGER_PREFIX_ABOVE : TRIGGER_PREFIX_BELOW;
      // const indexTokenSymbol = indexToken.isWrapped ? indexToken.baseSymbol : indexToken.symbol;

      // const collateralTokenInfo = getTokenInfo(infoTokens, order.purchaseToken);
      // const collateralUSD = getUsd(order.purchaseTokenAmount, order.purchaseToken, true, infoTokens);

      // const error = getOrderError(account, order, positionsMap);
      const orderTitle = order.tradeType === 'long' ? t`Long` : t`Short`;

      return (
        <div key={`${order.tradeType}-${order.type}-${order.id}`} className="App-card">
          <div className="App-card-content">
            <div className="Order-list-card-title">
              {orderTitle} <SymbolWithIcon code={order.currency} />
            </div>
            <div className="App-card-divider"></div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Price</Trans>
              </div>
              <div>
                {order.sourcePrice}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Done Price</Trans>
              </div>
              <div>
                {order.donePrice}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Size</Trans>
              </div>
              <div>
                {order.sourceSize}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Type</Trans>
              </div>
              <div>
                {order.orderType}
              </div>
            </div>
            {/* {order.type === INCREASE && (
              <div className="App-card-row">
                <div className="label">
                  <Trans>Collateral</Trans>
                </div>
                <div>
                  ${formatAmount(collateralUSD, USD_DECIMALS, 2, true)} (
                  {formatAmount(order.purchaseTokenAmount, collateralTokenInfo.decimals, 4, true)}{" "}
                  {collateralTokenInfo.baseSymbol || collateralTokenInfo.symbol})
                </div>
              </div>
            )} */}
          </div>
          <div>
          </div>
        </div>
      );
    });
  }, [orders]);

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

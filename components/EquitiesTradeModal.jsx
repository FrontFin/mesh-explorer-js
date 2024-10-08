/**
 * Copyright 2024-present Mesh Connect, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TradePreviewModal from "./TradePreview";
import TradeConfirmation from "./TradeConfirmation";
import {
  Card,
  CardContent,
  FormControl,
  Typography,
  Select,
  MenuItem,
  Grid,
  TextField,
  FormHelperText,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

const EquitiesTradeModal = ({
  open,
  onClose,
  brokerType,
  authToken,
  buyingPower,
}) => {
  const [brokerDetails, setBrokerDetails] = useState({});
  const [symbol, setSymbol] = useState("");
  const [loadingPreviewDetails, setLoadingPreviewDetails] = useState(false);
  const [orderType, setOrderType] = useState("marketType");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState(1);
  const [loadingBrokerDetails, setLoadingBrokerDetails] = useState(false);
  const [timeInForce, setTimeInForce] = useState("");
  const [paymentSymbol, setPaymentSumbol] = useState("USD");
  const [tradeStage, setTradeStage] = useState(1);
  const [loadingExecution, setLoadingExecution] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [amountType, setAmountType] = useState("quantity");
  const [amountIsInPaymentSymbol, setAmountIsInPaymentSymbol] = useState(false);
  const [isError, setIsError] = useState(false);

  const [tradeResponse, setTradeResponse] = useState({});
  const [price, setPrice] = useState(1);

  useEffect(() => {
    setLoadingBrokerDetails(true);
    const fetchBrokerDetails = async () => {
      try {
        const response = await fetch(
          `/api/transactions/broker/support?brokerType=${brokerType}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authToken: authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();
        setBrokerDetails(data.stockOrders);
        setLoadingBrokerDetails(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBrokerDetails();
  }, [brokerType]);

  useEffect(() => {
    if (brokerDetails) {
      const options = ["marketType", "limitType", "stopLossType"]
        .filter((type) => brokerDetails[type]?.supported)
        .map((type) => type);
      setDropdownOptions(options);
    }
  }, [brokerDetails]);

  useEffect(() => {
    setAmountIsInPaymentSymbol(amountType === "qu");
  }, [amountType]);

  const getSupportedTimeInForceList = () => {
    if (brokerDetails && brokerDetails[orderType]) {
      return brokerDetails[orderType].supportedTimeInForceList;
    }
    return null;
  };

  const supportedTimeInForceList = getSupportedTimeInForceList();

  const handleTrade = async () => {
    if (!orderType || !symbol || !side) {
      setIsError(true);
      return;
    }
    setLoadingPreviewDetails(true);

    let apiURL = `/api/transactions/preview?brokerType=${brokerType}&side=${side}&paymentSymbol=${paymentSymbol}&symbol=${symbol}&orderType=${orderType}&timeInForce=${timeInForce}&amount=${amount}&isCryptoCurrency=false&amountIsInPaymentSymbol=${amountIsInPaymentSymbol}`;

    if (orderType === "limitType" || orderType === "stopLossType") {
      apiURL += `&price=${price}`;
    }
    try {
      const getTradePreview = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          authToken: authToken,
        },
        method: "POST",
      });

      if (!getTradePreview.ok) {
        setLoadingPreviewDetails(false);
        const errorResponse = await getTradePreview.json();
        alert(`Preview Failed: ${errorResponse.error}`);
        return;
      }

      setTradeStage(2);
      setLoadingPreviewDetails(false);
    } catch (error) {
      console.log("this was the error from Mesh", error);
    }
  };

  const getSupportedAmountTypes = () => {
    console.log(
      "support dollars, ",
      brokerDetails?.marketType?.supportsPlacingBuyOrdersInPaymentSymbolAmount
    );
    const types = ["quantity"];
    if (
      brokerDetails?.marketType?.supportsPlacingBuyOrdersInPaymentSymbolAmount
    ) {
      types.push("dollars");
      console.log("can buy dollars worth");
    }
    return types;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
      maxWidth="md"
    >
      {tradeStage === 1 ? (
        <>
          <DialogTitle id="transfer-details-dialog-title">
            Equities Trade Form
          </DialogTitle>

          <DialogContent>
            {loadingBrokerDetails || loadingPreviewDetails ? (
              <>
                <p>Loading...</p>
                <CircularProgress />
              </>
            ) : (
              <div>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mt: 2,
                    gap: 2,
                    p: 2,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <form>
                      <FormControl fullWidth>
                        <Typography variant="h6">Order Type</Typography>
                        <Select
                          required
                          labelId="orderType-label"
                          id="orderType"
                          value={orderType}
                          label="Select Order Type"
                          onChange={(e) => setOrderType(e.target.value)}
                        >
                          {dropdownOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Select Symbol</Typography>
                        <TextField
                          required
                          labelId="symbol-label"
                          id="symbol"
                          value={symbol}
                          label="Select Symbol Type"
                          onChange={(e) => setSymbol(e.target.value)}
                        ></TextField>
                        {isError && !symbol && (
                          <FormHelperText>Required</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Select Order Side</Typography>
                        <Select
                          required
                          labelId="side-label"
                          id="side"
                          value={side}
                          label="Select Side Type"
                          onChange={(e) => setSide(e.target.value)}
                        >
                          <MenuItem value="buy">Buy</MenuItem>
                          <MenuItem value="sell">Sell</MenuItem>
                        </Select>
                      </FormControl>
                      {(orderType === "limitType" ||
                        orderType === "stopLossType") && (
                        <FormControl fullWidth>
                          <Typography variant="h6">Price</Typography>
                          <TextField
                            required
                            id="price"
                            value={price}
                            label="Price"
                            helperText="Price of the unit, used for Limit and StopLoss orders."
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </FormControl>
                      )}
                      <FormControl fullWidth>
                        <Typography variant="h6">Amount Type</Typography>
                        <Select
                          required
                          labelId="amountType-label"
                          id="amountType"
                          value={amountType}
                          label="Select Amount Type"
                          onChange={(e) => setAmountType(e.target.value)}
                        >
                          {getSupportedAmountTypes().map((type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Amount</Typography>
                        <TextField
                          required
                          id="amount"
                          value={amount}
                          label="Amount"
                          helperText="Amount of purchase."
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Time In force</Typography>
                        <Select
                          required
                          labelId="timeInForce-label"
                          id="timeInForce"
                          value={timeInForce}
                          label="Select Time In Force Type"
                          onChange={(e) => setTimeInForce(e.target.value)}
                        >
                          {supportedTimeInForceList?.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Payment Symbol</Typography>
                        <TextField
                          required
                          id="payment-symbol"
                          value={paymentSymbol}
                          helperText="Symbol to use for payment, defaults to USD."
                          onChange={(e) => setPaymentSumbol(e.target.value)}
                        />
                      </FormControl>
                      <p>{buyingPower}</p>
                      <Grid container justifyContent="flex-end" mt={2}>
                        <Button
                          onClick={handleTrade}
                          variant="contained"
                          color="primary"
                        >
                          Submit {symbol} {side}
                        </Button>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </>
      ) : null}

      {tradeStage === 2 ? (
        <TradePreviewModal
          authToken={authToken}
          brokerType={brokerType}
          symbol={symbol}
          side={side}
          orderType={orderType}
          amount={amount}
          price={price}
          timeInForce={timeInForce}
          setTradeStage={setTradeStage}
          tradeStage={tradeStage}
          paymentSymbol={paymentSymbol}
          loadingExecution={loadingExecution}
          setLoadingExecution={setLoadingExecution}
          setTradeResponse={setTradeResponse}
          isCryptoCurrency="false"
          amountIsInPaymentSymbol={amountIsInPaymentSymbol}
        />
      ) : null}

      {tradeStage === 3 && !loadingExecution ? (
        <TradeConfirmation tradeResponse={tradeResponse} />
      ) : null}

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EquitiesTradeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brokerType: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
  buyingPower: PropTypes.number.isRequired,
};

export default EquitiesTradeModal;

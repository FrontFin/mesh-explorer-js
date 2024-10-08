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

import { FrontApi } from "@meshconnect/node-api";
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const { symbol, BrokerType, UserId, integrationId } = req.query;
  const { transferOptions, amountInFiat } = req.body;
  const { accessToken } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const bodyObject = {
    UserId: UserId,
    RestrictMultipleAccounts: true,
  };

  if (BrokerType && BrokerType !== "deFiWallet") {
    bodyObject.BrokerType = BrokerType;
  } else if (typeof integrationId !== "undefined") {
    bodyObject.integrationId = integrationId;
  }
  if (transferOptions && Object.keys(transferOptions).length > 0) {
    console.log("hit xfer options");
    bodyObject.transferOptions = transferOptions;
  }
  if (amountInFiat) bodyObject.amountInFiat = amountInFiat;
  if (symbol) bodyObject.symbol = symbol;
  if (accessToken) bodyObject.accessToken = accessToken;

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": CLIENT_ID,
      "X-Client-Secret": PROD_API_KEY,
    },
  });

  try {
    const getCatalogLink =
      await api.managedAccountAuthentication.v1LinktokenCreate(bodyObject);

    if (getCatalogLink.status !== 200) {
      const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${getCatalogLink.message}`;
      throw new Error(errorMessage.displayMessage);
    }
    return res.status(200).json(getCatalogLink.data);
  } catch (error) {
    console.error("Error response:", error.response);

    res.status(500).json({
      error: `Something went wrong: ${error.message}`,
    });
  }
}

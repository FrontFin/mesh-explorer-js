/**
 * Copyright 2023-present Mesh Connect, Inc.
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

import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const authToken = req.headers['authtoken'];

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

   const payload = {
      authToken: authToken,
      type: req.query.brokerType,
      symbol: req.query.symbol,
      paymentSymbol: req.query.paymentSymbol,
      isCryptoCurrency: true,
      amount: req.query.amount,
      orderType: req.query.orderType.slice(0, -4),
      timeInForce: req.query.timeInForce,
    };

      console.log('!!!!' , payload)


  try {
   

    const tradePreview = await api.transactions.v1TransactionsPreviewCreate(
     req.query.side,
      payload
    );

    if (
      tradePreview.status !== 200 ||
      tradePreview.data.status.content !== 'failed'
    ) {
      throw new Error(
        `Failed to fetch trade Preview: ${JSON.stringify(
          tradePreview.data
        )}`
      );
    }
    return res.status(200).json(tradePreview.data.content);
  } catch (error) {
    // Log the error details to the console for debugging

    console.error('Error details:', {
      message: error,
      stack: error.stack,
      response: error.response?.data || error.response, // If axios response is available
      request: {
        method: req.method,
        query: req.query,
        body: req.body,
        headers: req.headers
      }
    });

    // Respond with a detailed error message if possible
    const clientErrorMessage = error.response?.data?.content?.errorMessage ||
      error.response?.data?.message ||
      error.message;

    res.status(500).json({
      error: `Something went wrong: ${clientErrorMessage}`,
      details: {
        method: req.method,
        endpoint: req.url,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
}

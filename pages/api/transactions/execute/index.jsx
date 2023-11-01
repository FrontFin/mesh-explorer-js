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

  try {
    const payload = {
      authToken: authToken,
      type: req.query.brokerType,
      symbol: req.query.symbol,
      paymentSymbol: req.query.paymentSymbol,
      amountIsInPaymentSymbol: false,
      amount: req.query.amount,
      isCryptoCurrency: true,
      paymentIsCryptoCurrency: false,
      orderType: req.query.orderType.slice(0, -4),
      timeInForce: req.query.timeInForce,
    };

    const tradeExecution = await api.transactions.v1TransactionsCreate(
      req.query.side,
      payload
    );

    if (tradeExecution.status !== 200) {
      throw new Error(
        `Failed to execute trade: ${JSON.stringify(
          tradeExecution.data.content.errorMessage
        )}`
      );
    }
    return res.status(200).json(tradeExecution.data.content);
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.message, details: error.response.data });
    }

    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}

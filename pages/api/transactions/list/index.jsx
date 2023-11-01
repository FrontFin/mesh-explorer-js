import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

  try {
    const fetchTransactions =
      await api.transactions.v1TransactionsListCreate(payload);

    if (fetchTransactions.status !== 200) {
      const errorMessage = `Failed to Fetch Transfer details. Status: ${fetchTransactions.status} - ${fetchTransactions.statusText}. Message: ${fetchTransactions.message}`;
      throw new Error(`Failed to Fetch Transfer details: ${errorMessage}`);
    }
    return res.status(200).json(fetchTransactions.data);
  } catch (error) {
    res.status(500).json({
      error: `Something went wrong with Fetching transfer details: ${error}`,
    });
  }
}

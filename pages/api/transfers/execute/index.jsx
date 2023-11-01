import { FrontApi } from '@front-finance/api';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  console.log('req.body', req.body);

  const payload = req.body;

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
    const executeTransfer =
      await api.managedTransfers.v1TransfersManagedExecuteCreate(payload);

    if (!executeTransfer || executeTransfer.status !== 200) {
      const errorMessage =
        executeTransfer?.statusText || 'Unknown error occurred';
      throw new Error(
        `Failed to execute transfer. Status: ${executeTransfer?.status} - ${errorMessage}. Message: ${executeTransfer?.data?.message}`
      );
    }
    return res.status(200).json(executeTransfer.data);
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

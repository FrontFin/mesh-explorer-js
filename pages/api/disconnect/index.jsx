import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const { method, body: payload } = req;
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (method !== 'DELETE') {
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
    const disconnectAccount =
      await api.managedAccountAuthentication.v1AccountDelete(payload);

    if (disconnectAccount.status !== 200) {
      const errorMessage = `Failed to disconnect account. Status: ${disconnectAccount.status} - ${disconnectAccount.statusText}. Message: ${disconnectAccount.message}`;
      throw new Error(errorMessage);
    }

    return res.status(200).json(disconnectAccount.data);
  } catch (error) {
    console.log('Error from Mesh:', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}

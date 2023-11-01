import { FrontApi } from '@front-finance/api';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use GET method.' });
  }

  const { userId } = req.query;

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

  try {
    const response = await api.portfolio.v1HoldingsPortfolioList({
      UserId: userId,
    });
    if (response.status !== 200) {
      const errorMessage = `Failed to fetch Portfolio Holdings. Status: ${response.status} - ${response.statusText}. Message: ${response.message}`;
      throw new Error(errorMessage);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}

export default async function handler(req, res) {
  const { method, body: payload } = req;
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const refreshAccount = await fetch(`${MESH_API_URL}/api/v1/token/refresh`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
    });

    if (!refreshAccount.ok) {
      const responseBody = await refreshAccount.json();
      const errorMessage = `Failed to Refresh account. Status: ${refreshAccount.status} - ${refreshAccount.statusText}. Message: ${responseBody.message}`;
      throw new Error(errorMessage);
    }

    const response = await refreshAccount.json();
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}

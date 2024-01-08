export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  console.log('tokens hit');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const getStatus = await fetch(
      `${MESH_API_URL}/api/v1/transfers/managed/tokens`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': PROD_API_KEY,
        },
      }
    );

    if (getStatus.status !== 200) {
      throw new Error(`Failed to fetch status: ${getStatus.statusText}`);
    }

    const statusData = await getStatus.json(); // Convert the response to JSON
    return res.status(200).json(statusData); // Send the JSON data in the response
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}

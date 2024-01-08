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

export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const {
    offset,
    descendingOrder,
    count,
    userId,
    fromTimestamp,
    toTimestamp,
    id,
  } = req.query;

  console.log(req.query);
  const queryParams = new URLSearchParams();
  if (userId !== undefined) queryParams.append('userId', userId);
  if (count !== undefined) queryParams.append('count', count);
  if (id !== undefined) queryParams.append('id', id);
  if (fromTimestamp !== 'undefined')
    queryParams.append('fromTimestamp', fromTimestamp);
  if (toTimestamp !== 'undefined')
    queryParams.append('toTimestamp', toTimestamp);

  if (descendingOrder !== undefined)
    queryParams.append('descendingOrder', descendingOrder);
  if (offset !== undefined) queryParams.append('offset', offset);

  const url = `${MESH_API_URL}/api/v1/transfers/mesh?${queryParams.toString()}`;
  console.log('url', url);
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('hit executed', count, descendingOrder, offset);

  try {
    const fetchTransfers = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
    });

    if (fetchTransfers.status !== 200) {
      const errorMessage = `Failed to Fetch Transfer details. Status: ${fetchTransfers.status} - ${fetchTransfers.statusText}. `;
      throw new Error(`Failed to Fetch Transfer details: ${errorMessage}`);
    }
    const response = await fetchTransfers.json();
    return res.status(200).json(response.content.items);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}

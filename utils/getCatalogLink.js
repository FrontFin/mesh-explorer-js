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

import { getUserId } from '../utils/UserId';

export const getCatalogLink = async (
  brokerType,
  setCatalogLink = () => {},
  setOpenMeshModal = () => {},
  setErrorMessage = () => {},
  payload = null,
  integrationId = null,
  providerType = 'CEX',
  type = 'authorizaton'
) => {
  const UserId = getUserId(brokerType);

  let address;
  if (payload) {
    address = payload?.transferOptions?.toAddresses[0]?.address;
  }
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (payload) {
    fetchOptions.body = JSON.stringify(payload);
  }

  try {
    let link;
    if (type === 'authorization') {
      if (integrationId) {
        link = await fetch(
          `/api/catalog?UserId=${UserId}&integrationId=${integrationId}&authModal=true`,
          fetchOptions
        );
      } else if (brokerType && providerType !== 'Full Catalogue') {
        link = await fetch(
          `/api/catalog?UserId=${UserId}&BrokerType=${brokerType}&authModal=true`,
          fetchOptions
        );
      } else {
        link = await fetch(`/api/catalog?UserId=${UserId}`, fetchOptions);
      }
    } else if (type === 'transfer') {
      link = await fetch(
        `/api/catalog?UserId=${UserId}&BrokerType=${brokerType}&authModal=false&address=${address}`,
        fetchOptions
      );
    } else {
      return;
    }

    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.linkToken);
      setOpenMeshModal(true);
    }
  } catch (error) {
    console.log(`Something went wrong: ${error.message}`);
    setErrorMessage(`Something went wrong: ${error.message}`);
  }
};

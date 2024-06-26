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

const userId = process.env.NEXT_PUBLIC_USER_ID;

export const getUserId = (brokerType) => {
  switch (brokerType) {
    case 'coinbase':
      return `coin${userId}`;
    case 'deFiWallet':
      return `defi${userId}`;
    case 'binanceInternationalDirect':
      return `binanceInt${userId}`;

    case 'robinhood':
      return `robin${userId}`;
    case 'binance':
      return `binance${userId}`;
    case 'alpaca':
      return `alpaca${userId}`;
    case 'public':
      return `public${userId}`;
    case 'etoro':
      return `etoro${userId}`;
    case 'acorns':
      return `acorns${userId}`;
    default:
      return '000000007';
  }
};

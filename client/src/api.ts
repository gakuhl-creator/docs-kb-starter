import { Client, cacheExchange, fetchExchange } from 'urql'

export const api = new Client({
  url: '/graphql',
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
  fetchOptions: () => ({
    headers: { 'content-type': 'application/json' }
  })
})
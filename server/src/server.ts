import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { schema } from './schema.js'

const yoga = createYoga({
  schema,
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
  graphqlEndpoint: '/graphql',
})

const server = createServer(yoga)
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nGraphQL → http://localhost:${PORT}${yoga.graphqlEndpoint}`)
})
// client/src/test/setup.ts
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { graphql, HttpResponse } from 'msw'

const now = new Date().toISOString()

export const server = setupServer(
    // Query name must match: query Docs(...) { ... }
    graphql.query('Docs', ({ variables }) => {
        const { tag, query } = (variables ?? {}) as { tag?: string; query?: string }
        const all = [
            { id: '1', title: 'Getting Started', content: 'Install…', tags: ['setup'], createdAt: now, updatedAt: now },
            { id: '2', title: 'Auth', content: 'JWT…', tags: ['api', 'auth'], createdAt: now, updatedAt: now },
        ]
        const filtered = all.filter(d =>
            (!tag || d.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())) &&
            (!query || (d.title + d.content).toLowerCase().includes(query.toLowerCase()))
        )
        return HttpResponse.json({ data: { docs: filtered } })
    }),

    // Mutation name must match: mutation AddDoc(...) { ... }
    graphql.mutation('AddDoc', ({ variables }) => {
        const { title = 'Knowledge', content = 'Body', tags = ['misc'] } =
            (variables ?? {}) as { title?: string; content?: string; tags?: string[] }
        const doc = { id: '3', title, content, tags, createdAt: now, updatedAt: now }
        return HttpResponse.json({ data: { addDoc: doc } })
    }),

    graphql.mutation('DeleteDoc', () =>
        HttpResponse.json({ data: { deleteDoc: true } })
    ),

    graphql.operation((req) => {
        return undefined
    })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterAll(() => server.close())

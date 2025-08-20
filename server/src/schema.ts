import { createSchema } from 'graphql-yoga'
import { nanoid } from 'nanoid'

export type DocPage = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const docs: DocPage[] = []

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type DocPage {
      id: ID!
      title: String!
      content: String!
      tags: [String!]!
      createdAt: String!
      updatedAt: String!
    }

    type Query {
      docs(tag: String, query: String, limit: Int = 50, offset: Int = 0): [DocPage!]!
      doc(id: ID!): DocPage
    }

    type Mutation {
      addDoc(title: String!, content: String!, tags: [String!]!): DocPage!
      updateDoc(id: ID!, title: String, content: String, tags: [String!]): DocPage!
      deleteDoc(id: ID!): Boolean!
    }
  `,
  resolvers: {
    Query: {
      docs: (_: unknown, args: { tag?: string; query?: string; limit?: number; offset?: number }) => {
        let results = docs
        if (args.tag) {
          const t = args.tag.toLowerCase()
          results = results.filter(d => d.tags.map(x => x.toLowerCase()).includes(t))
        }
        if (args.query) {
          const q = args.query.toLowerCase()
          results = results.filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
        }
        const start = Math.max(0, args.offset || 0)
        const end = start + Math.min(200, args.limit || 50)
        return results.slice(start, end)
      },
      doc: (_: unknown, { id }: { id: string }) => docs.find(d => d.id === id) || null,
    },
    Mutation: {
      addDoc: (_: unknown, { title, content, tags }: { title: string; content: string; tags: string[] }) => {
        const now = new Date().toISOString()
        const page: DocPage = { id: nanoid(12), title, content, tags, createdAt: now, updatedAt: now }
        docs.unshift(page)
        return page
      },
      updateDoc: (
        _: unknown,
        { id, title, content, tags }: { id: string; title?: string; content?: string; tags?: string[] }
      ) => {
        const idx = docs.findIndex(d => d.id === id)
        if (idx === -1) throw new Error('Doc not found')
        const updated: DocPage = {
          ...docs[idx],
          title: title ?? docs[idx].title,
          content: content ?? docs[idx].content,
          tags: tags ?? docs[idx].tags,
          updatedAt: new Date().toISOString(),
        }
        docs[idx] = updated
        return updated
      },
      deleteDoc: (_: unknown, { id }: { id: string }) => {
        const idx = docs.findIndex(d => d.id === id)
        if (idx === -1) return false
        docs.splice(idx, 1)
        return true
      },
    },
  },
})
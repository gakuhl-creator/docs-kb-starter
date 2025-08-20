import { describe, it, expect, beforeEach } from 'vitest'
import { createYoga } from 'graphql-yoga'
import { schema, __resetDocs } from './schema'

const yoga = createYoga({ schema, graphqlEndpoint: '/graphql' })

async function gql(query: string, variables?: unknown) {
    const res = await yoga.fetch('http://test/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables })
    })
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data
}

beforeEach(() => __resetDocs())

describe('GraphQL API', () => {
    it('creates and lists docs', async () => {
        const add = await gql(
            `mutation($t:String!,$c:String!,$tags:[String!]!){
         addDoc(title:$t,content:$c,tags:$tags){ id title }
       }`,
            { t: 'Hello', c: 'World', tags: ['setup'] }
        )
        expect(add.addDoc.title).toBe('Hello')

        const list = await gql(`query{ docs { id title tags } }`)
        expect(list.docs).toHaveLength(1)
        expect(list.docs[0].tags).toContain('setup')
    })

    it('filters by tag and query', async () => {
        await gql(`mutation{ addDoc(title:"Auth",content:"JWT",tags:["auth","api"]){ id } }`)
        await gql(`mutation{ addDoc(title:"Setup",content:"Install",tags:["setup"]){ id } }`)

        const byTag = await gql(`query($tag:String){ docs(tag:$tag){ title } }`, { tag: 'auth' })
        expect(byTag.docs.map((d: any) => d.title)).toEqual(['Auth'])

        const byQuery = await gql(`query($q:String){ docs(query:$q){ title } }`, { q: 'install' })
        expect(byQuery.docs.map((d: any) => d.title)).toEqual(['Setup'])
    })
})

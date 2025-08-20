import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation } from 'urql'
import type { DocPage } from './types'

const DocsQuery = `
  query Docs($tag: String, $query: String) {
    docs(tag: $tag, query: $query) { id title content tags createdAt updatedAt }
  }
`

const AddDocMutation = `
  mutation AddDoc($title: String!, $content: String!, $tags: [String!]!) {
    addDoc(title: $title, content: $content, tags: $tags) { id title content tags createdAt updatedAt }
  }
`

const DeleteDocMutation = `
  mutation DeleteDoc($id: ID!) { deleteDoc(id: $id) }
`

export default function App() {
  const [tagFilter, setTagFilter] = useState('')
  const [search, setSearch] = useState('')

  const [result, reexec] = useQuery<{ docs: DocPage[] }>({
    query: DocsQuery,
    variables: useMemo(() => ({ tag: tagFilter || undefined, query: search || undefined }), [tagFilter, search]),
  })

  const [, addDoc] = useMutation(AddDocMutation)
  const [, deleteDoc] = useMutation(DeleteDocMutation)

  useEffect(() => { reexec({ requestPolicy: 'network-only' }) }, [tagFilter, search, reexec])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { title: title.trim(), content: content.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean) }
    if (!payload.title || !payload.content) return
    await addDoc(payload)
    setTitle('')
    setContent('')
    setTags('')
    reexec({ requestPolicy: 'network-only' })
  }

  return (
    <>
      <h1>Knowledge Base</h1>
      <div className="toolbar">
        <input placeholder="Filter by tag…" value={tagFilter} onChange={e => setTagFilter(e.target.value)} />
        <input placeholder="Search title/content…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={create} className="grid">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Content (supports plain text)" value={content} onChange={e => setContent(e.target.value)} rows={6} />
          <input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit">Add Doc</button>
            <span className="meta">Tip: add tags like \"setup, api, auth\"</span>
          </div>
        </form>
      </div>

      {result.fetching && <p>Loading…</p>}
      {result.error && <p style={{ color: 'crimson' }}>{String(result.error)}</p>}

      <div className="grid">
        {result.data?.docs.map(d => (
          <article key={d.id} className="card">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{d.title}</h2>
              <button onClick={() => deleteDoc({ id: d.id }).then(() => reexec({ requestPolicy: 'network-only' }))}>Delete</button>
            </header>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{d.content}</p>
            <div className="tags">
              {d.tags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <p className="meta">Updated {new Date(d.updatedAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </>
  )
}
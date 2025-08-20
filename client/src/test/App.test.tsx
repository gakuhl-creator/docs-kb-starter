import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Provider } from 'urql'
import { api } from '../api'
import App from '../App'

function renderApp() {
    return render(
        <Provider value={api}>
            <div className="container"><App /></div>
        </Provider>
    )
}

describe('Knowledge Base UI', () => {
    it('lists docs and filters by tag', async () => {
        renderApp()
        // shows initial docs
        expect(await screen.findByText('Getting Started')).toBeInTheDocument()
        // filter by tag=auth
        await userEvent.type(screen.getByPlaceholderText(/Filter by tag/i), 'auth')
        // should now show the auth doc
        expect(await screen.findByText('Auth')).toBeInTheDocument()
    })

    it('creates a new doc via the form', async () => {
        renderApp()
        await userEvent.type(screen.getByPlaceholderText(/^Title$/), 'Knowledge')
        await userEvent.type(screen.getByPlaceholderText(/Content \(supports plain text\)/), 'Body')
        await userEvent.type(screen.getByPlaceholderText(/Tags \(comma separated\)/), 'misc')
        await userEvent.click(screen.getByText(/Add Doc/i))

        expect(await screen.findByText(/Knowledge/i)).toBeVisible()
    })
})

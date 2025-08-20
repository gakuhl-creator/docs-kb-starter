import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'urql'
import { api } from './api'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider value={api}>
      <div className="container">
        <App />
      </div>
    </Provider>
  </React.StrictMode>
)
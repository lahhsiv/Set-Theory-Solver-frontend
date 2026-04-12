import InputForm from './components/InputForm'
import ResultDisplay from './components/ResultDisplay'
import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentOp, setCurrentOp] = useState(null)
  const [currentSets, setCurrentSets] = useState({ setA: '', setB: '', setU: '' })

  const handleSolve = async (formData) => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setCurrentOp(formData.operation)
    setCurrentSets({ setA: formData.setA, setB: formData.setB, setU: formData.setU })

    try {
      const res = await fetch(`${API_BASE}/${formData.operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setA: formData.setA,
          setB: formData.setB,
          setU: formData.setU
        })
      });

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.steps ? data.steps[0] : 'An error occurred during calculation. Check your input format.');
      }

      setTimeout(() => {
        setResponse(data)
        setLoading(false)
      }, 400);

    } catch (err) {
      setError(err.message || 'Failed to connect to the backend server.');
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Set Theory Solver</h1>
        <p className="subtitle">Interactive mathematical set operations with AI-style reasoning</p>
      </header>

      <InputForm onSubmit={handleSolve} loading={loading} />
      
      {error && (
        <div className="error-message">
          <strong>Oops!</strong> {error}
        </div>
      )}

      {response && <ResultDisplay response={response} operation={currentOp} sets={currentSets} />}

      <footer className="author-footer">
        Developed with ❤️ by <span className="author-name">Vishal Maurya</span>
      </footer>
    </div>
  )
}

export default App

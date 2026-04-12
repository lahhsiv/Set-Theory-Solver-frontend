import { useState } from 'react'

export default function InputForm({ onSubmit, loading }) {
  const [setA, setSetA] = useState('{1, 2, 3}')
  const [setB, setSetB] = useState('{3, 4, 5}')
  const [setU, setSetU] = useState('{1, 2, 3, 4, 5, 6, 7, 8}')
  const [operation, setOperation] = useState('union')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ setA, setB, setU, operation })
  }

  const needsSetB = ['union', 'intersection', 'cartesian', 'subset'].includes(operation);
  const needsSetU = ['complement'].includes(operation);

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <label htmlFor="operation">Select Operation</label>
        <select 
          id="operation" 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="union">Union (A ∪ B)</option>
          <option value="intersection">Intersection (A ∩ B)</option>
          <option value="complement">Complement (A')</option>
          <option value="cartesian">Cartesian Product (A × B)</option>
          <option value="powerset">Power Set P(A)</option>
          <option value="subset">Subset Check (A ⊆ B)</option>
        </select>
      </div>

      <div className={`form-group ${!needsSetB && !needsSetU ? 'full-width' : ''}`}>
        <label htmlFor="setA">Set A</label>
        <input 
          type="text" 
          id="setA" 
          value={setA} 
          onChange={(e) => setSetA(e.target.value)} 
          placeholder="{1, 2, 3}"
          required
        />
      </div>

      {needsSetB && (
        <div className="form-group">
          <label htmlFor="setB">Set B</label>
          <input 
            type="text" 
            id="setB" 
            value={setB} 
            onChange={(e) => setSetB(e.target.value)} 
            placeholder="{3, 4, 5}"
            required={needsSetB}
          />
        </div>
      )}

      {needsSetU && (
        <div className="form-group">
          <label htmlFor="setU">Universal Set U</label>
          <input 
            type="text" 
            id="setU" 
            value={setU} 
            onChange={(e) => setSetU(e.target.value)} 
            placeholder="{1, 2, 3...}"
            required={needsSetU}
          />
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Crunching numbers...' : 'Solve Operation ✨'}
      </button>
    </form>
  )
}

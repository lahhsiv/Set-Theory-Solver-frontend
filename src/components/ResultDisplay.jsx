import { useState } from 'react';
import VennDiagram from './VennDiagram';

export default function ResultDisplay({ response, operation, sets }) {
  const [viewMode, setViewMode] = useState('steps'); // 'steps' | 'venn'

  if (!response) return null;

  return (
    <div className="result-section">
      <div className="result-card">
        <span className="result-label">Final Result</span>
        <div className="result-value">{response.result}</div>
      </div>
      
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'steps' ? 'active' : ''}`}
          onClick={() => setViewMode('steps')}
        >
          📝 Step-by-Step Logic
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'venn' ? 'active' : ''}`}
          onClick={() => setViewMode('venn')}
        >
          🎨 Venn Diagram
        </button>
      </div>

      <div className="view-content">
        {viewMode === 'steps' ? (
          <div className="steps-container">
            <h3 className="steps-title">Reasoning</h3>
            <ul className="steps-list">
              {response.steps.map((step, index) => (
                <li 
                  key={index} 
                  className="step-item" 
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="venn-container-wrapper steps-container">
             <h3 className="steps-title">Visual Representation</h3>
            <VennDiagram operation={operation} sets={sets} />
          </div>
        )}
      </div>
    </div>
  )
}

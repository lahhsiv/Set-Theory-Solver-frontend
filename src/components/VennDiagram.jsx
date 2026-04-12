import React, { useMemo } from 'react';

// Helper to parse string "{1, 2, 3}" into an array ['1', '2', '3']
const parseSetString = (str) => {
  if (!str) return [];
  return str.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
};

export default function VennDiagram({ operation, sets }) {
  // Define visibility and highlight logic based on operation
  const config = useMemo(() => {
    switch (operation) {
      case 'union': return { A: true, B: true, intersection: true, U: false, message: null };
      case 'intersection': return { A: false, B: false, intersection: true, U: false, message: null };
      case 'complement': return { A: false, B: false, intersection: false, U: true, message: null };
      case 'subset': return { A: false, B: false, intersection: false, U: false, message: "Standard Venn shading not applicable for Subset checks." };
      case 'cartesian': return { A: false, B: false, intersection: false, U: false, message: "Cartesian Products represent pairs, which don't map to a 2D Venn Diagram." };
      case 'powerset': return { A: false, B: false, intersection: false, U: false, message: "Power Set contains sets of sets, which can't be drawn neatly in this diagram." };
      default: return { A: false, B: false, intersection: false, U: false, message: null };
    }
  }, [operation]);

  // Parse strings to calculate regional elements
  const arrA = useMemo(() => parseSetString(sets?.setA), [sets]);
  const arrB = useMemo(() => parseSetString(sets?.setB), [sets]);
  const arrU = useMemo(() => parseSetString(sets?.setU), [sets]);

  const aOnly = arrA.filter(x => !arrB.includes(x));
  const bOnly = arrB.filter(x => !arrA.includes(x));
  const intersectionEls = arrA.filter(x => arrB.includes(x));
  const unionAll = [...new Set([...arrA, ...arrB])];
  const uOnly = arrU.filter(x => !unionAll.includes(x));

  const formatEls = (arr) => {
    if (!arr || arr.length === 0) return "";
    const s = arr.join(', ');
    return s.length > 20 ? s.substring(0, 18) + '...' : s;
  };

  // If operation doesn't fit standard Venn visualization
  if (config.message) {
    return (
      <div className="venn-placeholder">
        <span className="venn-icon">💡</span>
        <p>{config.message}</p>
      </div>
    );
  }

  const highlightClass = "venn-fill-active";
  const dimClass = "venn-fill-dim";

  return (
    <div className="venn-diagram-container">
      <svg viewBox="0 0 400 250" className="venn-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="circle-a-clip">
            <circle cx="150" cy="125" r="75" />
          </clipPath>
          <clipPath id="circle-b-clip">
            <circle cx="250" cy="125" r="75" />
          </clipPath>
        </defs>

        {/* Universal Background */}
        <rect x="10" y="10" width="380" height="230" rx="16" className={`venn-rect ${config.U ? highlightClass : dimClass}`} />
        <text x="25" y="35" className="venn-label">U</text>
        <text x="25" y="225" className="venn-elements-text">{formatEls(uOnly)}</text>

        {/* Base Circles */}
        <circle cx="150" cy="125" r="75" className={`venn-circle ${config.A || config.U ? highlightClass : dimClass}`} />
        <circle cx="250" cy="125" r="75" className={`venn-circle ${config.B || config.U ? highlightClass : dimClass}`} />

        {/* Intersection Selection Highlight */}
        <g clipPath="url(#circle-b-clip)">
          <circle cx="150" cy="125" r="75" className={`venn-intersection ${config.intersection || config.U ? highlightClass : dimClass}`} />
        </g>

        {/* Title Labels */}
        <text x="110" y="80" className="venn-labelvenn">A</text>
        <text x="290" y="80" className="venn-labelvenn">B</text>

        {/* Dynamic Elements inside diagram */}
        <text x="110" y="125" className="venn-elements-text" textAnchor="middle">{formatEls(aOnly)}</text>
        <text x="290" y="125" className="venn-elements-text" textAnchor="middle">{formatEls(bOnly)}</text>
        <text x="200" y="125" className="venn-elements-text" textAnchor="middle">{formatEls(intersectionEls)}</text>
      </svg>
    </div>
  );
}

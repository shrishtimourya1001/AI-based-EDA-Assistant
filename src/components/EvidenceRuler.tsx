import React from 'react';
import { CitationItem } from '../types';

interface EvidenceRulerProps {
  citations: CitationItem[];
  activeCitationId: string | null;
  onSelectCitation: (id: string) => void;
  hoveredCitationId: string | null;
  onHoverCitation: (id: string | null) => void;
  currentDocumentId: string;
}

export const EvidenceRuler: React.FC<EvidenceRulerProps> = ({
  citations,
  activeCitationId,
  onSelectCitation,
  hoveredCitationId,
  onHoverCitation,
  currentDocumentId
}) => {
  // Filter citations belonging to this document or show top visible ones
  const docCitations = citations.filter((c) => c.sourceDocId === currentDocumentId);

  return (
    <div
      id="evidence-ruler-rail"
      className="w-12 shrink-0 bg-[#F5F4EF] border-r border-[#E5E4DE] relative flex flex-col items-center select-none py-4"
      aria-label="Evidence Ruler"
    >
      {/* Ruler header label */}
      <div className="rotate-180 [writing-mode:vertical-rl] font-mono text-[9px] uppercase tracking-widest text-[#72777B] mb-4 opacity-70">
        EVIDENCE RULER
      </div>

      {/* Metric tick marks along the vertical rail */}
      <div className="absolute inset-y-8 right-0 w-full flex flex-col justify-between pointer-events-none opacity-40">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="w-full flex justify-end items-center pr-0.5">
            <span
              className={`h-[1px] bg-[#9E9D95] ${
                i % 4 === 0 ? 'w-3' : i % 2 === 0 ? 'w-2' : 'w-1'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Citation Markers */}
      <div className="relative w-full h-[calc(100%-60px)]">
        {docCitations.map((citation) => {
          const isActive = activeCitationId === citation.id;
          const isHovered = hoveredCitationId === citation.id;

          return (
            <div
              key={citation.id}
              style={{ top: `${citation.yOffsetPercent}%` }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group"
              onMouseEnter={() => onHoverCitation(citation.id)}
              onMouseLeave={() => onHoverCitation(null)}
            >
              {/* Connector line shooting to document border if active */}
              {isActive && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-[#4B6170] pointer-events-none" />
              )}

              {/* Marker Button */}
              <button
                id={`ruler-marker-${citation.id.toLowerCase()}`}
                onClick={() => onSelectCitation(citation.id)}
                className={`w-8 h-6 rounded flex items-center justify-center font-mono text-[11px] font-semibold transition-all duration-150 shadow-2xs ${
                  isActive
                    ? 'bg-[#181B1D] text-white ring-2 ring-[#4B6170] scale-110 shadow-md'
                    : isHovered
                    ? 'bg-[#4B6170] text-white scale-105'
                    : 'bg-[#EAE8E1] hover:bg-[#DEDBD2] text-[#2D3134] border border-[#D0CECB]'
                }`}
                aria-label={`Jump to evidence marker ${citation.id}`}
              >
                {citation.id}
              </button>

              {/* Precise Coordinates Floating Tooltip */}
              <div
                className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#181B1D] text-white p-2 rounded shadow-xl border border-slate-700 pointer-events-none z-40 transition-opacity duration-150 ${
                  isHovered || isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10.5px] font-bold text-amber-300">
                    [{citation.id}]
                  </span>
                  <span className="text-[11px] font-medium text-slate-200">
                    {citation.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span>{citation.coordinates}</span>
                  <span>·</span>
                  <span className="text-emerald-400">Score: {citation.relevanceScore}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coordinate index indicator at bottom */}
      <div className="mt-auto font-mono text-[8.5px] text-[#72777B] tracking-tighter">
        LOC.AXIS
      </div>
    </div>
  );
};

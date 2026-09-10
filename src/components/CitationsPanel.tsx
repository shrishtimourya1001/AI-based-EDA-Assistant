import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Copy,
  Check,
  Download,
  Filter,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { CitationItem, EvidenceFilter, SortOption } from '../types';

interface CitationsPanelProps {
  citations: CitationItem[];
  activeCitationId: string | null;
  onSelectCitation: (id: string) => void;
  hoveredCitationId: string | null;
  onHoverCitation: (id: string | null) => void;
  onExportCsv: () => void;
  onOpenSourceInViewer: (citation: CitationItem) => void;
}

export const CitationsPanel: React.FC<CitationsPanelProps> = ({
  citations,
  activeCitationId,
  onSelectCitation,
  hoveredCitationId,
  onHoverCitation,
  onExportCsv,
  onOpenSourceInViewer
}) => {
  const [selectedFilter, setSelectedFilter] = useState<EvidenceFilter>('All');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [copiedCiteId, setCopiedCiteId] = useState<string | null>(null);

  // Filter citations
  const filtered = citations.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.fileType === selectedFilter;
  });

  // Sort citations
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'relevance') {
      return b.relevanceScore - a.relevanceScore;
    } else if (sortOption === 'page') {
      return a.pageNumber - b.pageNumber;
    }
    return 0;
  });

  const handleCopyCitation = (citation: CitationItem) => {
    const textToCopy = `[${citation.id}] ${citation.sourceName}, ${citation.location} (${citation.coordinates}): "${citation.previewSnippet}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCiteId(citation.id);
    setTimeout(() => setCopiedCiteId(null), 2000);
  };

  return (
    <section
      id="citations-evidence-panel"
      className="w-[340px] shrink-0 bg-[#F8F8F5] border-l border-[#E5E4DE] flex flex-col justify-between select-none"
      style={{ height: '100vh' }}
      aria-label="Citations and Evidence"
    >
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-[#E5E4DE] flex items-center justify-between shrink-0 bg-white/50">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-semibold text-[14px] text-[#181B1D]">
            Citations
          </h2>
          <span className="font-mono text-[11px] text-[#72777B]">
            {citations.length} evidence matches
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified</span>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="px-3 py-2 border-b border-[#E5E4DE] bg-[#F3F2EC] flex items-center justify-between gap-2 shrink-0">
        {/* Type Filter buttons */}
        <div className="flex items-center gap-1">
          {(['All', 'PDF', 'CSV', 'XLSX'] as EvidenceFilter[]).map((filter) => (
            <button
              key={filter}
              id={`filter-citation-${filter.toLowerCase()}`}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#181B1D] text-white shadow-2xs'
                  : 'bg-white text-[#72777B] hover:text-[#181B1D] border border-[#D9D8D2]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <button
          onClick={() => setSortOption(sortOption === 'relevance' ? 'page' : 'relevance')}
          className="flex items-center gap-1 font-mono text-[10.5px] text-[#4B6170] hover:text-[#181B1D] bg-white px-2 py-0.5 rounded border border-[#D9D8D2] transition-colors"
          title="Toggle Sort"
        >
          <ArrowUpDown className="w-3 h-3" />
          <span>Sort: {sortOption === 'relevance' ? 'Relevance' : 'Page'}</span>
        </button>
      </div>

      {/* Evidence Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sorted.map((item) => {
          const isActive = activeCitationId === item.id;
          const isHovered = hoveredCitationId === item.id;

          return (
            <article
              key={item.id}
              id={`evidence-card-${item.id.toLowerCase()}`}
              onClick={() => onSelectCitation(item.id)}
              onMouseEnter={() => onHoverCitation(item.id)}
              onMouseLeave={() => onHoverCitation(null)}
              className={`p-3 rounded-lg border transition-all cursor-pointer select-text ${
                isActive
                  ? 'bg-white border-[#4B6170] ring-1.5 ring-[#4B6170] shadow-sm'
                  : isHovered
                  ? 'bg-white border-[#C7C6BE] shadow-2xs'
                  : 'bg-white border-[#E0DFD7] hover:border-[#C7C6BE]'
              }`}
            >
              {/* Top Row: Citation ID & Source */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#181B1D] text-white' : 'bg-[#EAE8E1] text-[#181B1D] border border-[#D0CFC7]'
                  }`}>
                    {item.id}
                  </span>
                  <span className="text-[12px] font-medium text-[#181B1D] truncate max-w-[170px]" title={item.sourceName}>
                    {item.sourceName}
                  </span>
                </div>
                <span className="font-mono text-[10.5px] text-emerald-700 font-semibold">
                  {item.relevanceScore}% match
                </span>
              </div>

              {/* Location */}
              <div className="font-mono text-[10.5px] text-[#4B6170] mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#72777B]" />
                <span>{item.location}</span>
              </div>

              {/* Preview Snippet */}
              <p className="text-[11.5px] text-[#2D3134] leading-relaxed bg-[#FAF9F5] p-2 rounded border border-[#EBEAE3] mb-2 font-serif italic">
                “{item.previewSnippet}”
              </p>

              {/* Evidence Data & Coordinates */}
              <div className="flex items-center justify-between border-t border-[#EFEFEA] pt-2 mt-1">
                <div className="font-mono text-[10px] text-[#72777B]">
                  <span>{item.coordinates}</span>
                </div>

                {/* Actions: Open Source, Copy Citation */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSourceInViewer(item);
                    }}
                    className="flex items-center gap-1 font-mono text-[10px] text-[#4B6170] hover:text-[#181B1D] bg-[#F1F0EC] hover:bg-[#E8E7E0] px-1.5 py-0.5 rounded transition-colors"
                    title="Open in Source Viewer"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Open Source</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCitation(item);
                    }}
                    className="flex items-center gap-1 font-mono text-[10px] text-[#4B6170] hover:text-[#181B1D] bg-[#F1F0EC] hover:bg-[#E8E7E0] px-1.5 py-0.5 rounded transition-colors"
                    title="Copy Citation"
                  >
                    {copiedCiteId === item.id ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Restrained Export Action */}
      <div className="p-3 border-t border-[#E5E4DE] bg-[#F4F4EF] shrink-0">
        <button
          id="btn-export-evidence-csv"
          onClick={onExportCsv}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#181B1D] hover:bg-[#2D3134] text-white text-[12px] font-medium font-sans transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-300" />
          <span>Export Evidence → CSV</span>
        </button>
        <p className="font-mono text-[9.5px] text-[#72777B] text-center mt-1.5">
          SHA-256 verifiable cryptographic audit trail
        </p>
      </div>
    </section>
  );
};

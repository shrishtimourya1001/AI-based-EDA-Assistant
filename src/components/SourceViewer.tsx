import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  FileText,
  FileSpreadsheet,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle,
  ExternalLink,
  Table as TableIcon
} from 'lucide-react';
import { DocumentItem, CitationItem, ViewerTab } from '../types';
import { EvidenceRuler } from './EvidenceRuler';

interface SourceViewerProps {
  activeDoc: DocumentItem;
  citations: CitationItem[];
  activeCitationId: string | null;
  onSelectCitation: (id: string) => void;
  hoveredCitationId: string | null;
  onHoverCitation: (id: string | null) => void;
  onDownloadDoc?: (doc: DocumentItem) => void;
}

export const SourceViewer: React.FC<SourceViewerProps> = ({
  activeDoc,
  citations,
  activeCitationId,
  onSelectCitation,
  hoveredCitationId,
  onHoverCitation,
  onDownloadDoc
}) => {
  const [activeTab, setActiveTab] = useState<ViewerTab>('Source');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(12);
  const totalPages = activeDoc.pagesCount || 24;

  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active citation when selected
  useEffect(() => {
    if (activeCitationId && activeTab === 'Source') {
      const anchorElement = document.getElementById(`anchor-${activeCitationId.toLowerCase()}`);
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeCitationId, activeTab]);

  const handleZoomChange = (delta: number) => {
    setZoomLevel((prev) => Math.min(175, Math.max(60, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <main
      id="source-viewer-center"
      className="flex-1 flex flex-col min-w-0 bg-[#FFFEFA] select-text relative"
      style={{ height: '100vh' }}
      aria-label="Source Document Viewer"
    >
      {/* Viewer Header */}
      <header className="px-4 py-2.5 border-b border-[#E5E4DE] bg-[#F8F8F5] flex items-center justify-between gap-4 shrink-0">
        {/* Document identity & metadata */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded bg-[#EFEFEA] border border-[#D9D8D2] flex items-center justify-center text-[#4B6170] shrink-0">
            {activeDoc.type === 'CSV' || activeDoc.type === 'XLSX' ? (
              <FileSpreadsheet className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-[13.5px] text-[#181B1D] truncate">
                {activeDoc.name}
              </h1>
              <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded bg-[#E8E7E1] text-[#4B6170] font-medium">
                {activeDoc.type}
              </span>
            </div>
            <p className="font-mono text-[10.5px] text-[#72777B] truncate">
              {activeDoc.type === 'PDF' ? `${totalPages} pages` : `${activeDoc.recordsCount?.toLocaleString() || '142,800'} rows`} · Indexed {activeDoc.indexedAt}
            </p>
          </div>
        </div>

        {/* Center Tabs: Source | Preview | Metadata */}
        <nav className="hidden md:flex items-center bg-[#ECEBE5] p-0.5 rounded-md border border-[#D9D8D2]" aria-label="Viewer Mode">
          {(['Source', 'Preview', 'Metadata'] as ViewerTab[]).map((tab) => (
            <button
              key={tab}
              id={`tab-viewer-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[12px] font-medium rounded transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#181B1D] shadow-xs'
                  : 'text-[#72777B] hover:text-[#181B1D]'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Controls: Search, Zoom, Fit, Fullscreen, Download */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Document Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#72777B] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Find in doc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 focus:w-44 text-[11.5px] pl-7 pr-2 py-1 rounded bg-white border border-[#D9D8D2] focus:outline-hidden focus:border-[#4B6170] transition-all font-sans"
            />
          </div>

          <div className="h-4 w-[1px] bg-[#D9D8D2] mx-1" />

          {/* Page navigator */}
          <div className="flex items-center gap-1 font-mono text-[11px] text-[#72777B] bg-white px-2 py-1 rounded border border-[#D9D8D2]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="hover:text-[#181B1D] disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-[#181B1D] font-medium">{currentPage}</span>
            <span>/</span>
            <span>{totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="hover:text-[#181B1D] disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Zoom Out */}
          <button
            id="btn-zoom-out"
            onClick={() => handleZoomChange(-15)}
            className="p-1 rounded text-[#72777B] hover:text-[#181B1D] hover:bg-[#EFEFEA] transition-colors border border-[#D9D8D2] bg-white"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Level */}
          <button
            onClick={handleResetZoom}
            className="font-mono text-[11px] text-[#4B6170] hover:text-[#181B1D] px-1.5 py-1 rounded border border-[#D9D8D2] bg-white transition-colors"
            title="Reset Zoom to 100%"
          >
            {zoomLevel}%
          </button>

          {/* Zoom In */}
          <button
            id="btn-zoom-in"
            onClick={() => handleZoomChange(15)}
            className="p-1 rounded text-[#72777B] hover:text-[#181B1D] hover:bg-[#EFEFEA] transition-colors border border-[#D9D8D2] bg-white"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-[#72777B] hover:text-[#181B1D] hover:bg-[#EFEFEA] transition-colors border border-[#D9D8D2] bg-white hidden sm:flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fit to screen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Download Document */}
          <button
            id="btn-download-source"
            onClick={() => onDownloadDoc?.(activeDoc)}
            className="p-1 rounded text-[#72777B] hover:text-[#181B1D] hover:bg-[#EFEFEA] transition-colors border border-[#D9D8D2] bg-white"
            title="Download original document"
            aria-label="Download Document"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Canvas Container with Evidence Ruler */}
      <div className="flex-1 flex overflow-hidden relative bg-[#F1F0EC]">
        {/* SIGNATURE FEATURE: Evidence Ruler (Attached to the left margin) */}
        {activeTab === 'Source' && (
          <EvidenceRuler
            citations={citations}
            activeCitationId={activeCitationId}
            onSelectCitation={onSelectCitation}
            hoveredCitationId={hoveredCitationId}
            onHoverCitation={onHoverCitation}
            currentDocumentId={activeDoc.id}
          />
        )}

        {/* Scrollable Document Canvas Viewport */}
        <div
          ref={documentContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center"
        >
          {/* TAB 1: SOURCE VIEW */}
          {activeTab === 'Source' && (
            <div
              id="academic-document-paper"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-3xl bg-[#FFFEFA] border border-[#DCDAD2] shadow-sm rounded-xs p-8 md:p-12 text-[#181B1D] min-h-[960px] flex flex-col justify-between"
            >
              {/* Document Header & Journal Meta */}
              <div>
                <div className="border-b border-[#E0DFD7] pb-3 mb-6 flex items-center justify-between font-mono text-[10px] text-[#72777B]">
                  <span className="tracking-wide uppercase">
                    Journal of Multimodal AI & IR · Vol. 14, pp. 241–268
                  </span>
                  <span>DOI: 10.1145/3543873.3587421</span>
                </div>

                {/* Article Title */}
                <h1 className="font-display font-bold text-2xl md:text-[26px] text-[#181B1D] leading-snug tracking-tight mb-2">
                  Deep Cross-Modal Exploration & Latent Density Estimation in Multimodal Retrieval Systems
                </h1>

                {/* Authors & Institutional Affiliations */}
                <div className="mb-6">
                  <p className="text-[13px] font-medium text-[#2D3134]">
                    Dr. Jennifer K. Vance<sup>1</sup>, Dr. Alex Thorne<sup>2</sup>, Shrishti Mourya<sup>1</sup>
                  </p>
                  <p className="text-[11px] text-[#72777B] mt-0.5 font-mono">
                    <sup>1</sup>Stanford Artificial Intelligence Laboratory · <sup>2</sup>DeepMind Cognitive Research
                  </p>
                </div>

                {/* Abstract Card */}
                <div className="p-3.5 rounded bg-[#F8F8F5] border-l-2 border-[#4B6170] mb-8">
                  <h3 className="font-display font-semibold text-[11px] uppercase tracking-wider text-[#4B6170] mb-1">
                    Abstract
                  </h3>
                  <p className="text-[12.5px] leading-relaxed text-[#2D3134] italic font-serif">
                    Modern enterprise retrieval-augmented generation (RAG) pipelines frequently suffer from cross-modal hallucination when blending uncalibrated multi-modal token embeddings with parametric generative decoders. In this work, we present a non-parametric latent density bounding mechanism that measures geometric token drift across multimodal latent manifolds prior to re-ranking.
                  </p>
                </div>

                {/* Section 1: Introduction */}
                <div className="space-y-4 text-[13px] leading-relaxed text-[#2A2E30]">
                  <h2 className="font-display font-bold text-base text-[#181B1D] border-b border-[#EAE9E3] pb-1 pt-2">
                    1. Empirical Context & Baseline Formulations
                  </h2>
                  <p>
                    Vector retrieval across dense multi-modal embedding spaces presents fundamentally distinct topological challenges compared to traditional unigram lexical indexing. Because sparse lexical tokens preserve discrete boolean term frequencies, cosine distance in high-dimensional dense spaces does not uniformly preserve semantic truth conditions.
                  </p>

                  {/* Section 2: Results & Citation C1 Anchor */}
                  <h2 className="font-display font-bold text-base text-[#181B1D] border-b border-[#EAE9E3] pb-1 pt-4">
                    2. Experimental Findings & Hallucination Suppression
                  </h2>
                  <p>
                    We subjected our retrieval pipeline to a benchmark corpus consisting of 2.4 million enterprise multimodal records, comparing standard cosine k-NN search against our density-calibrated architecture.
                  </p>

                  {/* CITATION C1 HIGHLIGHT BLOCK */}
                  <div
                    id="anchor-c1"
                    onClick={() => onSelectCitation('C1')}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      activeCitationId === 'C1'
                        ? 'bg-amber-100/70 border-amber-400/80 shadow-xs'
                        : hoveredCitationId === 'C1'
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded font-bold bg-[#181B1D] text-white">
                        C1
                      </span>
                      <span className="text-[#4B6170] font-medium">Page 12 · Paragraph 3</span>
                      <span className="text-emerald-700 ml-auto">96% Grounded Relevance</span>
                    </div>
                    <p className="font-medium text-[#181B1D]">
                      “Our empirical findings demonstrate a <mark className="bg-amber-200/90 text-[#181B1D] px-0.5 rounded-xs">23.4% reduction in cross-modal retrieval hallucination</mark> when latent density estimation is coupled with vector re-ranking over standard k-NN graph traverses. Furthermore, semantic precision remained invariant under varying prompt perturbations.”
                    </p>
                  </div>

                  {/* CITATION C2: TABLE 1 BENCHMARK */}
                  <div
                    id="anchor-c2"
                    onClick={() => onSelectCitation('C2')}
                    className={`mt-4 p-3 rounded transition-all cursor-pointer border ${
                      activeCitationId === 'C2'
                        ? 'bg-amber-100/70 border-amber-400/80 shadow-xs'
                        : hoveredCitationId === 'C2'
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-[#F9F8F5] border-[#E5E4DE]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded font-bold bg-[#181B1D] text-white">
                          C2
                        </span>
                        <span className="font-display font-semibold text-[#181B1D] text-[12px]">
                          Table 1: Latent Space Alignment & Retrieval Accuracy across 2.4M records
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-700">p &lt; 0.001</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-[#DCDAD2] bg-[#EFEFEA] text-[#4B6170]">
                            <th className="py-1 px-2 font-medium">Configuration</th>
                            <th className="py-1 px-2 font-medium text-right">P50 Latency</th>
                            <th className="py-1 px-2 font-medium text-right">P95 Latency</th>
                            <th className="py-1 px-2 font-medium text-right">Hallucination</th>
                            <th className="py-1 px-2 font-medium text-right">Memory</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EBE9E2]">
                          <tr>
                            <td className="py-1 px-2 font-sans font-medium text-[#181B1D]">Standard k-NN</td>
                            <td className="py-1 px-2 text-right">86ms</td>
                            <td className="py-1 px-2 text-right text-rose-700">182ms</td>
                            <td className="py-1 px-2 text-right">14.8%</td>
                            <td className="py-1 px-2 text-right">4.8 GB</td>
                          </tr>
                          <tr className="bg-emerald-50/50">
                            <td className="py-1 px-2 font-sans font-medium text-[#181B1D]">Density-Calibrated (Ours)</td>
                            <td className="py-1 px-2 text-right">42ms</td>
                            <td className="py-1 px-2 text-right text-emerald-800 font-bold">94ms (-48.3%)</td>
                            <td className="py-1 px-2 text-right text-emerald-800 font-bold">3.2% (-23.4%)</td>
                            <td className="py-1 px-2 text-right">4.1 GB (-14%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-1.5 font-mono text-[10px] text-[#72777B]">
                      Table 1 benchmarks p95 retrieval latency from 182ms down to 94ms (-48.3%) across 2.4M multi-modal embedding pairs with statistical significance (p &lt; 0.001).
                    </p>
                  </div>

                  {/* Section 3: Ablation & Citation C3 Anchor */}
                  <h2 className="font-display font-bold text-base text-[#181B1D] border-b border-[#EAE9E3] pb-1 pt-4">
                    3. Ablation & Statistical Divergence Analysis
                  </h2>
                  <p>
                    To determine whether performance leaps stemmed from hyper-parameter scaling or intrinsic geometric bounds, we evaluated token distributions under zero-shot transfer conditions.
                  </p>

                  {/* CITATION C3 HIGHLIGHT BLOCK */}
                  <div
                    id="anchor-c3"
                    onClick={() => onSelectCitation('C3')}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      activeCitationId === 'C3'
                        ? 'bg-amber-100/70 border-amber-400/80 shadow-xs'
                        : hoveredCitationId === 'C3'
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded font-bold bg-[#181B1D] text-white">
                        C3
                      </span>
                      <span className="text-[#4B6170] font-medium">Page 12 · Paragraph 4</span>
                      <span className="text-emerald-700 ml-auto">91% Grounded Relevance</span>
                    </div>
                    <p className="font-medium text-[#181B1D]">
                      “<mark className="bg-amber-200/90 text-[#181B1D] px-0.5 rounded-xs">Divergence analysis confirms that non-parametric kernel density bounds prevent out-of-distribution hallucinations</mark> without requiring full parameter fine-tuning. This preserves zero-shot generalization across domain-specific medical and financial corpora.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Page Footer & Footnotes */}
              <div className="pt-8 mt-8 border-t border-[#E0DFD7] flex items-center justify-between font-mono text-[10.5px] text-[#72777B]">
                <div>
                  <span>© 2026 ACM Multi-Modal Systems · IEEE Computer Society</span>
                </div>
                <div className="font-medium text-[#181B1D]">
                  Page 12 of 24
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREVIEW MODE (Thumbnail sheets / layout overview) */}
          {activeTab === 'Preview' && (
            <div className="w-full max-w-4xl p-4">
              <div className="mb-4">
                <h3 className="font-display font-semibold text-[14px] text-[#181B1D]">
                  Document Structural Overview
                </h3>
                <p className="text-[12px] text-[#72777B]">
                  24 pages indexed · 48 semantic chunks · 6 verified citations
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const pNum = idx + 9;
                  const isCur = pNum === 12;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentPage(pNum);
                        setActiveTab('Source');
                      }}
                      className={`p-3 rounded-md border cursor-pointer transition-all bg-white flex flex-col justify-between h-48 ${
                        isCur
                          ? 'border-[#4B6170] ring-2 ring-[#4B6170]/20 shadow-md'
                          : 'border-[#D9D8D2] hover:border-[#4B6170]'
                      }`}
                    >
                      <div className="space-y-1 opacity-70">
                        <div className="h-2 w-3/4 bg-slate-300 rounded" />
                        <div className="h-1.5 w-full bg-slate-200 rounded" />
                        <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                        {isCur && (
                          <div className="p-1.5 bg-amber-100 rounded text-[9px] font-mono text-amber-900 mt-2">
                            ★ Active Citations C1, C2, C3
                          </div>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-[#72777B] flex justify-between border-t border-slate-100 pt-1">
                        <span>Page {pNum}</span>
                        {isCur && <span className="text-emerald-600 font-bold">● Active</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: METADATA & VECTOR SCHEMA */}
          {activeTab === 'Metadata' && (
            <div className="w-full max-w-3xl bg-white border border-[#D9D8D2] rounded-md p-6">
              <h3 className="font-display font-semibold text-base text-[#181B1D] mb-1">
                Document Schema & Vector Embedding Manifest
              </h3>
              <p className="text-[12px] text-[#72777B] mb-6">
                Cryptographic signature, coordinate bounding matrices, and latent embedding metadata.
              </p>

              <div className="grid grid-cols-2 gap-4 font-mono text-[11.5px] border-b border-[#E5E4DE] pb-6 mb-6">
                <div>
                  <span className="text-[#72777B] block">FILE ID</span>
                  <span className="text-[#181B1D] font-medium">{activeDoc.id}</span>
                </div>
                <div>
                  <span className="text-[#72777B] block">CHECKSUM (SHA-256)</span>
                  <span className="text-[#181B1D] font-medium truncate block">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </span>
                </div>
                <div>
                  <span className="text-[#72777B] block">EMBEDDING MODEL</span>
                  <span className="text-[#181B1D] font-medium">text-embedding-004 (dim: 1536)</span>
                </div>
                <div>
                  <span className="text-[#72777B] block">TOKEN COUNT</span>
                  <span className="text-[#181B1D] font-medium">18,492 tokens</span>
                </div>
                <div>
                  <span className="text-[#72777B] block">EXTRACTION ENGINE</span>
                  <span className="text-[#181B1D] font-medium">OCR LayoutLMv3 + PDF Plumber</span>
                </div>
                <div>
                  <span className="text-[#72777B] block">GROUNDING STATUS</span>
                  <span className="text-emerald-700 font-medium">● Verified & Indexed</span>
                </div>
              </div>

              <div>
                <h4 className="font-display font-medium text-[13px] text-[#181B1D] mb-2">
                  Mapped Citation Anchors
                </h4>
                <div className="space-y-1.5">
                  {citations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectCitation(c.id);
                        setActiveTab('Source');
                      }}
                      className="p-2 rounded bg-[#F8F8F5] border border-[#E5E4DE] hover:border-[#4B6170] cursor-pointer flex items-center justify-between text-[11.5px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-[#181B1D] text-white">
                          {c.id}
                        </span>
                        <span className="font-medium text-[#181B1D]">{c.location}</span>
                        <span className="font-mono text-[#72777B] text-[10px]">{c.coordinates}</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-medium text-[10.5px]">
                        Relevance: {c.relevanceScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

import { DocumentItem, CitationItem, ChatMessage } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Research_Paper.pdf',
    type: 'PDF',
    size: '4.2 MB',
    sizeBytes: 4404019,
    status: 'Ready',
    pagesCount: 24,
    indexedAt: '2 min ago',
    author: 'Dr. Jennifer K. Vance et al.',
    description: 'Deep Cross-Modal Exploration & Latent Density Estimation in Multimodal Retrieval Systems'
  },
  {
    id: 'doc-2',
    name: 'Sales_Data.csv',
    type: 'CSV',
    size: '18.4 MB',
    sizeBytes: 19293798,
    status: 'Ready',
    recordsCount: 142800,
    indexedAt: '18 min ago',
    author: 'Enterprise Finance Ops',
    description: 'Q1-Q3 Consolidated Regional ARR, Unit Cohorts & Multi-Region Expansion Metrics'
  },
  {
    id: 'doc-3',
    name: 'Market_Analysis.xlsx',
    type: 'XLSX',
    size: '2.8 MB',
    sizeBytes: 2936012,
    status: 'Ready',
    recordsCount: 12400,
    indexedAt: '1 hour ago',
    author: 'Strategic Intelligence Unit',
    description: 'Competitive Retrieval Benchmarks, Inference Latency Distributions & Market Moats'
  },
  {
    id: 'doc-4',
    name: 'Project_Report.pdf',
    type: 'PDF',
    size: '6.1 MB',
    sizeBytes: 6396313,
    status: 'Ready',
    pagesCount: 48,
    indexedAt: '3 hours ago',
    author: 'Architecture Review Board',
    description: 'Phase 2 Cloud-Scale Vector Pipeline Deployment & SOC-2 Audit Verification'
  }
];

export const INITIAL_CITATIONS: CitationItem[] = [
  {
    id: 'C1',
    sourceDocId: 'doc-1',
    sourceName: 'Research_Paper.pdf',
    fileType: 'PDF',
    location: 'Page 12 · Results',
    coordinates: 'x: 142 · y: 386',
    pageNumber: 12,
    paragraphNumber: 3,
    yOffsetPercent: 26,
    relevanceScore: 96,
    previewSnippet: 'Our empirical findings demonstrate a 23.4% reduction in cross-modal retrieval hallucination when latent density estimation is coupled with vector re-ranking...',
    fullText: 'Our empirical findings demonstrate a 23.4% reduction in cross-modal retrieval hallucination when latent density estimation is coupled with vector re-ranking over standard k-NN graph traverses. Furthermore, semantic precision remained invariant under varying prompt perturbations.',
    targetAnchorId: 'cite-c1-anchor',
    verified: true
  },
  {
    id: 'C2',
    sourceDocId: 'doc-1',
    sourceName: 'Research_Paper.pdf',
    fileType: 'PDF',
    location: 'Page 12 · Table 1',
    coordinates: 'x: 168 · y: 612',
    pageNumber: 12,
    paragraphNumber: 4,
    yOffsetPercent: 44,
    relevanceScore: 94,
    previewSnippet: 'Table 1 benchmarks p95 retrieval latency from 182ms down to 94ms (-48.3%) across 2.4M multi-modal embedding pairs with statistical significance (p < 0.001).',
    fullText: 'Benchmark evaluations across 2.4M multimodal embedding pairs show p95 retrieval latency dropped from 182ms to 94ms (-48.3% speedup) while memory footprint contracted by 14.2% due to orthogonal subspace projection.',
    targetAnchorId: 'cite-c2-anchor',
    verified: true
  },
  {
    id: 'C3',
    sourceDocId: 'doc-1',
    sourceName: 'Research_Paper.pdf',
    fileType: 'PDF',
    location: 'Page 12 · Paragraph 4',
    coordinates: 'x: 142 · y: 840',
    pageNumber: 12,
    paragraphNumber: 5,
    yOffsetPercent: 62,
    relevanceScore: 91,
    previewSnippet: 'Divergence analysis confirms that non-parametric kernel density bounds prevent out-of-distribution hallucinations without requiring full parameter fine-tuning.',
    fullText: 'Divergence analysis confirms that non-parametric kernel density bounds prevent out-of-distribution hallucinations without requiring expensive fine-tuning. This preserves zero-shot generalization across domain-specific medical and financial corpora.',
    targetAnchorId: 'cite-c3-anchor',
    verified: true
  },
  {
    id: 'C4',
    sourceDocId: 'doc-2',
    sourceName: 'Sales_Data.csv',
    fileType: 'CSV',
    location: 'Row 84 · Q3 Regional Breakdown',
    coordinates: 'row: 84 · col: 4',
    pageNumber: 1,
    paragraphNumber: 84,
    yOffsetPercent: 74,
    relevanceScore: 89,
    previewSnippet: 'Q3 enterprise ARR expanded by +34% YoY driven by cross-platform document ingestion modules reaching $51.8M total ARR...',
    fullText: 'Q3 enterprise ARR expanded by +34% YoY driven by cross-platform document ingestion modules reaching $51.8M total ARR, exceeding the projected $42.1M baseline established during Q4 FY2025 planning.',
    targetAnchorId: 'cite-c4-anchor',
    verified: true
  },
  {
    id: 'C5',
    sourceDocId: 'doc-3',
    sourceName: 'Market_Analysis.xlsx',
    fileType: 'XLSX',
    location: 'Sheet: Latency Analysis · Cell D14',
    coordinates: 'cell: D14',
    pageNumber: 1,
    paragraphNumber: 14,
    yOffsetPercent: 82,
    relevanceScore: 88,
    previewSnippet: 'Competitor benchmarks indicate median retrieval latency of 220ms, positioning the current architecture 57% faster than commercial SaaS alternatives.',
    fullText: 'Competitor benchmarks indicate median retrieval latency of 220ms across 10 enterprise RAG vendors, positioning the proposed architecture 57% faster than commercial alternatives.',
    targetAnchorId: 'cite-c5-anchor',
    verified: true
  },
  {
    id: 'C6',
    sourceDocId: 'doc-4',
    sourceName: 'Project_Report.pdf',
    fileType: 'PDF',
    location: 'Page 4 · Executive Summary',
    coordinates: 'x: 110 · y: 1240',
    pageNumber: 4,
    paragraphNumber: 2,
    yOffsetPercent: 91,
    relevanceScore: 85,
    previewSnippet: 'Target deployment phase 2 scheduled for completion with multi-region replication and SOC-2 Type II audit trail compliance.',
    fullText: 'Target deployment phase 2 is scheduled for completion with automated multi-region replication and full SOC-2 Type II cryptographic audit trail compliance across all vector storage nodes.',
    targetAnchorId: 'cite-c6-anchor',
    verified: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    timestamp: '10:41 AM',
    content: 'What are the key findings from this report?'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    timestamp: '10:41 AM',
    content: `Based on the indexed document **Research_Paper.pdf** and supporting telemetry datasets, the investigation establishes three primary breakthroughs:

1. **Hallucination Suppression**: Empirical evaluation reveals a **23.4% reduction** in cross-modal retrieval hallucination by bounding token projections with non-parametric kernel density estimators [C1].
2. **Sub-100ms P95 Latency**: Replacing full graph exploration with orthogonal subspace alignment reduced 95th-percentile inference latency from **182ms down to 94ms (-48.3%)** [C2].
3. **Out-of-Distribution Generalization**: Kernel density bounds maintained zero-shot factual consistency on specialized medical and financial corpora without weight fine-tuning [C3].

The empirical operational impact across key business and performance indicators is summarized below:`,
    citationChips: ['C1', 'C2', 'C3'],
    tableData: [
      { metric: 'Revenue (ARR)', previous: '42.1M', current: '51.8M', change: '+23%' },
      { metric: 'Active Users', previous: '18.4K', current: '24.7K', change: '+34%' },
      { metric: 'Latency (p95)', previous: '182ms', current: '94ms', change: '-48.3%' }
    ]
  }
];

export const SUGGESTED_QUESTIONS = [
  'What are the key findings?',
  'Summarize the methodology.',
  'Compare the reported results.',
  'What evidence supports this conclusion?',
  'Find contradictions in the sources.'
];

export const PRESET_RESPONSES: Record<string, { content: string; chips: string[]; table?: { metric: string; previous: string; current: string; change: string }[] }> = {
  'Summarize the methodology.': {
    content: `The authors formulate a hybrid multimodal retrieval architecture structured in three sequential phases:

1. **Subspace Embedding Projection**: Dense multimodal tokens (text + tabular tensors) are mapped into an orthogonal manifold to isolate noise variances [C1].
2. **Non-Parametric Density Estimation**: Instead of rigid distance heuristics, retrieval candidates are gated through local Gaussian kernel density estimators [C3], pruning low-probability hallucinations.
3. **Re-ranking & Verification**: Verified chunks pass through a sub-linear scoring pass achieving statistically significant accuracy improvements (p < 0.001) [C2].`,
    chips: ['C1', 'C2', 'C3']
  },
  'Compare the reported results.': {
    content: `A comparative evaluation against industry benchmarks reveals substantial operational advantages:

- **Retrieval Latency**: Reduced from 182ms baseline to 94ms (-48.3%), outperforming competitor medians of 220ms [C2] [C5].
- **Hallucination Rate**: 23.4% absolute reduction under out-of-distribution test conditions [C1].
- **Commercial Adoption**: Corresponding enterprise ARR increased by +34% YoY to $51.8M as deployment friction diminished [C4].`,
    chips: ['C1', 'C2', 'C4', 'C5'],
    table: [
      { metric: 'Retrieval Speed', previous: '182ms', current: '94ms', change: '-48.3%' },
      { metric: 'Accuracy Score', previous: '78.2%', current: '94.6%', change: '+16.4%' },
      { metric: 'Memory Footprint', previous: '4.8 GB', current: '4.1 GB', change: '-14.2%' }
    ]
  },
  'What evidence supports this conclusion?': {
    content: `The primary conclusion—that density-bounded retrieval maintains zero-shot factual consistency—is supported by three corroborated evidence sources:

1. **Mathematical Divergence Bounds**: Section 4 confirms that kernel density bounds restrict out-of-domain drift [C3].
2. **Empirical Benchmarks (Table 1)**: Statistical validation on 2.4M embedding pairs shows significant accuracy retention (p < 0.001) [C2].
3. **Enterprise Field Telemetry**: Real-world deployment data validates 96% relevance precision under production load [C1] [C4].`,
    chips: ['C1', 'C2', 'C3', 'C4']
  },
  'Find contradictions in the sources.': {
    content: `Cross-source indexing highlighted one notable divergence:

- **Memory vs. Throughput Tradeoff**: While **Research_Paper.pdf** claims a 14.2% net memory reduction in idealized synthetic vectors [C2], **Project_Report.pdf** observes a transient 8.5% RAM spike during high-concurrency re-indexing bursts before garbage collection settles [C6].
- All other accuracy and latency metrics align precisely across the CSV telemetry [C4] and spreadsheet benchmarks [C5].`,
    chips: ['C2', 'C4', 'C5', 'C6']
  }
};

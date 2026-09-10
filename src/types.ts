export type DocumentType = 'PDF' | 'CSV' | 'XLSX' | 'ZIP';

export type DocumentStatus = 'Ready' | 'Uploading' | 'Parsing' | 'Chunking' | 'Indexing';

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  sizeBytes: number;
  status: DocumentStatus;
  pagesCount?: number;
  recordsCount?: number;
  indexedAt: string;
  version?: string;
  description?: string;
  author?: string;
}

export interface CitationItem {
  id: string; // e.g. 'C1', 'C2'
  sourceDocId: string;
  sourceName: string;
  fileType: DocumentType;
  location: string; // e.g. 'Page 12 · Results'
  coordinates: string; // e.g. 'x: 142 · y: 386'
  pageNumber: number;
  paragraphNumber: number;
  yOffsetPercent: number; // For Evidence Ruler vertical pin
  relevanceScore: number; // 0-100
  previewSnippet: string;
  fullText: string;
  targetAnchorId: string;
  verified: boolean;
}

export interface TableRow {
  metric: string;
  previous: string;
  current: string;
  change: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citationChips?: string[];
  tableData?: TableRow[];
  isStreaming?: boolean;
}

export type EvidenceFilter = 'All' | 'PDF' | 'CSV' | 'XLSX';
export type SortOption = 'relevance' | 'page' | 'confidence';
export type ViewerTab = 'Source' | 'Preview' | 'Metadata';
export type NavigationTab = 'Overview' | 'Documents' | 'AI Assistant' | 'Analysis' | 'Collections' | 'Recent Activity';

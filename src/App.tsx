/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_DOCUMENTS,
  INITIAL_CITATIONS,
  INITIAL_CHAT_MESSAGES,
  PRESET_RESPONSES
} from './data/mockData';
import {
  DocumentItem,
  CitationItem,
  ChatMessage,
  NavigationTab
} from './types';
import { NavigationSidebar } from './components/NavigationSidebar';
import { DocumentLibrary } from './components/DocumentLibrary';
import { SourceViewer } from './components/SourceViewer';
import { AIAssistant } from './components/AIAssistant';
import { CitationsPanel } from './components/CitationsPanel';
import { UploadModal } from './components/UploadModal';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Navigation tab state
  const [currentNavTab, setCurrentNavTab] = useState<NavigationTab>('Overview');

  // Documents state
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [activeDocId, setActiveDocId] = useState<string>('doc-1');

  // Citations state
  const [citations, setCitations] = useState<CitationItem[]>(INITIAL_CITATIONS);
  const [activeCitationId, setActiveCitationId] = useState<string | null>('C1');
  const [hoveredCitationId, setHoveredCitationId] = useState<string | null>(null);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<boolean>(false);

  // Upload processing modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<{ name: string; size: string } | null>(null);

  // Panel visibility toggles for responsive workspace management
  const [showNav, setShowNav] = useState<boolean>(true);
  const [showDocs, setShowDocs] = useState<boolean>(true);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [showCitations, setShowCitations] = useState<boolean>(true);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Active document object
  const activeDocument = documents.find((d) => d.id === activeDocId) || documents[0];

  // SIGNATURE INTERACTION: Select Citation & Synchronize All 3 Panels
  const handleSelectCitation = (citationId: string) => {
    setActiveCitationId(citationId);

    const citation = citations.find((c) => c.id === citationId);
    if (citation) {
      // If citation belongs to a different document, switch active doc
      if (citation.sourceDocId !== activeDocId) {
        setActiveDocId(citation.sourceDocId);
      }

      addToast(
        `Synchronized [${citationId}]`,
        `${citation.sourceName} · ${citation.location} (${citation.coordinates})`,
        'info'
      );
    }
  };

  // Handle new uploaded file
  const handleInitiateUpload = (file: File) => {
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    setPendingUploadFile({
      name: file.name,
      size: formattedSize
    });
    setIsUploadModalOpen(true);
  };

  const handleCompleteUpload = () => {
    if (!pendingUploadFile) return;

    const fileExt = pendingUploadFile.name.split('.').pop()?.toUpperCase() || 'PDF';
    const type = (['PDF', 'CSV', 'XLSX', 'ZIP'].includes(fileExt) ? fileExt : 'PDF') as any;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: pendingUploadFile.name,
      type,
      size: pendingUploadFile.size,
      sizeBytes: 4194304,
      status: 'Ready',
      pagesCount: type === 'PDF' ? 18 : undefined,
      recordsCount: type === 'CSV' ? 84000 : undefined,
      indexedAt: 'Just now',
      description: 'User uploaded research dataset'
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setIsUploadModalOpen(false);
    setPendingUploadFile(null);

    addToast('Document Indexed', `${newDoc.name} is ready for grounded RAG inquiry.`, 'success');
  };

  // Handle AI question submission
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGeneratingResponse(true);

    // Check for preset grounded response or simulate generative RAG answer
    setTimeout(() => {
      const preset = PRESET_RESPONSES[text];
      let assistantMsg: ChatMessage;

      if (preset) {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: preset.content,
          citationChips: preset.chips,
          tableData: preset.table
        };
      } else {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `Analysis of query: "${text}" against current indexed corpus (**${activeDocument.name}**):\n\nBased on cross-modal density bounds, the evidence indicates high latent alignment with reported baseline findings [C1]. Vector projection verified consistent convergence across the benchmark dataset without out-of-distribution hallucinations [C3].\n\nCross-verified against enterprise operational telemetry [C4].`,
          citationChips: ['C1', 'C3', 'C4']
        };
      }

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsGeneratingResponse(false);
    }, 1200);
  };

  // Real CSV Export Handler
  const handleExportEvidenceCsv = () => {
    const headers = [
      'Citation ID',
      'Source Document',
      'Location',
      'Coordinates',
      'Page Number',
      'Relevance Score (%)',
      'Evidence Snippet',
      'Verification Status'
    ];

    const rows = citations.map((c) => [
      c.id,
      `"${c.sourceName}"`,
      `"${c.location}"`,
      `"${c.coordinates}"`,
      c.pageNumber,
      c.relevanceScore,
      `"${c.previewSnippet.replace(/"/g, '""')}"`,
      c.verified ? 'Verified' : 'Pending'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evidence_citations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(
      'Evidence Exported to CSV',
      `Exported ${citations.length} verified citations with coordinate mappings.`,
      'success'
    );
  };

  // Real Document Download Handler
  const handleDownloadDoc = (doc: DocumentItem) => {
    const content = `# ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nIndexed: ${doc.indexedAt}\n\nEvidence Summary:\n${citations
      .filter((c) => c.sourceDocId === doc.id)
      .map((c) => `[${c.id}] ${c.location} (${c.coordinates}): ${c.previewSnippet}`)
      .join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${doc.name}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Document Downloaded', `Downloaded source extract for ${doc.name}`, 'info');
  };

  // Open source in viewer from citations card
  const handleOpenSourceFromCitation = (citation: CitationItem) => {
    setActiveDocId(citation.sourceDocId);
    setActiveCitationId(citation.id);
  };

  return (
    <div
      id="eda-workspace-app"
      className="w-full h-screen flex flex-col bg-[#F1F0EC] text-[#181B1D] overflow-hidden select-none font-sans"
    >
      {/* Top Workspace Bar (Status, Quick Panel Toggles, Breadcrumb) */}
      <header
        id="top-workspace-bar"
        className="h-9 px-3 bg-[#0F141D] text-slate-300 border-b border-slate-800 flex items-center justify-between text-[11.5px] shrink-0 z-30 font-mono"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-display font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-xs bg-slate-400" />
            <span>AI-BASED EDA ASSISTANT</span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-mono text-[11px] truncate">
            {activeDocument.name}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            GROUNDED
          </span>
        </div>

        {/* Panel visibility controls for responsive adaptability */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[11px]">
            <span className="text-slate-500 text-[10px] mr-1">PANELS:</span>
            <button
              onClick={() => setShowNav(!showNav)}
              className={`px-1.5 py-0.2 rounded transition-colors ${
                showNav ? 'text-slate-200 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Nav Sidebar"
            >
              Nav
            </button>
            <button
              onClick={() => setShowDocs(!showDocs)}
              className={`px-1.5 py-0.2 rounded transition-colors ${
                showDocs ? 'text-slate-200 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Documents Library"
            >
              Docs
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-1.5 py-0.2 rounded transition-colors ${
                showChat ? 'text-slate-200 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle AI Assistant"
            >
              AI
            </button>
            <button
              onClick={() => setShowCitations(!showCitations)}
              className={`px-1.5 py-0.2 rounded transition-colors ${
                showCitations ? 'text-slate-200 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Citations Panel"
            >
              Evidence
            </button>
          </div>

          <button
            onClick={handleExportEvidenceCsv}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition-colors"
            title="Export Evidence to CSV"
          >
            <FileSpreadsheet className="w-3 h-3 text-slate-400" />
            <span>CSV Export</span>
          </button>
        </div>
      </header>

      {/* Main Workspace 5-Column Body */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden">
        {/* COLUMN 1: DARK NAVIGATION (220px, #131924) */}
        {showNav && (
          <NavigationSidebar
            activeTab={currentNavTab}
            onTabChange={setCurrentNavTab}
            documentCount={documents.length}
          />
        )}

        {/* COLUMN 2: DOCUMENT LIBRARY (260px, #F8F8F5) */}
        {showDocs && (
          <DocumentLibrary
            documents={documents}
            activeDocId={activeDocId}
            onSelectDoc={setActiveDocId}
            onUploadFile={handleInitiateUpload}
            onDeleteDoc={(id) => {
              setDocuments((prev) => prev.filter((d) => d.id !== id));
              addToast('Document Removed', 'Document deleted from active vector index', 'info');
            }}
          />
        )}

        {/* COLUMN 3: SOURCE VIEWER & DOCUMENT CANVAS (FLEXIBLE CENTER, #FFFEFA) */}
        <SourceViewer
          activeDoc={activeDocument}
          citations={citations}
          activeCitationId={activeCitationId}
          onSelectCitation={handleSelectCitation}
          hoveredCitationId={hoveredCitationId}
          onHoverCitation={setHoveredCitationId}
          onDownloadDoc={handleDownloadDoc}
        />

        {/* COLUMN 4: AI ASSISTANT (340px, #F8F8F5) */}
        {showChat && (
          <AIAssistant
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onSelectSuggestedQuestion={handleSendMessage}
            activeCitationId={activeCitationId}
            onSelectCitation={handleSelectCitation}
            isGenerating={isGeneratingResponse}
            activeDocName={activeDocument.name}
          />
        )}

        {/* COLUMN 5: CITATIONS & EVIDENCE (340px, #F8F8F5) */}
        {showCitations && (
          <CitationsPanel
            citations={citations}
            activeCitationId={activeCitationId}
            onSelectCitation={handleSelectCitation}
            hoveredCitationId={hoveredCitationId}
            onHoverCitation={setHoveredCitationId}
            onExportCsv={handleExportEvidenceCsv}
            onOpenSourceInViewer={handleOpenSourceFromCitation}
          />
        )}
      </div>

      {/* Upload Processing Stepper Modal */}
      {pendingUploadFile && (
        <UploadModal
          isOpen={isUploadModalOpen}
          fileName={pendingUploadFile.name}
          fileSize={pendingUploadFile.size}
          onComplete={handleCompleteUpload}
          onCancel={() => {
            setIsUploadModalOpen(false);
            setPendingUploadFile(null);
          }}
        />
      )}

      {/* Enterprise Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

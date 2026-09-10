import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  MoreVertical,
  Plus,
  CheckCircle2,
  Loader2,
  HardDrive,
  Trash2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentLibraryProps {
  documents: DocumentItem[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onUploadFile: (file: File) => void;
  onDeleteDoc?: (id: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  activeDocId,
  onSelectDoc,
  onUploadFile,
  onDeleteDoc
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(e.target.files[0]);
    }
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-3.5 h-3.5 text-slate-700" />;
      case 'CSV':
      case 'XLSX':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" />;
      case 'ZIP':
        return <FileArchive className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <section
      id="document-library-panel"
      className="w-[260px] shrink-0 bg-[#F8F8F5] border-r border-[#E5E4DE] flex flex-col justify-between select-none"
      style={{ height: '100vh' }}
      aria-label="Document Library"
    >
      {/* Header */}
      <div className="flex flex-col">
        <div className="px-3.5 py-3 border-b border-[#E5E4DE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-[14px] text-[#181B1D]">
              Documents
            </h2>
            <span className="font-mono text-[11px] text-[#72777B] px-1.5 py-0.2 rounded bg-[#EFEFEA]">
              {documents.length}
            </span>
          </div>
          <button
            id="btn-quick-upload"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[12px] font-medium text-[#4B6170] hover:text-[#181B1D] px-2 py-1 rounded border border-[#D9D8D2] bg-white hover:bg-[#F3F2EE] transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Upload Zone */}
        <div className="p-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.csv,.xlsx,.xls,.zip"
            onChange={handleFileChange}
          />
          <div
            id="dropzone-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-1.5 ${
              isDragging
                ? 'border-[#4B6170] bg-[#ECEBE5]'
                : 'border-[#D9D8D2] hover:border-[#4B6170] bg-[#FFFEFA]/80 hover:bg-[#FFFEFA]'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-[#EFEFEA] flex items-center justify-center text-[#4B6170]">
              <UploadCloud className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#181B1D] leading-tight">
                Drop files here
              </p>
              <p className="font-mono text-[10px] text-[#72777B] mt-0.5">
                PDF · CSV · XLSX · ZIP
              </p>
            </div>
            <button
              type="button"
              className="mt-0.5 text-[11px] font-medium text-[#4B6170] bg-[#F1F0EC] hover:bg-[#E7E6E0] px-2.5 py-1 rounded border border-[#D9D8D2] transition-colors"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Recent Documents List */}
        <div className="px-3 pt-1 pb-2">
          <div className="flex items-center justify-between pb-1.5">
            <span className="font-display font-medium text-[11px] uppercase tracking-wider text-[#72777B]">
              Recent Documents
            </span>
            <span className="font-mono text-[10px] text-[#72777B]">
              Vectorized
            </span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-340px)] pr-0.5">
            {documents.map((doc) => {
              const isSelected = activeDocId === doc.id;
              const isReady = doc.status === 'Ready';

              return (
                <div
                  key={doc.id}
                  id={`doc-row-${doc.id}`}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`group relative rounded-md p-2 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#D0CFC7] shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-white/70 hover:border-[#E5E4DE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      {/* File-type badge */}
                      <span className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded font-mono text-[9.5px] font-medium bg-[#EFEFEA] text-[#4B6170] border border-[#E0DFD8]">
                        {doc.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12.5px] font-medium truncate leading-tight ${isSelected ? 'text-[#181B1D]' : 'text-[#2D3134]'}`}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 font-mono text-[10.5px] text-[#72777B]">
                          <span>{doc.size}</span>
                          <span>·</span>
                          {/* Processing state - Green ONLY for Ready */}
                          {isReady ? (
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Ready
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-600">
                              <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                              {doc.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* More options button */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-[#EFEFEA] transition-colors"
                        aria-label="Document options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === doc.id && (
                        <div
                          className="absolute right-0 mt-1 w-36 rounded-md bg-white border border-[#D9D8D2] shadow-lg py-1 z-30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              onSelectDoc(doc.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11.5px] text-[#181B1D] hover:bg-[#F1F0EC] flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                            Open Viewer
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11.5px] text-[#181B1D] hover:bg-[#F1F0EC] flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            Re-index Vector
                          </button>
                          {onDeleteDoc && documents.length > 1 && (
                            <button
                              onClick={() => {
                                onDeleteDoc(doc.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-[11.5px] text-rose-700 hover:bg-rose-50 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage System */}
      <div className="p-3 border-t border-[#E5E4DE] bg-[#F4F4F0]/80">
        <div className="flex items-center justify-between text-[11.5px] mb-1.5">
          <span className="font-display font-medium text-[#181B1D] flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-[#4B6170]" />
            Storage
          </span>
          <span className="font-mono text-[11px] text-[#72777B]">
            6.8 GB / 10 GB
          </span>
        </div>
        
        {/* Minimal progress bar */}
        <div className="w-full bg-[#E3E2DC] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#4B6170] h-full rounded-full transition-all duration-500"
            style={{ width: '68%' }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 font-mono text-[10.5px]">
          <span className="text-[#72777B]">Indexed vector quota</span>
          <span className="text-[#181B1D] font-medium">68% used</span>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, FileText, X } from 'lucide-react';
import { DocumentStatus } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  fileName: string;
  fileSize: string;
  onComplete: () => void;
  onCancel: () => void;
}

const STAGES: { stage: DocumentStatus; label: string; desc: string }[] = [
  { stage: 'Uploading', label: 'Uploading', desc: 'Receiving encrypted binary stream & checksum verification' },
  { stage: 'Parsing', label: 'Parsing', desc: 'Extracting DOM tokens, layout bounding boxes, and tabular structures' },
  { stage: 'Chunking', label: 'Chunking', desc: 'Forming semantic windows (512 tokens, 64 token overlap)' },
  { stage: 'Indexing', label: 'Indexing', desc: 'Computing latent dense embeddings & spatial coordinate mapping' },
  { stage: 'Ready', label: 'Ready', desc: 'Document synchronized with active RAG retrieval graph' }
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  fileName,
  fileSize,
  onComplete,
  onCancel
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      return;
    }

    // Step through the processing pipeline realistically
    const timers = [
      setTimeout(() => setCurrentStageIndex(1), 800),  // Parsing
      setTimeout(() => setCurrentStageIndex(2), 1700), // Chunking
      setTimeout(() => setCurrentStageIndex(3), 2700), // Indexing
      setTimeout(() => {
        setCurrentStageIndex(4); // Ready
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 3800)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#131924]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div
        id="document-processing-dialog"
        className="w-full max-w-md bg-[#FFFEFA] rounded-lg border border-[#D9D8D2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[#E5E4DE] bg-[#F8F8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#EFEFEA] flex items-center justify-center text-[#4B6170]">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[13.5px] text-[#181B1D]">
                Processing Document
              </h3>
              <p className="font-mono text-[10.5px] text-[#72777B]">
                {fileName} ({fileSize})
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded text-[#72777B] hover:text-[#181B1D] hover:bg-[#EFEFEA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Pipeline */}
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            {STAGES.map((item, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div
                  key={item.stage}
                  className={`flex items-start gap-3 p-2 rounded transition-colors ${
                    isCurrent
                      ? 'bg-[#F1F0EC] border border-[#D9D8D2]'
                      : 'border border-transparent'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isPast || (isCurrent && item.stage === 'Ready') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#4B6170] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#D0CFC7] bg-[#EFEFEA]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[12.5px] font-medium ${
                          isCurrent
                            ? 'text-[#181B1D]'
                            : isPast
                            ? 'text-emerald-800'
                            : 'text-[#8A8F93]'
                        }`}
                      >
                        {item.label}
                      </span>
                      {isCurrent && item.stage !== 'Ready' && (
                        <span className="font-mono text-[10px] text-[#4B6170] uppercase">
                          In Progress
                        </span>
                      )}
                      {isPast && (
                        <span className="font-mono text-[10px] text-emerald-700">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#72777B] leading-snug mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal log preview */}
          <div className="p-2.5 rounded bg-[#131924] text-slate-300 font-mono text-[10px] space-y-1">
            <div className="text-slate-500 flex justify-between border-b border-slate-800 pb-1">
              <span>PIPELINE TELEMETRY</span>
              <span>PID: 8492</span>
            </div>
            <p className="text-slate-300 truncate">
              {`> [${STAGES[currentStageIndex].stage.toUpperCase()}] running parser across token stream...`}
            </p>
            <p className="text-emerald-400">
              {currentStageIndex >= 3
                ? '✔ 142 chunks mapped to latent manifold (dim: 1536)'
                : '... embedding matrix batching'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Paperclip,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, TableRow } from '../types';
import { SUGGESTED_QUESTIONS } from '../data/mockData';

interface AIAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSelectSuggestedQuestion: (question: string) => void;
  activeCitationId: string | null;
  onSelectCitation: (id: string) => void;
  isGenerating: boolean;
  activeDocName: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  messages,
  onSendMessage,
  onSelectSuggestedQuestion,
  activeCitationId,
  onSelectCitation,
  isGenerating,
  activeDocName
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('All 4 Sources');
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Helper to render message content with interactive [C1], [C2], etc. chips
  const renderMessageContent = (content: string, chips?: string[]) => {
    // Regex for matching citation tokens like [C1], [C2], [C3]
    const parts = content.split(/(\[C\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(C\d+)\]/);
      if (match) {
        const citeId = match[1];
        const isActive = activeCitationId === citeId;
        return (
          <button
            key={index}
            id={`chat-cite-${citeId.toLowerCase()}`}
            onClick={() => onSelectCitation(citeId)}
            className={`inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.2 rounded font-mono text-[10.5px] font-bold transition-all ${
              isActive
                ? 'bg-[#181B1D] text-white ring-1 ring-[#4B6170] scale-105 shadow-xs'
                : 'bg-[#EAE8E1] hover:bg-[#DDD9CE] text-[#181B1D] border border-[#D0CFC7]'
            }`}
            title={`Inspect Grounded Evidence [${citeId}]`}
          >
            {part}
          </button>
        );
      }
      // Standard markdown bold formatting rendering
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${index}-${bIdx}`} className="font-semibold text-[#181B1D]">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${index}-${bIdx}`}>{bPart}</span>;
      });
    });
  };

  return (
    <section
      id="ai-assistant-panel"
      className="w-[340px] shrink-0 bg-[#F8F8F5] border-r border-[#E5E4DE] flex flex-col justify-between select-none"
      style={{ height: '100vh' }}
      aria-label="AI Assistant"
    >
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-[#E5E4DE] flex items-center justify-between shrink-0 bg-white/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#EFEFEA] flex items-center justify-center text-[#181B1D]">
            <Bot className="w-3.5 h-3.5 text-[#4B6170]" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-[13.5px] text-[#181B1D]">
              AI Assistant
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="font-mono text-[10.5px] text-[#72777B]">
                Grounded in 4 sources
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            RAG ACTIVE
          </span>
        </div>
      </div>

      {/* Suggested Analysis Questions */}
      <div className="px-3 py-2.5 border-b border-[#E5E4DE] bg-[#F4F3EE]/90 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5 text-[10.5px] font-display font-semibold uppercase tracking-wider text-[#72777B]">
          <Sparkles className="w-3 h-3 text-[#4B6170]" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex flex-col gap-1">
          {SUGGESTED_QUESTIONS.slice(0, 3).map((question, i) => (
            <button
              key={i}
              onClick={() => onSelectSuggestedQuestion(question)}
              className="text-left px-2 py-1.5 rounded text-[11.5px] text-[#2D3134] bg-white hover:bg-[#ECEBE5] border border-[#DCDAD2] transition-colors leading-tight font-sans truncate shadow-2xs"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-[12.5px] select-text">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 mb-1 font-mono text-[10px] text-[#72777B]">
                <span>{isUser ? 'You' : 'AI Assistant'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`rounded-lg p-3 max-w-[95%] leading-relaxed ${
                  isUser
                    ? 'bg-[#181B1D] text-slate-100 rounded-tr-xs shadow-xs'
                    : 'bg-white text-[#181B1D] border border-[#D9D8D2] rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{renderMessageContent(msg.content, msg.citationChips)}</div>

                {/* Structured Data Table support if message contains tableData */}
                {msg.tableData && msg.tableData.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#E5E4DE] overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#D9D8D2] text-[#72777B] bg-[#F8F8F5]">
                          <th className="py-1 px-1.5 font-medium">Metric</th>
                          <th className="py-1 px-1.5 font-medium text-right">Previous</th>
                          <th className="py-1 px-1.5 font-medium text-right">Current</th>
                          <th className="py-1 px-1.5 font-medium text-right">Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFEFEA]">
                        {msg.tableData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#F9F8F5]">
                            <td className="py-1 px-1.5 font-sans font-medium text-[#181B1D]">
                              {row.metric}
                            </td>
                            <td className="py-1 px-1.5 text-right text-[#72777B]">
                              {row.previous}
                            </td>
                            <td className="py-1 px-1.5 text-right font-semibold text-[#181B1D]">
                              {row.current}
                            </td>
                            <td className={`py-1 px-1.5 text-right font-medium ${
                              row.change.startsWith('+') ? 'text-emerald-700' : 'text-[#4B6170]'
                            }`}>
                              {row.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Copy message button */}
                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1 text-[#72777B] font-mono text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified grounding</span>
                    </div>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="text-[#72777B] hover:text-[#181B1D] p-1 rounded transition-colors flex items-center gap-1 font-mono text-[10px]"
                      title="Copy response"
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Streaming / Loading indicator */}
        {isGenerating && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 mb-1 font-mono text-[10px] text-[#72777B]">
              <span>AI Assistant</span>
              <span>·</span>
              <span>Generating grounded response...</span>
            </div>
            <div className="bg-white border border-[#D9D8D2] rounded-lg rounded-tl-xs p-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4B6170] animate-ping" />
              <span className="font-mono text-[11px] text-[#4B6170]">
                Scanning indexed vectors & verifying coordinates...
              </span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Message Composer (Bottom Sticky) */}
      <div className="p-3 border-t border-[#E5E4DE] bg-white shrink-0">
        {/* Source selector & Grounding indicator */}
        <div className="flex items-center justify-between mb-1.5 text-[10.5px]">
          {/* Source selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
              className="flex items-center gap-1 font-mono text-[10px] text-[#4B6170] hover:text-[#181B1D] bg-[#F1F0EC] px-2 py-0.5 rounded border border-[#D9D8D2] transition-colors"
            >
              <span>Scope: {selectedSourceFilter}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {isSourceDropdownOpen && (
              <div className="absolute bottom-full mb-1 left-0 w-44 bg-white rounded-md border border-[#D9D8D2] shadow-lg py-1 z-30 font-mono text-[11px]">
                {['All 4 Sources', activeDocName, 'Research_Paper.pdf', 'Sales_Data.csv'].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSourceFilter(s);
                      setIsSourceDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1 text-[#181B1D] hover:bg-[#F1F0EC] truncate block"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#72777B] font-mono text-[9.5px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Grounded sources
          </span>
        </div>

        {/* Form input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <input
              id="ai-prompt-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your documents..."
              disabled={isGenerating}
              className="w-full text-[12.5px] pl-3 pr-16 py-2 rounded-md bg-[#F8F8F5] border border-[#D9D8D2] focus:outline-hidden focus:border-[#4B6170] focus:bg-white transition-all text-[#181B1D] placeholder:text-[#8A8F93] font-sans"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="button"
                className="p-1 text-[#72777B] hover:text-[#181B1D] rounded transition-colors"
                title="Attach document snippet"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-send-ai-message"
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="p-1.5 rounded-md bg-[#181B1D] text-white hover:bg-[#2D3134] disabled:opacity-30 transition-all shadow-xs"
                title="Send query"
                aria-label="Send Query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Small Grounding Notice */}
          <p className="text-[10px] text-[#72777B] text-center font-sans">
            AI answers are grounded in indexed sources
          </p>
        </form>
      </div>
    </section>
  );
};

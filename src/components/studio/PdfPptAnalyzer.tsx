import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

interface SlideEntry {
  slideNumber: number;
  title: string;
  summary: string;
  keyPoints: string[];
  takeaway: string;
}

const PRESET_FILES = [
  {
    id: 'raft-consensus',
    name: 'CS440_Lecture7_Raft_Consensus.pptx',
    title: 'Distributed Systems: Raft Consensus & Log Replication',
    slidesCount: 18,
    fileSize: '4.2 MB',
    type: 'PPTX',
    slides: [
      {
        slideNumber: 1,
        title: 'Introduction to Consensus & Fault Tolerance',
        summary: 'Overview of Byzantine vs crash fault-tolerant consensus in distributed clusters.',
        keyPoints: [
          'State Machine Replication requires identical execution sequences across replicas',
          'Leader election guarantees single authoritative timeline during term periods',
          'Split votes resolved via randomized election timeouts (150ms - 300ms)'
        ],
        takeaway: 'Consensus ensures cluster continues functioning even if ⌊(N-1)/2⌋ nodes fail.'
      },
      {
        slideNumber: 2,
        title: 'Log Replication & Safety Invariant',
        summary: 'Log matching property guarantees that if two logs contain an entry with identical index and term, they are identical.',
        keyPoints: [
          'AppendEntries RPC carries preceding log index and term for validation',
          'Entries committed only when safely replicated across majority quorum',
          'Leader never overwrites or truncates its own log entries'
        ],
        takeaway: 'Quorum overlap guarantees latest committed state is preserved across leader transitions.'
      },
      {
        slideNumber: 3,
        title: 'Joint Consensus & Dynamic Cluster Membership',
        summary: 'Changing cluster configuration safely without service interruption.',
        keyPoints: [
          'Two-phase configuration transition uses joint configuration C_old,new',
          'Decisions require independent majorities from both old and new configurations',
          'Prevents split-brain state where disjoint majorities elect conflicting leaders'
        ],
        takeaway: 'Cluster reconfiguration requires overlapping two-phase consensus commits.'
      }
    ]
  },
  {
    id: 'transformers-attention',
    name: 'CS580_Attention_Is_All_You_Need.pdf',
    title: 'Deep Learning: Multi-Head Attention & Transformer Encoders',
    slidesCount: 24,
    fileSize: '6.8 MB',
    type: 'PDF',
    slides: [
      {
        slideNumber: 1,
        title: 'Scaled Dot-Product Attention Mechanism',
        summary: 'Mathematical formulation of query, key, and value tensor projections.',
        keyPoints: [
          'Attention(Q, K, V) = softmax(QK^T / √d_k) * V',
          'Scaling factor √d_k prevents dot product magnitudes from pushing softmax into vanishing gradients',
          'Permits parallelized matrix computation without sequential recurrence'
        ],
        takeaway: 'Replaces recurrent RNN sequences with $O(1)$ sequential operations.'
      },
      {
        slideNumber: 2,
        title: 'Multi-Head Projections & Subspace Representations',
        summary: 'Projecting queries, keys, and values h times with different learnable linear projections.',
        keyPoints: [
          'Enables model to jointly attend to information from different representation subspaces',
          'Positional encoding (sinusoidal frequencies) injects sequence order awareness',
          'Residual connections and Layer Normalization stabilize gradient backpropagation'
        ],
        takeaway: 'Multi-head projections allow attending across distinct semantic subspaces.'
      }
    ]
  }
];

export const PdfPptAnalyzer: React.FC = () => {
  const { addCardsToDeck, setActiveChannel, showToast, addXp } = useCampus();
  const [selectedFile, setSelectedFile] = useState(PRESET_FILES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'slides' | 'summary' | 'flashcards'>('slides');

  const handleSelectPreset = (file: typeof PRESET_FILES[0]) => {
    sound.playClick();
    setSelectedFile(file);
    setCustomFileName(null);
    showToast(`📂 Loaded lecture slides: ${file.name}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.playClick();
    setIsAnalyzing(true);
    setCustomFileName(file.name);

    setTimeout(() => {
      setIsAnalyzing(false);
      sound.playLevelUp();
      addXp(50, 'Analyzed lecture slides');
      showToast(`✨ Analyzed ${file.name}! Generated structured slide digest. +50 XP`);
    }, 1200);
  };

  const handleExportToFlashcards = () => {
    sound.playCoin();
    const newCards = selectedFile.slides.map((s) => ({
      question: `Slide ${s.slideNumber}: ${s.title}`,
      answer: `${s.summary}\n\nKey Takeaway: ${s.takeaway}`,
      hint: s.keyPoints[0],
      mastery: 0,
    }));

    addCardsToDeck('deck-cs-arch', newCards);
    setActiveChannel('flashcards-3d');
    showToast(`🃏 Exported ${newCards.length} flashcards to Active-Recall Arena!`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-4 p-4 max-w-6xl mx-auto select-text font-sans">
      {/* 1. Studio Header */}
      <div className="bg-gradient-to-r from-twilight-800 via-plum-900 to-twilight-900 p-5 rounded-2xl border border-white/10 shadow-cozy-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📑</span>
            <h2 className="font-editorial text-2xl font-semibold text-white tracking-wide">
              PDF & Presentation Analyzer
            </h2>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-sans leading-relaxed">
            Upload lecture slides (`.pdf`, `.pptx`, `.md`) to extract slide-by-slide concepts, executive summaries, and generate active-recall flashcard decks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="cursor-pointer px-4 py-2 bg-amberGold-400 hover:bg-amberGold-500 active:scale-95 text-twilight-950 font-bold text-xs rounded-xl shadow-soft-glow transition-all flex items-center space-x-2">
            <span>📤 Upload Slides</span>
            <input type="file" accept=".pdf,.pptx,.ppt,.txt,.md" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* 2. Sample Presentation Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400">Sample Lectures:</span>
        {PRESET_FILES.map((f) => (
          <button
            key={f.id}
            onClick={() => handleSelectPreset(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
              selectedFile.id === f.id && !customFileName
                ? 'bg-white/15 text-amberGold-300 border border-amberGold-400/40 shadow-sm'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            <span>{f.type === 'PPTX' ? '📊' : '📕'}</span>
            <span className="truncate max-w-[200px]">{f.name}</span>
          </button>
        ))}
      </div>

      {/* 3. File Card Overview */}
      <div className="bg-twilight-850/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate">
          <div className="w-12 h-12 rounded-xl bg-amberGold-400/10 border border-amberGold-400/30 flex items-center justify-center text-xl text-amberGold-400">
            {selectedFile.type === 'PPTX' ? '📊' : '📕'}
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-sm text-white truncate">
              {customFileName || selectedFile.title}
            </h3>
            <span className="text-xs text-gray-400">
              {customFileName ? 'Custom Uploaded Lecture' : `${selectedFile.slidesCount} Slides • ${selectedFile.fileSize} • Generated with AI Schema Extraction`}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleExportToFlashcards}
            className="px-3.5 py-1.5 bg-amberGold-400/20 hover:bg-amberGold-400/30 text-amberGold-300 border border-amberGold-400/40 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>🃏 Convert to Flashcards</span>
          </button>
        </div>
      </div>

      {/* 4. Tabs: Slide Breakdown vs Executive Summary */}
      <div className="flex space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('slides')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'slides' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          📑 Slide-by-Slide Breakdown ({selectedFile.slides.length})
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'summary' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          ✨ Executive Summary & Key Insights
        </button>
      </div>

      {/* 5. Content View */}
      {isAnalyzing ? (
        <div className="bg-twilight-850/60 p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amberGold-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-editorial text-lg text-amberGold-300">Extracting slide structure & key concepts...</p>
        </div>
      ) : activeTab === 'slides' ? (
        <div className="space-y-3">
          {selectedFile.slides.map((slide) => (
            <div
              key={slide.slideNumber}
              className="bg-twilight-850/80 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-amberGold-400/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-amberGold-400 uppercase tracking-wider">
                  Slide {slide.slideNumber}
                </span>
                <span className="text-xs text-gray-400 font-mono font-medium">Concept Breakdown</span>
              </div>

              <h4 className="font-editorial text-base font-semibold text-white">
                {slide.title}
              </h4>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {slide.summary}
              </p>

              <div className="bg-twilight-900/60 p-3 rounded-lg border border-white/5 space-y-1.5 text-xs text-gray-300">
                <span className="font-semibold text-gray-400 text-[11px] block uppercase">
                  Bullet Explanations:
                </span>
                {slide.keyPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-amberGold-400 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amberGold-400/10 p-2.5 rounded-lg border border-amberGold-400/20 text-xs text-amberGold-200">
                <span className="font-bold mr-1">💡 Key Takeaway:</span>
                <span>{slide.takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-twilight-850/80 p-5 rounded-xl border border-white/10 space-y-4 text-xs text-gray-300">
          <h3 className="font-editorial text-xl font-semibold text-white">
            Comprehensive Lecture Digest: {selectedFile.title}
          </h3>
          <p className="leading-relaxed text-sm">
            This lecture module establishes foundational guarantees for state machines operating over unreliable networks. Through quorum overlap and randomized timeouts, participants achieve uniform consensus without deadlock.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-white block text-sm mb-1">Architectural Trade-offs</span>
              <p className="text-gray-400">
                Leader-based architectures concentrate coordination overhead onto a single elected node, optimizing read/write throughput during stable network intervals at the expense of brief failover election delays.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-white block text-sm mb-1">Active Recall Strategy</span>
              <p className="text-gray-400">
                Mastering distributed consensus requires testing edge-case partition scenarios: network splits, term transitions, and uncommitted log trunctations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPptAnalyzer;

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { generateSmartSummary } from '../../services/mockAiService';
import { sound } from '../../services/soundEffects';
import { IrlenTint } from '../../types';

// Pre-loaded sample lecture notes
const SAMPLE_NOTES = {
  os: `Operating Systems Lecture 4: Virtual Memory & Concurrency

Virtual memory creates an illusion of a very large, uniform memory space by mapping virtual addresses to physical RAM pages or secondary storage page files. The Memory Management Unit (MMU) uses page tables and Translation Lookaside Buffers (TLB) to accelerate lookup times.

When a thread references a virtual page not currently resident in physical memory, the CPU hardware raises a page fault trap, prompting the operating system kernel to swap the required page from disk into a free page frame.

Concurrency requires synchronization primitives: Mutexes provide mutual exclusion for critical sections, while Counting Semaphores manage finite pools of shared resources. Mismanagement can lead to deadlocks characterized by four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.`,

  neuro: `Cognitive Psychology: Long-Term Memory Consolidation & Neuroplasticity

Human memory consolidation transforms transient working memory representations in the hippocampus into resilient neocortical schemas. During sleep (specifically slow-wave and REM stages), sharp-wave ripples replay recent synaptic activations, stabilizing synaptic strength through Long-Term Potentiation (LTP).

The Ebbinghaus Forgetting Curve demonstrates that without active recall interventions, over 70% of newly learned conceptual relationships decay within 24 to 48 hours. By introducing spaced repetition intervals, the decay curve flattens significantly.

Furthermore, Bionic reading aids visual fixation points, guiding the eyes (ocular saccades) to jump smoothly across text lines, which drastically reduces cognitive load for readers with ADHD or dyslexia.`,

  ml: `Machine Learning Foundations: Gradient Descent & Backpropagation

Neural networks learn complex feature representations through backpropagation, an algorithmic application of the calculus chain rule. For every training iteration, input tensors propagate forward through linear layers with non-linear activation functions (ReLU, GELU, Sigmoid).

The loss function computes the scalar divergence between model predictions and ground-truth targets. The gradient of the loss with respect to weight matrices is calculated backwards from the output layer to early feature extractors.

Stochastic Gradient Descent (SGD) with momentum and adaptive optimizers like Adam adjust learning rates per parameter, navigating non-convex error surfaces and avoiding saddle points.`,
};

export const ReaderWindow: React.FC = () => {
  const { sensory, updateSensory, addCardsToDeck, openWindow, showToast, addXp } = useCampus();
  const [inputText, setInputText] = useState(SAMPLE_NOTES.os);
  const [activeTab, setActiveTab] = useState<'reader' | 'summary'>('reader');
  const [summaryData, setSummaryData] = useState<ReturnType<typeof generateSmartSummary> | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Focus ruler position state within reader
  const [rulerTop, setRulerTop] = useState(120);

  // Bionic reading word transformation
  const renderBionicText = (text: string) => {
    return text.split('\n').map((paragraph, pIdx) => (
      <p key={pIdx} className="mb-4 leading-relaxed">
        {paragraph.split(' ').map((word, wIdx) => {
          if (!sensory.bionicReading || word.length <= 1) {
            return word + ' ';
          }
          const boldLength = Math.ceil(word.length * 0.45);
          const boldPart = word.slice(0, boldLength);
          const restPart = word.slice(boldLength);
          return (
            <span key={wIdx}>
              <strong className="font-extrabold text-black">{boldPart}</strong>
              <span>{restPart} </span>
            </span>
          );
        })}
      </p>
    ));
  };

  const handleSummarize = () => {
    sound.playClick();
    setIsSummarizing(true);
    setTimeout(() => {
      const result = generateSmartSummary(inputText);
      setSummaryData(result);
      setActiveTab('summary');
      setIsSummarizing(false);
      sound.playLevelUp();
      addXp(45, 'Summarized study notes');
      showToast('📖 Notes successfully structured & summarized! +45 XP');
    }, 600);
  };

  const handleExportCards = () => {
    if (!summaryData) return;
    sound.playCoin();
    addCardsToDeck('deck-learning', summaryData.suggestedCards);
    openWindow('flashcards');
    showToast(`🃏 Exported ${summaryData.suggestedCards.length} flashcards to Active-Recall Arena!`);
  };

  // Text to speech
  const handleToggleTts = () => {
    if (!('speechSynthesis' in window)) {
      showToast('⚠️ Speech Synthesis not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      setIsSpeaking(false);
    } else {
      try {
        const textToRead = activeTab === 'summary' && summaryData
          ? summaryData.summaryBullets.join('. ')
          : inputText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        showToast('🔊 Audio reader playing...');
      } catch (e) {
        showToast('⚠️ Speech synthesis unavailable in this environment.');
      }
    }
  };

  // Irlen tint background style
  const getTintStyle = (tint: IrlenTint): string => {
    switch (tint) {
      case 'peach':
        return 'bg-[#ffeedd] text-[#2b1810]';
      case 'amber':
        return 'bg-[#fef3c7] text-[#332205]';
      case 'mint':
        return 'bg-[#e6f4ea] text-[#0d3319]';
      case 'lavender':
        return 'bg-[#f3e8ff] text-[#2e1065]';
      case 'blue':
        return 'bg-[#e0f2fe] text-[#082f49]';
      case 'none':
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-hidden space-y-2">
      {/* 1. Neurodivergent Accessibility Toolbar */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Bionic & Dyslexia Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sound.playClick();
              updateSensory({ bionicReading: !sensory.bionicReading });
            }}
            className={`px-2 py-1 retro-btn font-pixel font-bold text-xs ${
              sensory.bionicReading ? 'pressed bg-amber-200 text-amber-950' : 'text-gray-800'
            }`}
            title="Bolds initial word letters to guide eye fixation saccades"
          >
            👓 Bionic Reading: {sensory.bionicReading ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              updateSensory({ dyslexicFont: !sensory.dyslexicFont });
            }}
            className={`px-2 py-1 retro-btn font-pixel font-bold text-xs ${
              sensory.dyslexicFont ? 'pressed bg-emerald-200 text-emerald-950' : 'text-gray-800'
            }`}
            title="Toggles high-legibility dyslexic sans font"
          >
            🔤 Dyslexia Font: {sensory.dyslexicFont ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              updateSensory({ focusRuler: !sensory.focusRuler });
            }}
            className={`px-2 py-1 retro-btn font-pixel font-bold text-xs ${
              sensory.focusRuler ? 'pressed bg-indigo-200 text-indigo-950' : 'text-gray-800'
            }`}
            title="Horizontal reading highlight band to block surrounding visual distractions"
          >
            📏 Focus Ruler: {sensory.focusRuler ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Irlen Sensory Tint Select */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-pixel text-gray-700 font-bold">🎨 Irlen Tint:</span>
          {(['none', 'peach', 'amber', 'mint', 'lavender', 'blue'] as IrlenTint[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playClick();
                updateSensory({ irlenTint: t });
              }}
              className={`w-5 h-5 rounded border border-black ${
                sensory.irlenTint === t ? 'ring-2 ring-blue-600' : ''
              } ${
                t === 'peach'
                  ? 'bg-[#ffeedd]'
                  : t === 'amber'
                  ? 'bg-[#fef3c7]'
                  : t === 'mint'
                  ? 'bg-[#e6f4ea]'
                  : t === 'lavender'
                  ? 'bg-[#f3e8ff]'
                  : t === 'blue'
                  ? 'bg-[#e0f2fe]'
                  : 'bg-white'
              }`}
              title={`Irlen Tint: ${t}`}
            />
          ))}
        </div>

        {/* TTS Reader Button */}
        <button
          onClick={handleToggleTts}
          className={`px-2 py-1 retro-btn font-pixel font-bold text-xs ${
            isSpeaking ? 'bg-red-200 text-red-900 animate-pulse' : 'text-gray-800'
          }`}
          title="Read text aloud using Text-to-Speech"
        >
          {isSpeaking ? '⏹ Stop Voice' : '🔊 Listen (TTS)'}
        </button>
      </div>

      {/* 2. Document Tab Bar & Sample Selector */}
      <div className="flex items-center justify-between border-b border-gray-400 pb-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3 py-1 font-pixel text-xs font-bold retro-btn ${
              activeTab === 'reader' ? 'pressed bg-white' : 'bg-[#dfdfdf]'
            }`}
          >
            📄 Original Document
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1 font-pixel text-xs font-bold retro-btn ${
              activeTab === 'summary' ? 'pressed bg-white' : 'bg-[#dfdfdf]'
            }`}
          >
            ✨ Structured Digest {summaryData && '(Ready)'}
          </button>
        </div>

        {/* Preset Sample Picker */}
        <div className="flex items-center space-x-1 text-xs font-pixel">
          <span className="text-gray-600">Preset:</span>
          <button
            onClick={() => setInputText(SAMPLE_NOTES.os)}
            className="px-1.5 py-0.5 retro-btn text-[10px]"
          >
            OS Kernels
          </button>
          <button
            onClick={() => setInputText(SAMPLE_NOTES.neuro)}
            className="px-1.5 py-0.5 retro-btn text-[10px]"
          >
            Cognitive Sci
          </button>
          <button
            onClick={() => setInputText(SAMPLE_NOTES.ml)}
            className="px-1.5 py-0.5 retro-btn text-[10px]"
          >
            Machine Learning
          </button>
        </div>
      </div>

      {/* 3. Document Reading / Summary View with Irlen Tint & Focus Ruler */}
      <div
        className={`flex-1 overflow-y-auto p-4 rounded retro-inset relative border border-gray-400 select-text transition-colors duration-200 ${getTintStyle(
          sensory.irlenTint
        )} ${sensory.dyslexicFont ? 'font-dyslexic tracking-wide leading-loose' : 'font-sans'}`}
        onMouseMove={(e) => {
          if (sensory.focusRuler) {
            const rect = e.currentTarget.getBoundingClientRect();
            setRulerTop(e.clientY - rect.top);
          }
        }}
      >
        {/* Focus Ruler Band */}
        {sensory.focusRuler && (
          <div
            className="absolute left-0 right-0 pointer-events-none border-y-2 border-amber-500 bg-amber-300/20 transition-all duration-75 shadow-xs"
            style={{
              top: `${Math.max(0, rulerTop - 24)}px`,
              height: '48px',
            }}
          />
        )}

        {/* Reader View */}
        {activeTab === 'reader' ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-pixel text-gray-500 border-b border-gray-300 pb-1">
              <span>Edit or paste your lecture notes below:</span>
              <span>{inputText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            {/* If Bionic Reading is ON, render as styled preview, else textarea */}
            {sensory.bionicReading ? (
              <div className="text-sm">{renderBionicText(inputText)}</div>
            ) : (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-full min-h-[220px] bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
                placeholder="Paste lecture notes or textbook chapters here..."
              />
            )}
          </div>
        ) : (
          /* Summary View */
          <div>
            {summaryData ? (
              <div className="space-y-4">
                <div className="border-b border-gray-300 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-base text-blue-900">{summaryData.title}</h3>
                  <button
                    onClick={handleExportCards}
                    className="px-3 py-1 retro-btn bg-amber-200 text-amber-950 font-pixel font-bold text-xs hover:bg-amber-300"
                  >
                    🃏 Convert to Flashcards Deck →
                  </button>
                </div>

                {/* Key Summary Bullets */}
                <div>
                  <h4 className="font-pixel text-xs font-bold text-gray-700 uppercase mb-1.5">
                    📌 Core Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {summaryData.summaryBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-700 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vocabulary / Terms Glossary */}
                <div>
                  <h4 className="font-pixel text-xs font-bold text-gray-700 uppercase mb-1.5">
                    📖 Key Terminology Glossary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {summaryData.keyTerms.map((item, idx) => (
                      <div key={idx} className="bg-white/80 p-2 rounded retro-inset border border-gray-300 text-xs">
                        <span className="font-bold text-blue-950 block">{item.term}</span>
                        <span className="text-gray-700 text-[11px] leading-snug">{item.def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-pixel">
                <span>No summary generated yet.</span>
                <span className="text-xs text-gray-400 mt-1">
                  Click "Summarize & Structure" below to digest the document!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-gray-600 font-pixel">
          Supports .txt, .md text notes & AI schema extraction
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !inputText.trim()}
            className="px-4 py-1.5 retro-btn font-pixel font-bold text-xs text-blue-950 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <span>{isSummarizing ? '⌛ Processing...' : '✨ Summarize & Structure (+45 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

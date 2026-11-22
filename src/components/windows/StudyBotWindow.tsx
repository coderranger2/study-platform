import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { askStudyBot, AiResponse } from '../../services/mockAiService';
import { sound } from '../../services/soundEffects';

interface MessageEntry {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  response?: AiResponse;
}

export const StudyBotWindow: React.FC = () => {
  const { addCardsToDeck, openWindow, showToast, addXp } = useCampus();
  const [messages, setMessages] = useState<MessageEntry[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      content:
        '👋 Hey there! I am **StudyBot v2.4 (MSN Edition)**, your 24/7 campus learning companion.\n\nAsk me anything or click a prompt chip below to get started!',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const promptChips = [
    { label: '💡 Explain simply (ELI5)', mode: 'explain' as const, query: 'Explain how CPU Cache vs RAM works with a simple everyday analogy' },
    { label: '🐞 Debug my code', mode: 'debug' as const, query: 'Help me debug an async race condition in TypeScript' },
    { label: '🧠 Quiz me on this', mode: 'quiz' as const, query: 'Quiz me on Operating Systems processes, memory, and concurrency' },
    { label: '📝 Study outline', mode: 'outline' as const, query: 'Give me a structured study plan for Cognitive Science and Memory' },
  ];

  const handleSend = async (queryText = inputText, mode?: 'explain' | 'debug' | 'quiz' | 'outline') => {
    if (!queryText.trim() || isLoading) return;
    sound.playClick();

    const userMsg: MessageEntry = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askStudyBot(queryText, mode);
      sound.playWindowOpen();

      const botMsg: MessageEntry = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        content: response.markdown,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        response,
      };

      setMessages((prev) => [...prev, botMsg]);
      addXp(20, 'Consulted StudyBot');
    } catch (err) {
      sound.playError();
      showToast('⚠️ Could not connect to StudyBot engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFlashcards = (resp: AiResponse) => {
    if (!resp.suggestedCards || resp.suggestedCards.length === 0) return;
    sound.playCoin();
    addCardsToDeck('deck-cs-arch', resp.suggestedCards);
    openWindow('flashcards');
    showToast(`🃏 Added ${resp.suggestedCards.length} flashcards to Active-Recall Arena!`);
  };

  return (
    <div className="flex h-full select-none overflow-hidden font-sans">
      {/* 1. Left Retro MSN / AIM Buddy List */}
      <div className="w-40 bg-[#dfdfdf] border-r border-black retro-inset flex flex-col p-1.5 mr-2 hidden sm:flex">
        <div className="font-pixel text-xs font-bold text-blue-900 border-b border-gray-400 pb-1 mb-1.5 flex items-center space-x-1">
          <span>💬</span>
          <span>Buddies (3 Online)</span>
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto text-xs">
          <div className="bg-blue-100 p-1.5 rounded retro-inset border border-blue-300">
            <div className="flex items-center space-x-1">
              <span className="text-sm">🤖</span>
              <span className="font-bold text-blue-950 truncate">StudyBot</span>
            </div>
            <span className="text-[10px] text-emerald-700 block font-pixel">● Online (AI)</span>
          </div>

          <div className="p-1 rounded hover:bg-gray-200">
            <div className="flex items-center space-x-1">
              <span className="text-sm">📎</span>
              <span className="font-bold text-gray-800 truncate">Clippy 98</span>
            </div>
            <span className="text-[9px] text-gray-500 block">Idle in Library</span>
          </div>

          <div className="p-1 rounded hover:bg-gray-200">
            <div className="flex items-center space-x-1">
              <span className="text-sm">🐱</span>
              <span className="font-bold text-gray-800 truncate">Tamagotchi</span>
            </div>
            <span className="text-[9px] text-gray-500 block">Napping on taskbar</span>
          </div>
        </div>

        <div className="border-t border-gray-400 pt-1 text-[10px] text-gray-600 font-pixel">
          MSN Messenger 4.7
        </div>
      </div>

      {/* 2. Main Chat Conversation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Log */}
        <div className="flex-1 bg-white rounded retro-inset border border-gray-400 p-3 overflow-y-auto space-y-3 select-text text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-2.5 rounded max-w-[90%] leading-relaxed ${
                m.sender === 'user'
                  ? 'ml-auto bg-amber-50 border border-amber-200 text-gray-900'
                  : 'mr-auto bg-blue-50 border border-blue-200 text-gray-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[11px] font-bold border-b border-gray-200 pb-0.5">
                <span className="flex items-center space-x-1">
                  <span>{m.sender === 'user' ? '🎓 You' : '🤖 StudyBot AI'}</span>
                  {m.sender === 'bot' && (
                    <span className="bg-blue-600 text-white text-[9px] px-1 rounded font-pixel">
                      Tutor
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-gray-400 font-mono font-normal">
                  {m.timestamp}
                </span>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans text-xs space-y-1">
                {m.content}
              </div>

              {/* Action Buttons if response has cards */}
              {m.response?.suggestedCards && m.response.suggestedCards.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-blue-200 flex items-center justify-between">
                  <span className="text-[11px] text-blue-900 font-pixel font-bold">
                    💡 {m.response.suggestedCards.length} Flashcards generated!
                  </span>
                  <button
                    onClick={() => m.response && handleExportFlashcards(m.response)}
                    className="px-2 py-1 retro-btn text-[11px] font-pixel font-bold text-blue-950 bg-amber-200 hover:bg-amber-300"
                  >
                    Export to Flashcards.exe →
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto bg-blue-50 border border-blue-200 p-2 rounded text-xs text-blue-800 flex items-center space-x-2">
              <span className="animate-spin">⌛</span>
              <span className="font-pixel">StudyBot is generating structured answer...</span>
            </div>
          )}
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 py-1.5">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.query, chip.mode)}
              disabled={isLoading}
              className="text-[11px] px-2 py-0.5 retro-btn font-pixel text-blue-900 hover:bg-blue-100 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex space-x-1.5 pt-1"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about formulas, debugging, concept analogies..."
            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-gray-400 retro-inset focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-1.5 retro-btn text-xs font-pixel font-bold text-black disabled:opacity-50 hover:bg-gray-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

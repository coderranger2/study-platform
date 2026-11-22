import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

export const FlashcardsWindow: React.FC = () => {
  const { decks, addXp, addCoins, updateCardMastery, updateQuestProgress, showToast } = useCampus();
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || 'deck-cs-arch');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionStreak, setSessionStreak] = useState<number>(0);

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const cards = currentDeck?.cards || [];
  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    sound.playCardFlip();
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Completed deck!
      sound.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast('🎉 Deck completed! Awesome memory retrieval mastery!');
      setCurrentCardIndex(0);
    }
  };

  const handleGotIt = () => {
    sound.playCoin();
    addXp(10, 'Flashcard recalled');
    addCoins(2, 'Active recall reward');
    updateQuestProgress('q2', 1);
    setSessionStreak((s) => s + 1);
    if (currentCard) {
      updateCardMastery(currentDeck.id, currentCard.id, 2);
    }
    handleNext();
  };

  const handleReviewAgain = () => {
    sound.playClick();
    setSessionStreak(0);
    if (currentCard) {
      updateCardMastery(currentDeck.id, currentCard.id, 1);
    }
    handleNext();
  };

  // Mastery percentage
  const masteredCount = cards.filter((c) => c.mastery === 2).length;
  const masteryPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-hidden space-y-2">
      {/* 1. Header Bar: Deck Selector & Mastery Bar */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-pixel font-bold text-gray-800">Deck:</span>
          <select
            value={selectedDeckId}
            onChange={(e) => {
              sound.playClick();
              setSelectedDeckId(e.target.value);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="px-2 py-0.5 retro-inset bg-white border border-gray-400 font-pixel text-xs focus:outline-none"
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.cards.length} cards)
              </option>
            ))}
          </select>
        </div>

        {/* Streak & Mastery */}
        <div className="flex items-center space-x-3">
          <span className="font-pixel text-amber-700 font-bold">
            🔥 Streak: {sessionStreak}
          </span>
          <div className="flex items-center space-x-1 font-pixel text-[11px]">
            <span>Mastery:</span>
            <div className="w-16 h-3 bg-gray-300 retro-inset overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
            <span>{masteryPercent}%</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 3D Flip Card Arena */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 perspective-1000 min-h-[240px]">
        {currentCard ? (
          <div
            onClick={handleFlip}
            className={`w-full max-w-md h-64 cursor-pointer relative transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-amber-50 rounded-lg p-6 retro-outset border-2 border-gray-400 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between text-xs font-pixel text-gray-500 border-b border-gray-200 pb-1.5">
                <span className="uppercase text-blue-900 font-bold">{currentDeck.category}</span>
                <span>
                  Card {currentCardIndex + 1} of {cards.length}
                </span>
              </div>

              <div className="text-center py-4">
                <span className="text-xs text-amber-700 font-pixel uppercase font-bold block mb-1">
                  Active Recall Prompt
                </span>
                <p className="text-base font-bold text-gray-900 leading-snug">
                  {currentCard.question}
                </p>
                {currentCard.hint && (
                  <p className="text-xs text-gray-500 italic mt-2">
                    💡 Hint: {currentCard.hint}
                  </p>
                )}
              </div>

              <div className="text-center text-[11px] text-gray-400 font-pixel">
                [ Click anywhere to reveal answer ↺ ]
              </div>
            </div>

            {/* Back of Card (Rotated 180deg) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 retro-outset border-2 border-blue-400 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between text-xs font-pixel text-blue-900 border-b border-blue-200 pb-1.5">
                <span className="font-bold">ANSWER EXPLANATION</span>
                <span>
                  Card {currentCardIndex + 1} of {cards.length}
                </span>
              </div>

              <div className="py-2 overflow-y-auto">
                <p className="text-sm text-gray-900 leading-relaxed font-medium">
                  {currentCard.answer}
                </p>
              </div>

              <div className="text-center text-[11px] text-blue-600 font-pixel">
                [ Click to flip back ]
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 font-pixel">
            <span>No cards in this deck yet.</span>
          </div>
        )}
      </div>

      {/* 3. Bottom Active Recall Action Buttons */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex items-center justify-between">
        <button
          onClick={handleFlip}
          className="px-3 py-1.5 retro-btn font-pixel text-xs text-gray-800"
        >
          ↺ Flip Card
        </button>

        <div className="flex space-x-2">
          <button
            onClick={handleReviewAgain}
            className="px-3 py-1.5 retro-btn font-pixel text-xs font-bold text-rose-900 bg-rose-100 hover:bg-rose-200"
          >
            Review Again ✗
          </button>
          <button
            onClick={handleGotIt}
            className="px-4 py-1.5 retro-btn font-pixel text-xs font-bold text-emerald-950 bg-emerald-200 hover:bg-emerald-300 shadow-sm"
          >
            Got It! (+10 XP, +2 🪙) ✓
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { RoomId, Companion } from '../../types';
import { sound } from '../../services/soundEffects';

export const StudyRoomWindow: React.FC = () => {
  const {
    currentRoom,
    rooms,
    switchRoom,
    companions,
    chatMessages,
    sendMessage,
    pomodoroMinutesLeft,
    pomodoroSecondsLeft,
    isPomodoroRunning,
    openWindow,
    showToast,
    addXp,
  } = useCampus();

  const [inputMsg, setInputMsg] = useState('');
  const [userTableSeat, setUserTableSeat] = useState<number | null>(null);
  const [userGoal, setUserGoal] = useState('Deep Focus on Chapter 4');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const currentRoomData = rooms[currentRoom];

  // Companions in current room
  const roomCompanions = companions.filter((c) => c.room === currentRoom);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendMessage(inputMsg);
    setInputMsg('');
  };

  const handleTakeSeat = (tableNum: number) => {
    sound.playClick();
    setUserTableSeat(tableNum);
    addXp(15, 'Took a study seat');
    showToast(`🪑 You sat down at Study Table ${tableNum}! +15 XP`);
  };

  const handleLeaveSeat = () => {
    sound.playClick();
    setUserTableSeat(null);
    showToast('Left study table.');
  };

  return (
    <div className="flex h-full select-none overflow-hidden font-sans">
      {/* 1. Left Discord-Style Servers Sidebar */}
      <div className="w-48 bg-[#202225] text-gray-300 flex flex-col retro-inset border-r border-black mr-2">
        {/* Server Header */}
        <div className="p-2 border-b border-gray-700 bg-[#2f3136] flex items-center space-x-1.5">
          <span className="text-lg">🏛️</span>
          <div className="min-w-0 flex-1">
            <h4 className="font-pixel text-xs font-bold text-white truncate">CampusOS Quad</h4>
            <span className="text-[10px] text-emerald-400 font-pixel">● 4 Channels Active</span>
          </div>
        </div>

        {/* Channels List */}
        <div className="p-1.5 flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
            Study Lounges
          </div>

          {Object.values(rooms).map((r) => {
            const isSelected = currentRoom === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchRoom(r.id)}
                className={`w-full flex items-center space-x-1.5 px-2 py-1.5 rounded text-xs transition-none text-left ${
                  isSelected
                    ? 'bg-[#40444b] text-white font-bold border-l-2 border-blue-400'
                    : 'hover:bg-[#34373c] text-gray-300'
                }`}
              >
                <span className="text-sm">{r.icon}</span>
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate font-pixel text-xs">#{r.id}</div>
                  <div className="text-[9px] text-gray-400 truncate">{r.occupants} online</div>
                </div>
              </button>
            );
          })}

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pt-2">
            AI Assistants
          </div>
          <button
            onClick={() => openWindow('study-bot')}
            className="w-full flex items-center space-x-1.5 px-2 py-1.5 rounded text-xs hover:bg-[#34373c] text-amber-300 text-left"
          >
            <span className="text-sm">🤖</span>
            <div className="truncate">
              <span className="font-pixel text-xs">@StudyBot-AIM</span>
              <span className="text-[9px] text-gray-400 block">Instant Tutor</span>
            </div>
          </button>
        </div>

        {/* Bottom User Sync Bar */}
        <div className="p-2 bg-[#292b2f] border-t border-gray-700 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1 truncate">
            <span>🎓</span>
            <span className="font-bold text-white truncate">You (Scholar)</span>
          </div>
          <span className="text-[10px] bg-blue-900 text-blue-200 px-1 rounded font-pixel">
            Online
          </span>
        </div>
      </div>

      {/* 2. Middle & Right Area: Study Tables + Room Chat */}
      <div className="flex-1 flex flex-col min-w-0 space-y-2">
        {/* Top Room Header Bar */}
        <div className="bg-[#dfdfdf] p-2 retro-inset rounded flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-xl p-1 bg-white rounded retro-outset">{currentRoomData.icon}</span>
            <div>
              <span className="font-bold text-gray-900 text-sm">{currentRoomData.name}</span>
              <span className="text-gray-600 block text-[11px]">{currentRoomData.tagline}</span>
            </div>
          </div>

          {/* Group Pomodoro Sync Pill */}
          <div className="flex items-center space-x-2 bg-black text-amber-400 px-2.5 py-1 rounded retro-inset font-pixel">
            <span className="animate-pulse">●</span>
            <span>Room Sync:</span>
            <span className="font-bold text-sm">
              {String(pomodoroMinutesLeft).padStart(2, '0')}:
              {String(pomodoroSecondsLeft).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-300">
              ({isPomodoroRunning ? 'Sprint in Progress' : 'Paused'})
            </span>
          </div>
        </div>

        {/* Content Split: Study Tables (Left) and Live Chat (Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 min-h-0">
          {/* Study Tables (Col 1-7) */}
          <div className="md:col-span-7 flex flex-col space-y-2 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs font-bold text-gray-700 uppercase">
                🪑 Quad Study Tables ({roomCompanions.length + (userTableSeat ? 1 : 0)} Active)
              </span>
              {userTableSeat && (
                <button
                  onClick={handleLeaveSeat}
                  className="px-2 py-0.5 retro-btn text-[10px] text-red-800 font-pixel font-bold"
                >
                  Leave Table
                </button>
              )}
            </div>

            {/* Table 1 */}
            <div className="bg-[#f0f0f0] p-2.5 rounded retro-outset border border-gray-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel font-bold text-xs text-blue-900">
                  Table 1: Deep Focus Corner
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Warm Amber Lamp</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* User seat if seated here */}
                {userTableSeat === 1 ? (
                  <div className="bg-amber-100 p-2 rounded retro-inset border border-amber-300 flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xl">🎓</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-amber-950 block">You (Seated)</span>
                        {isEditingGoal ? (
                          <input
                            type="text"
                            value={userGoal}
                            onChange={(e) => setUserGoal(e.target.value)}
                            onBlur={() => setIsEditingGoal(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingGoal(false)}
                            autoFocus
                            className="text-[10px] w-full px-1 py-0.5 bg-white border border-gray-400"
                          />
                        ) : (
                          <span
                            onClick={() => setIsEditingGoal(true)}
                            className="text-[10px] text-amber-800 cursor-pointer hover:underline block truncate"
                            title="Click to edit study status"
                          >
                            ✎ {userGoal}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] text-emerald-700 font-bold mt-1">● Synced Sprinting</span>
                  </div>
                ) : !userTableSeat ? (
                  <button
                    onClick={() => handleTakeSeat(1)}
                    className="p-2 border-2 border-dashed border-gray-400 rounded hover:bg-gray-200 flex flex-col items-center justify-center text-gray-600 text-xs font-pixel"
                  >
                    <span>➕ Take This Seat</span>
                    <span className="text-[10px] text-gray-400">+15 XP to sit down</span>
                  </button>
                ) : null}

                {/* Companions seated at Table 1 */}
                {roomCompanions
                  .filter((c) => c.tableId === 1)
                  .map((comp) => (
                    <div
                      key={comp.id}
                      className="bg-white p-2 rounded retro-inset border border-gray-300 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xl p-0.5 bg-gray-100 rounded">{comp.avatar}</span>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-gray-900 block truncate">
                            {comp.name}
                          </span>
                          <span className="text-[10px] text-gray-600 block truncate" title={comp.status}>
                            {comp.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 mt-1">
                        <span className="text-emerald-600 font-pixel">● Studying</span>
                        <span>{comp.minutesStudied}m focus</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Table 2 */}
            <div className="bg-[#f0f0f0] p-2.5 rounded retro-outset border border-gray-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel font-bold text-xs text-purple-900">
                  Table 2: Collaborative Research Desk
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Lo-Fi Radio Active</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {userTableSeat === 2 ? (
                  <div className="bg-amber-100 p-2 rounded retro-inset border border-amber-300 flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xl">🎓</span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-amber-950 block">You (Seated)</span>
                        <span
                          onClick={() => setIsEditingGoal(true)}
                          className="text-[10px] text-amber-800 cursor-pointer block truncate"
                        >
                          {userGoal}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-emerald-700 font-bold mt-1">● Synced Sprinting</span>
                  </div>
                ) : !userTableSeat ? (
                  <button
                    onClick={() => handleTakeSeat(2)}
                    className="p-2 border-2 border-dashed border-gray-400 rounded hover:bg-gray-200 flex flex-col items-center justify-center text-gray-600 text-xs font-pixel"
                  >
                    <span>➕ Take This Seat</span>
                    <span className="text-[10px] text-gray-400">+15 XP to sit down</span>
                  </button>
                ) : null}

                {roomCompanions
                  .filter((c) => c.tableId === 2)
                  .map((comp) => (
                    <div
                      key={comp.id}
                      className="bg-white p-2 rounded retro-inset border border-gray-300 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xl p-0.5 bg-gray-100 rounded">{comp.avatar}</span>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-gray-900 block truncate">
                            {comp.name}
                          </span>
                          <span className="text-[10px] text-gray-600 block truncate" title={comp.status}>
                            {comp.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 mt-1">
                        <span className="text-emerald-600 font-pixel">● Studying</span>
                        <span>{comp.minutesStudied}m focus</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Live Room Chat (Col 8-12) */}
          <div className="md:col-span-5 flex flex-col bg-white rounded retro-inset border border-gray-400 p-2 min-h-[220px]">
            <div className="border-b border-gray-300 pb-1 mb-1.5 flex items-center justify-between text-xs">
              <span className="font-pixel font-bold text-gray-800">
                💬 #{currentRoom} Live Study Chat
              </span>
              <span className="text-[10px] text-gray-500">Tip: Tag @StudyBot</span>
            </div>

            {/* Chat Message Scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs select-text">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-1.5 rounded leading-relaxed ${
                    msg.isBot
                      ? 'bg-blue-50 border border-blue-200'
                      : msg.sender.includes('You')
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-gray-900 flex items-center space-x-1">
                      <span>{msg.avatar}</span>
                      <span>{msg.sender}</span>
                      {msg.badge && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-pixel ${
                            msg.isBot
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {msg.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-800 text-xs break-words">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} className="mt-2 pt-1 border-t border-gray-300 flex space-x-1">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Share a study thought or type @StudyBot..."
                className="flex-1 px-2 py-1 text-xs border border-gray-400 retro-inset bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 retro-btn text-xs font-pixel font-bold text-black hover:bg-gray-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

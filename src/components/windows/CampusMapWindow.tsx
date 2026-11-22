import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { RoomId } from '../../types';
import { sound } from '../../services/soundEffects';

export const CampusMapWindow: React.FC = () => {
  const { currentRoom, rooms, switchRoom, openWindow } = useCampus();

  const handleSelectRoom = (roomId: RoomId) => {
    switchRoom(roomId);
  };

  const currentRoomData = rooms[currentRoom];

  return (
    <div className="flex flex-col h-full space-y-3 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-3 rounded retro-inset flex items-center justify-between">
        <div>
          <div className="font-pixel text-lg font-bold text-amber-300 flex items-center space-x-2">
            <span>🗺️</span>
            <span>CAMPUS QUAD DIRECTORY & VIRTUAL SPACES</span>
          </div>
          <p className="text-xs text-blue-200 mt-0.5 font-sans">
            Use keyboard shortcuts <span className="bg-blue-800 px-1 py-0.5 rounded font-mono font-bold text-amber-300">L</span>,{' '}
            <span className="bg-blue-800 px-1 py-0.5 rounded font-mono font-bold text-amber-300">R</span>,{' '}
            <span className="bg-blue-800 px-1 py-0.5 rounded font-mono font-bold text-amber-300">C</span>,{' '}
            <span className="bg-blue-800 px-1 py-0.5 rounded font-mono font-bold text-amber-300">N</span> to warp anywhere anytime!
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-emerald-300 font-pixel font-bold">● 67 Scholars Online</div>
          <div className="text-[10px] text-gray-300">1,240 Focus Hours Today</div>
        </div>
      </div>

      {/* Interactive Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {Object.values(rooms).map((room) => {
          const isCurrent = currentRoom === room.id;
          return (
            <div
              key={room.id}
              onClick={() => handleSelectRoom(room.id)}
              className={`p-3 rounded retro-outset cursor-pointer transition-all relative flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-50 ring-2 ring-blue-700 shadow-md'
                  : 'bg-gray-100 hover:bg-white'
              }`}
            >
              {/* Active Badge */}
              {isCurrent && (
                <div className="absolute top-2 right-2 bg-blue-700 text-white font-pixel text-[10px] px-2 py-0.5 rounded shadow">
                  ★ YOU ARE HERE
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-2xl p-1.5 bg-gray-200 rounded retro-inset">{room.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
                      <span>{room.name}</span>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded border border-blue-300">
                        [{room.hotkey}]
                      </span>
                    </h3>
                    <p className="text-xs text-gray-600 italic">{room.tagline}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-700 mb-2 leading-relaxed bg-white/70 p-1.5 rounded retro-inset">
                  {room.vibe}
                </p>

                {/* Features List */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {room.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded border border-gray-300 font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Info & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-300 mt-2">
                <span className="text-xs text-gray-600 font-pixel">
                  👥 {room.occupants} scholars studying
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRoom(room.id);
                    openWindow('study-room');
                  }}
                  className="px-2.5 py-1 retro-btn text-xs font-pixel font-bold hover:bg-blue-100 text-blue-900"
                >
                  {isCurrent ? 'Open Room Tables →' : 'Warp & Join →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Room Quick Summary Footer */}
      <div className="bg-[#dfdfdf] p-2 retro-inset rounded text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-pixel font-bold text-blue-950">Active Zone:</span>
          <span className="font-bold text-gray-900">
            {currentRoomData.icon} {currentRoomData.name}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-600">{currentRoomData.occupants} companions active</span>
        </div>
        <button
          onClick={() => openWindow('study-room')}
          className="px-2 py-0.5 retro-btn font-pixel text-xs font-bold text-blue-800"
        >
          View Discord Servers & Tables 👥
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

export const ShopWindow: React.FC = () => {
  const { stats, shopItems, buyItem } = useCampus();
  const [activeTab, setActiveTab] = useState<'all' | 'wallpaper' | 'theme' | 'pet' | 'badge'>('all');

  const filteredItems = activeTab === 'all'
    ? shopItems
    : shopItems.filter((i) => i.category === activeTab);

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-y-auto space-y-3 p-1">
      {/* 1. Shop Header & Balance */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-3 rounded retro-inset flex items-center justify-between">
        <div>
          <span className="font-pixel text-base font-bold text-amber-300 block">
            🛍️ CAMPUS BOOKSTORE & OS CUSTOMIZATION SHOP
          </span>
          <span className="text-[11px] text-amber-100 font-sans">
            Spend earned Campus Coins to unlock retro themes, wallpapers & desk pets!
          </span>
        </div>
        <div className="bg-black/60 px-3 py-1.5 rounded retro-inset border border-amber-400 flex items-center space-x-1.5">
          <span className="text-xl">🪙</span>
          <div>
            <span className="font-pixel text-xs text-amber-300 block">YOUR BALANCE</span>
            <span className="font-pixel text-lg font-bold text-white">{stats.coins} Coins</span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex space-x-1 border-b border-gray-400 pb-1 text-xs font-pixel">
        {(['all', 'wallpaper', 'theme', 'pet', 'badge'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab);
            }}
            className={`px-3 py-1 retro-btn capitalize font-bold ${
              activeTab === tab ? 'pressed bg-amber-200 text-amber-950' : 'bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded retro-outset flex flex-col justify-between border ${
              item.unlocked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-gray-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl p-1 bg-gray-100 rounded retro-inset">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{item.name}</h4>
                    <span className="text-[10px] text-gray-500 uppercase font-pixel">
                      {item.category}
                    </span>
                  </div>
                </div>

                {item.unlocked && (
                  <span className="text-[10px] bg-emerald-600 text-white font-pixel px-1.5 py-0.5 rounded">
                    Unlocked ✓
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-pixel font-bold text-xs text-amber-900">
                {item.price === 0 ? 'FREE' : `🪙 ${item.price} Coins`}
              </span>

              <button
                onClick={() => buyItem(item.id)}
                className={`px-3 py-1 retro-btn font-pixel text-xs font-bold ${
                  item.unlocked
                    ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                    : stats.coins >= item.price
                    ? 'bg-amber-200 text-amber-950 hover:bg-amber-300'
                    : 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                }`}
              >
                {item.unlocked ? 'Equip' : 'Buy & Equip'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

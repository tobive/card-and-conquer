import React from 'react';
import { GameCard } from '../../components/GameCard';
import { getCardById } from '../../../shared/utils/cardCatalog';

export const CardCollectionPage: React.FC = () => {
  // Get example cards for different levels
  const level1Card = getCardById(6); // Hotei - Level 1
  const level3Card = getCardById(8); // Hanuman - Level 3
  const level5Card = getCardById(10); // Amaterasu - Level 5

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="text-5xl sm:text-6xl mb-3" aria-hidden="true">🎴</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Card Collection
        </h2>
        <p className="text-base sm:text-lg text-slate-300">
          Build your divine army through the gacha system
        </p>
      </div>

      {/* Gacha System Overview */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span aria-hidden="true">✨</span>
          <span>The Gacha System</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Collect powerful deity cards through three different pull types. Each pull grants you a random card 
          from the available pool, with higher-level cards becoming accessible as you progress.
        </p>
      </div>

      {/* Three Pull Types */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center">
          Pull Types
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Free Pull */}
          <div className="card p-5 sm:p-6 border-2 border-green-500/30 bg-gradient-to-br from-green-900/20 to-slate-800/80 hover:border-green-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl" aria-hidden="true">🎁</div>
              <div className="flex-1 space-y-2">
                <h4 className="text-lg sm:text-xl font-bold text-green-400">Free Pull</h4>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="px-2 py-1 bg-green-900/30 rounded border border-green-500/30 font-semibold">
                    FREE
                  </span>
                  <span>•</span>
                  <span>⏰ 2-hour cooldown</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Get one free card every 2 hours. Perfect for building your collection over time without spending coins.
                </p>
              </div>
            </div>
          </div>

          {/* Paid Pull */}
          <div className="card p-5 sm:p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-slate-800/80 hover:border-amber-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">💰</div>
              <div className="flex-1 space-y-2">
                <h4 className="text-lg sm:text-xl font-bold text-amber-400">Paid Pull</h4>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="px-2 py-1 bg-amber-900/30 rounded border border-amber-500/30 font-semibold">
                    50 COINS
                  </span>
                  <span>•</span>
                  <span>⚡ Instant</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Purchase a single card pull anytime. Great for when you need a specific card or can't wait for the cooldown.
                </p>
              </div>
            </div>
          </div>

          {/* Multi-Pull */}
          <div className="card p-5 sm:p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-800/80 hover:border-purple-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">🎰</div>
              <div className="flex-1 space-y-2">
                <h4 className="text-lg sm:text-xl font-bold text-purple-400">Multi-Pull</h4>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="px-2 py-1 bg-purple-900/30 rounded border border-purple-500/30 font-semibold">
                    170 COINS
                  </span>
                  <span>•</span>
                  <span>🎉 5 cards</span>
                  <span>•</span>
                  <span className="text-green-400">Save 80 coins!</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Get 5 cards at once for a discounted price. The most efficient way to expand your collection quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level-Gating System */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-blue-900/20 to-slate-800/80 border-2 border-blue-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-400 flex items-center gap-2">
          <span>📊</span>
          <span>Level-Gating System</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          As you level up, you unlock access to more powerful cards. Your player level determines which cards 
          can appear in your gacha pulls.
        </p>
        
        {/* Level Examples */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl mb-1">1️⃣</div>
            <div className="text-xs text-slate-400">Level 1</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Lvl 1 Cards</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl mb-1">2️⃣</div>
            <div className="text-xs text-slate-400">Level 2</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Lvl 1-2</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl mb-1">3️⃣</div>
            <div className="text-xs text-slate-400">Level 3</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Lvl 1-3</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl mb-1">4️⃣</div>
            <div className="text-xs text-slate-400">Level 4</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Lvl 1-4</div>
          </div>
          <div className="text-center p-3 bg-amber-900/30 rounded-lg border border-amber-500/50">
            <div className="text-2xl mb-1">5️⃣</div>
            <div className="text-xs text-amber-400">Level 5</div>
            <div className="text-sm font-bold text-amber-300 mt-1">All Cards!</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 mt-4">
          <div className="text-2xl">💡</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-blue-400">Pro Tip:</strong> Higher-level cards have more devotees (HP), 
            making them more powerful in battle. Keep leveling up to unlock the strongest deities!
          </p>
        </div>
      </div>

      {/* Consumable Cards System */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-red-900/20 to-slate-800/80 border-2 border-red-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Consumable Cards</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          <strong className="text-red-400">Important:</strong> Cards are consumable resources! When you use a card in battle, 
          it is consumed and removed from your inventory. Manage your cards wisely!
        </p>
        
        {/* How It Works */}
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl">1️⃣</div>
            <div className="flex-1">
              <div className="font-bold text-slate-200 mb-1">Collect Cards</div>
              <div className="text-xs text-slate-400">Pull cards from gacha to add them to your inventory</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl">2️⃣</div>
            <div className="flex-1">
              <div className="font-bold text-slate-200 mb-1">Check Quantity</div>
              <div className="text-xs text-slate-400">Each card shows "×N" badge indicating how many copies you own</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-500/50">
            <div className="text-2xl">3️⃣</div>
            <div className="flex-1">
              <div className="font-bold text-red-300 mb-1">Use in Battle</div>
              <div className="text-xs text-red-400">When you place a card in battle, quantity decreases by 1</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-2xl">4️⃣</div>
            <div className="flex-1">
              <div className="font-bold text-slate-200 mb-1">Collect More</div>
              <div className="text-xs text-slate-400">Pull duplicates to replenish your supply</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30 mt-4">
          <div className="text-2xl">💡</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-red-400">Strategy Tip:</strong> Keep multiple copies of your favorite cards! 
            Common cards become valuable as expendable resources. Balance using powerful cards with maintaining your supply.
          </p>
        </div>
      </div>

      {/* Card Variants */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
          <span>🎨</span>
          <span>Card Variants</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Each card has multiple visual variants - alternate artwork that makes your collection unique. 
          Variants are purely cosmetic and don't affect card stats. Each variant has its own quantity!
        </p>
        
        {/* Variant Rarity */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🖼️</div>
              <div>
                <div className="font-bold text-slate-200">Base Variant</div>
                <div className="text-xs text-slate-400">Standard artwork</div>
              </div>
            </div>
            <div className="text-sm font-semibold text-green-400">Common</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-500/50">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <div className="font-bold text-purple-300">Alternate Variant</div>
                <div className="text-xs text-purple-400">Special artwork</div>
              </div>
            </div>
            <div className="text-sm font-semibold text-purple-400">10x Rarer!</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 mt-4">
          <div className="text-2xl">🌟</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-purple-400">Collector's Note:</strong> Alternate variants are 10 times rarer 
            than base cards. Each variant tracks its own quantity separately!
          </p>
        </div>
      </div>

      {/* Example Cards Visual with Real Cards */}
      <div className="card p-3 sm:p-4 space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-amber-400 text-center">
          Example Cards by Level
        </h3>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
          {/* Level 1 Example */}
          {level1Card && (
            <div className="space-y-1">
              <GameCard
                card={level1Card}
                size="thumbnail"
                showStats={true}
                className="w-full"
              />
              <div className="text-center">
                <span className="inline-block px-1.5 py-0.5 bg-slate-700 rounded text-[9px] sm:text-[10px] text-slate-300">
                  Starter
                </span>
              </div>
            </div>
          )}

          {/* Level 3 Example */}
          {level3Card && (
            <div className="space-y-1">
              <GameCard
                card={level3Card}
                size="thumbnail"
                showStats={true}
                className="w-full"
              />
              <div className="text-center">
                <span className="inline-block px-1.5 py-0.5 bg-blue-900/50 rounded text-[9px] sm:text-[10px] text-blue-300 border border-blue-500/30">
                  Mid-Tier
                </span>
              </div>
            </div>
          )}

          {/* Level 5 Example */}
          {level5Card && (
            <div className="space-y-1">
              <GameCard
                card={level5Card}
                size="thumbnail"
                showStats={true}
                className="w-full"
              />
              <div className="text-center">
                <span className="inline-block px-1.5 py-0.5 bg-amber-900/50 rounded text-[9px] sm:text-[10px] text-amber-300 border border-amber-500/50 font-semibold">
                  Legendary
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gacha Interface Preview */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 text-center flex items-center justify-center gap-2">
          <span>🎰</span>
          <span>Gacha Interface</span>
        </h3>
        
        {/* Mock Gacha Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-bold text-white shadow-lg border-2 border-green-400 hover:shadow-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span>🎁 Free Pull</span>
              <span className="text-sm bg-green-800/50 px-3 py-1 rounded">Ready!</span>
            </div>
          </button>
          
          <button className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg font-bold text-white shadow-lg border-2 border-amber-400 hover:shadow-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span>💰 Paid Pull</span>
              <span className="text-sm bg-amber-800/50 px-3 py-1 rounded">50 coins</span>
            </div>
          </button>
          
          <button className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-bold text-white shadow-lg border-2 border-purple-400 hover:shadow-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span>🎉 Multi-Pull (5x)</span>
              <span className="text-sm bg-purple-800/50 px-3 py-1 rounded">170 coins</span>
            </div>
          </button>
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-4">
          Visit the Gacha screen from the main menu to start collecting!
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-amber-900/30 to-purple-900/30 rounded-lg border-2 border-amber-500/30">
        <div className="text-3xl">📝</div>
        <div className="flex-1 space-y-2">
          <h4 className="font-bold text-amber-400 text-lg">Key Takeaways</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠️</span>
              <span><strong>Cards are consumable!</strong> They're used up when placed in battles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Check the ×N badge to see how many copies you have</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Use free pulls daily to maintain your card supply</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Multi-pulls offer the best value for expanding your collection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Level up to unlock access to more powerful deity cards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Each variant has its own quantity - collect them all!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

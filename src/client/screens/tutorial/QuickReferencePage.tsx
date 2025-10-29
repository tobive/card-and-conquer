import React from 'react';

export const QuickReferencePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">
          📋 Quick Reference
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          Essential information at a glance
        </p>
      </div>

      {/* Gacha Costs */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🎴 Gacha Costs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300 font-semibold">Pull Type</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Cost</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Cards</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700/50">
                <td className="py-2">Free Pull</td>
                <td className="py-2 text-green-400">2-hour cooldown</td>
                <td className="py-2">1</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">Paid Pull</td>
                <td className="py-2 text-amber-400">50 coins</td>
                <td className="py-2">1</td>
              </tr>
              <tr>
                <td className="py-2">Multi-Pull</td>
                <td className="py-2 text-amber-400">170 coins</td>
                <td className="py-2">5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Battle Rewards */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          💰 Battle Rewards
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300 font-semibold">Result</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Coins</th>
                <th className="text-left py-2 text-slate-300 font-semibold">XP</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Bonus</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700/50">
                <td className="py-2">Win</td>
                <td className="py-2 text-amber-400">70</td>
                <td className="py-2 text-purple-400">50</td>
                <td className="py-2 text-green-400">+1 Pull</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">Win (Favored)</td>
                <td className="py-2 text-amber-400 font-bold">70 + 500</td>
                <td className="py-2 text-purple-400">50</td>
                <td className="py-2 text-green-400">+1 Pull</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">Loss</td>
                <td className="py-2 text-amber-400">20</td>
                <td className="py-2 text-purple-400">50</td>
                <td className="py-2 text-slate-500">—</td>
              </tr>
              <tr>
                <td className="py-2">Draw</td>
                <td className="py-2 text-amber-400">35</td>
                <td className="py-2 text-purple-400">50</td>
                <td className="py-2 text-slate-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-3 italic">
          * Favored faction bonus: +500 coins when your favored faction wins
        </p>
      </div>

      {/* Card Abilities */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          ✨ Card Abilities
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300 font-semibold">Ability</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Phase</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Effect</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700/50">
                <td className="py-2">⚡ FirstStrike</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded text-xs">Pre</span>
                </td>
                <td className="py-2 text-xs md:text-sm">70% chance to attack first</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">🛡️ Reinforcements</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded text-xs">Pre</span>
                </td>
                <td className="py-2 text-xs md:text-sm">+3 devotees</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">🏰 SiegeMaster</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded text-xs">Pre</span>
                </td>
                <td className="py-2 text-xs md:text-sm">+5 devotees (cities/fortresses)</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">💪 Spartan</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded text-xs">Pre</span>
                </td>
                <td className="py-2 text-xs md:text-sm">+2 devotees</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">🎯 Precision</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-purple-900/40 text-purple-300 rounded text-xs">During</span>
                </td>
                <td className="py-2 text-xs md:text-sm">Deal 2 damage (not random)</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">🏃 TacticalRetreat</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">Post</span>
                </td>
                <td className="py-2 text-xs md:text-sm">Survive with 1 devotee if killed</td>
              </tr>
              <tr>
                <td className="py-2">⚔️ LastStand</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">Post</span>
                </td>
                <td className="py-2 text-xs md:text-sm">Deal 3 damage when killed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Session Quick Facts */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🎮 Game Session Quick Facts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Session Points</div>
            <div className="text-slate-200">Tracked separately for East & West</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Favored Faction</div>
            <div className="text-slate-200">Faction with more session points</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Faction Bonus</div>
            <div className="text-amber-400 font-bold">+500 coins on favored faction wins</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Session Completion</div>
            <div className="text-slate-200">Level & XP reset to Level 1</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Preserved</div>
            <div className="text-green-400">Collection & all-time stats</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Strategy</div>
            <div className="text-slate-200">Loyalty = more bonuses</div>
          </div>
        </div>
      </div>

      {/* Map Types */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🗺️ Map Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm md:text-base">
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏔️</div>
            <div className="text-slate-200">Mountains</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🌲</div>
            <div className="text-slate-200">Forest</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏜️</div>
            <div className="text-slate-200">Desert</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏰</div>
            <div className="text-slate-200 font-semibold">City</div>
            <div className="text-xs text-amber-400">SiegeMaster +5</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-slate-200 font-semibold">Fortress</div>
            <div className="text-xs text-amber-400">SiegeMaster +5</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🌊</div>
            <div className="text-slate-200">Coast</div>
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-3 italic">
          * SiegeMaster ability grants +5 devotees in cities and fortresses
        </p>
      </div>

      {/* Faction War */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🏴 Faction War
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm md:text-base">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">War Slider Range</div>
            <div className="text-slate-200">-6 (West) to +6 (East)</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Victory Condition</div>
            <div className="text-slate-200">Reach ±6 on slider</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">War Victory Reward</div>
            <div className="text-amber-400 font-bold">+100 coins (all faction)</div>
          </div>
        </div>
      </div>

      {/* Card Variants */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🎨 Card Variants
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300 font-semibold">Rarity</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Type</th>
                <th className="text-left py-2 text-slate-300 font-semibold">Rarity Multiplier</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700/50">
                <td className="py-2">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">Common</span>
                </td>
                <td className="py-2">Base</td>
                <td className="py-2">1x</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-900/60 text-blue-300 rounded text-xs">Rare</span>
                </td>
                <td className="py-2">Alternate</td>
                <td className="py-2">10x rarer</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2">
                  <span className="px-2 py-1 bg-purple-900/60 text-purple-300 rounded text-xs">Epic</span>
                </td>
                <td className="py-2">Alternate</td>
                <td className="py-2">10x rarer</td>
              </tr>
              <tr>
                <td className="py-2">
                  <span className="px-2 py-1 bg-amber-900/60 text-amber-300 rounded text-xs">Legendary</span>
                </td>
                <td className="py-2">Alternate</td>
                <td className="py-2">10x rarer</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-3 italic">
          * Variants are cosmetic only - identical stats to base cards
        </p>
      </div>

      {/* Leaderboards */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          🏆 Leaderboards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-blue-400 font-semibold mb-2">Current Leaderboards</div>
            <ul className="text-slate-300 text-xs md:text-sm space-y-1">
              <li>• East Faction Wins</li>
              <li>• West Faction Wins</li>
              <li>• Tracks current war only</li>
              <li>• Resets after war victory</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-amber-400 font-semibold mb-2">Hall of Fame</div>
            <ul className="text-slate-300 text-xs md:text-sm space-y-1">
              <li>• East Champions (all-time)</li>
              <li>• West Champions (all-time)</li>
              <li>• Combined Power (total)</li>
              <li>• Never resets</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-xl p-4 md:p-6 border-2 border-amber-400/30">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
          💡 Pro Tips
        </h3>
        <ul className="space-y-2 text-sm md:text-base text-slate-200">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span>Stick with one faction per session to maximize +500 coin bonuses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>SiegeMaster dominates in cities and fortresses (+5 devotees)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Multi-pull saves 80 coins compared to 5 individual pulls</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Every battle adds to your Hall of Fame legacy forever</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

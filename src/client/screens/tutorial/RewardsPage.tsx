import React from 'react';

export const RewardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">💰 Rewards & Progression</h2>
        <p className="text-slate-300 text-lg">
          Earn coins, XP, and bonus rewards through battles
        </p>
      </div>

      {/* Battle Rewards Table */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>🎁</span>
          <span>Battle Rewards</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-600">
                <th className="text-left py-3 px-2 text-slate-300 font-semibold">Result</th>
                <th className="text-center py-3 px-2 text-slate-300 font-semibold">Base Coins</th>
                <th className="text-center py-3 px-2 text-slate-300 font-semibold">XP</th>
                <th className="text-center py-3 px-2 text-slate-300 font-semibold">Faction Points</th>
                <th className="text-center py-3 px-2 text-slate-300 font-semibold">Bonus Pull</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700">
                <td className="py-3 px-2 font-semibold text-green-400">✓ Win</td>
                <td className="text-center py-3 px-2">70</td>
                <td className="text-center py-3 px-2">50</td>
                <td className="text-center py-3 px-2">+1</td>
                <td className="text-center py-3 px-2">✓ Yes</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-2 font-semibold text-red-400">✗ Loss</td>
                <td className="text-center py-3 px-2">20</td>
                <td className="text-center py-3 px-2">50</td>
                <td className="text-center py-3 px-2">—</td>
                <td className="text-center py-3 px-2">✗ No</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-semibold text-slate-400">= Draw</td>
                <td className="text-center py-3 px-2">35</td>
                <td className="text-center py-3 px-2">50</td>
                <td className="text-center py-3 px-2">—</td>
                <td className="text-center py-3 px-2">✗ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Faction Bonus Highlight */}
      <div className="bg-gradient-to-r from-amber-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-amber-400/40">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-2">
              Faction Bonus: +500 Coins!
            </h3>
            <p className="text-slate-200 mb-3">
              Win battles with your <span className="font-semibold text-amber-300">favored faction</span> to earn a massive bonus!
            </p>
            <div className="bg-slate-800/60 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Base win reward:</span>
                <span className="text-white font-semibold">70 coins</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-300 font-semibold">Favored faction bonus:</span>
                <span className="text-amber-400 font-bold text-lg">+500 coins</span>
              </div>
              <div className="border-t border-slate-600 pt-2 flex items-center justify-between">
                <span className="text-slate-200 font-semibold">Total reward:</span>
                <span className="text-green-400 font-bold text-xl">570 coins</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              💡 Your favored faction is the one with the most session points. Stay loyal to maximize earnings!
            </p>
          </div>
        </div>
      </div>

      {/* Bonus Gacha Pulls */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center gap-2">
          <span>🎴</span>
          <span>Bonus Gacha Pulls</span>
        </h3>
        <p className="text-slate-200 mb-3">
          Every time you <span className="font-semibold text-green-400">win a battle</span>, you earn a free bonus gacha pull!
        </p>
        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-purple-300 font-semibold">Bonus Pull Earned!</p>
              <p className="text-slate-400 text-sm">Use it anytime from the Gacha screen</p>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3">
          Bonus pulls don't expire and stack up. Win more battles to collect more free pulls!
        </p>
      </div>

      {/* XP System and Leveling */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <span>⭐</span>
          <span>XP System & Leveling</span>
        </h3>
        <p className="text-slate-200 mb-4">
          Earn <span className="font-semibold text-blue-300">50 XP</span> from every battle (win, loss, or draw). Level up to unlock higher-level cards in the gacha!
        </p>

        {/* XP Progress Bar Example */}
        <div className="bg-slate-900/60 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-semibold">Level 5</span>
            <span className="text-slate-400 text-sm">350 / 500 XP</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
              style={{ width: '70%' }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">150 XP until Level 6</p>
        </div>

        {/* Level Thresholds */}
        <div className="bg-slate-900/40 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Level Thresholds</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Level 1:</span>
              <span className="text-slate-200">0 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 2:</span>
              <span className="text-slate-200">100 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 3:</span>
              <span className="text-slate-200">200 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 4:</span>
              <span className="text-slate-200">300 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 5:</span>
              <span className="text-slate-200">500 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 6:</span>
              <span className="text-slate-200">750 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 7:</span>
              <span className="text-slate-200">1,000 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 8:</span>
              <span className="text-slate-200">1,500 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 9:</span>
              <span className="text-slate-200">2,000 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level 10:</span>
              <span className="text-slate-200">3,000 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Reset Warning */}
      <div className="bg-amber-900/20 rounded-xl p-5 border-2 border-amber-400/40">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">
              Level Reset on Session Completion
            </h3>
            <p className="text-slate-200 mb-2">
              When you complete a game session, your <span className="font-semibold text-amber-300">level and XP reset to Level 1</span>.
            </p>
            <p className="text-slate-300 text-sm">
              Don't worry! Your card collection and all-time stats are preserved. This gives you a fresh start for the next session.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Reward Comparison */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>Reward Comparison</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Regular Win */}
          <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-600">
            <h4 className="font-semibold text-green-400 mb-3 text-center">Regular Win</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Coins:</span>
                <span className="text-white font-semibold">70</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">XP:</span>
                <span className="text-white font-semibold">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Faction Points:</span>
                <span className="text-white font-semibold">+1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Bonus Pull:</span>
                <span className="text-white font-semibold">✓</span>
              </div>
              <div className="border-t border-slate-600 pt-2 flex justify-between">
                <span className="text-slate-200 font-semibold">Total Value:</span>
                <span className="text-green-400 font-bold">~120 coins</span>
              </div>
            </div>
          </div>

          {/* Favored Faction Win */}
          <div className="bg-gradient-to-br from-amber-900/40 to-purple-900/40 rounded-lg p-4 border-2 border-amber-400/60">
            <h4 className="font-semibold text-amber-400 mb-3 text-center flex items-center justify-center gap-2">
              <span>🌟</span>
              <span>Favored Faction Win</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Coins:</span>
                <span className="text-white font-semibold">70</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300 font-semibold">Faction Bonus:</span>
                <span className="text-amber-400 font-bold">+500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">XP:</span>
                <span className="text-white font-semibold">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Faction Points:</span>
                <span className="text-white font-semibold">+1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Bonus Pull:</span>
                <span className="text-white font-semibold">✓</span>
              </div>
              <div className="border-t border-amber-400/40 pt-2 flex justify-between">
                <span className="text-amber-200 font-semibold">Total Value:</span>
                <span className="text-amber-400 font-bold text-lg">~620 coins</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-300 mt-4 text-sm">
          💡 Favored faction wins are worth <span className="font-bold text-amber-400">5x more</span> than regular wins!
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-purple-900/20 rounded-xl p-5 border-2 border-purple-400/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Key Takeaways</span>
        </h3>
        <ul className="space-y-2 text-slate-200 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Every battle gives you 50 XP, regardless of outcome</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Winning battles earns bonus gacha pulls for free cards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Favored faction wins give +500 coin bonus (huge boost!)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Level up to unlock stronger cards in gacha pulls</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Level resets to 1 when you complete a session, but your collection stays</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

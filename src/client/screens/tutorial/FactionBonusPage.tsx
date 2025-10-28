import React from 'react';

export const FactionBonusPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl sm:text-7xl mb-4">🎁</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Faction Bonuses
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          Earn +500 coins for favored faction wins
        </p>
      </div>

      {/* Bonus Explanation */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>💰</span>
          <span>The +500 Coin Bonus</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          When you win a battle for your <strong className="text-amber-400">favored faction</strong>, 
          you earn a massive <strong className="text-amber-400">+500 coin bonus</strong> on top of 
          your regular battle rewards! This is the game's way of rewarding faction loyalty.
        </p>
        <div className="info-box">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-slate-300">
                Your favored faction is the one with the most session points. 
                Win battles for that faction to maximize your coin earnings!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Examples */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🧮</span>
          <span>How It's Calculated</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The bonus is simple: if you win a battle AND that faction is your favored faction, 
          you get the bonus. Let's see some examples:
        </p>

        {/* Example 1: Bonus Earned */}
        <div className="mt-6 space-y-4">
          <div className="bg-green-900/20 rounded-lg p-5 border-2 border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                <span>✅</span>
                <span>Bonus Earned!</span>
              </h3>
              <div className="px-3 py-1 bg-green-500/20 rounded text-sm font-bold text-green-400">
                +500 COINS
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Your Session Points:</span>
                <div className="flex gap-4">
                  <span className="text-blue-400">🛡️ West: 15</span>
                  <span className="text-red-400">⚡ East: 7</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Favored Faction:</span>
                <span className="text-blue-400 font-bold">🛡️ West</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Battle Result:</span>
                <span className="text-green-400 font-bold">West Victory</span>
              </div>
              
              <div className="pt-3 mt-3 border-t-2 border-green-500/30">
                <div className="text-center space-y-2">
                  <div className="text-sm text-slate-400">Total Rewards</div>
                  <div className="text-2xl font-bold text-green-400">
                    70 + 500 = 570 coins
                  </div>
                  <div className="text-xs text-slate-400">(Base + Bonus)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2: No Bonus - Wrong Faction */}
          <div className="bg-red-900/20 rounded-lg p-5 border-2 border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <span>❌</span>
                <span>No Bonus - Wrong Faction</span>
              </h3>
              <div className="px-3 py-1 bg-red-500/20 rounded text-sm font-bold text-red-400">
                NO BONUS
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Your Session Points:</span>
                <div className="flex gap-4">
                  <span className="text-blue-400">🛡️ West: 15</span>
                  <span className="text-red-400">⚡ East: 7</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Favored Faction:</span>
                <span className="text-blue-400 font-bold">🛡️ West</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Battle Result:</span>
                <span className="text-red-400 font-bold">East Victory</span>
              </div>
              
              <div className="pt-3 mt-3 border-t-2 border-red-500/30">
                <div className="text-center space-y-2">
                  <div className="text-sm text-slate-400">Total Rewards</div>
                  <div className="text-2xl font-bold text-slate-300">
                    70 coins
                  </div>
                  <div className="text-xs text-red-400">(Base only - wrong faction won)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 3: No Bonus - Equal Points */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-400 flex items-center gap-2">
                <span>⚖️</span>
                <span>No Bonus - Equal Points</span>
              </h3>
              <div className="px-3 py-1 bg-slate-500/20 rounded text-sm font-bold text-slate-400">
                NO BONUS
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Your Session Points:</span>
                <div className="flex gap-4">
                  <span className="text-blue-400">🛡️ West: 10</span>
                  <span className="text-red-400">⚡ East: 10</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Favored Faction:</span>
                <span className="text-slate-400 font-bold">⚖️ None (Equal)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Battle Result:</span>
                <span className="text-blue-400 font-bold">West Victory</span>
              </div>
              
              <div className="pt-3 mt-3 border-t-2 border-slate-600">
                <div className="text-center space-y-2">
                  <div className="text-sm text-slate-400">Total Rewards</div>
                  <div className="text-2xl font-bold text-slate-300">
                    70 coins
                  </div>
                  <div className="text-xs text-slate-400">(Base only - no favored faction)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* When Bonuses Are NOT Awarded */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-red-900/20 to-slate-800/80 border-2 border-red-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-400 flex items-center gap-2">
          <span>🚫</span>
          <span>When You DON'T Get the Bonus</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The faction bonus is only awarded under specific conditions. Here's when you WON'T receive it:
        </p>

        <div className="mt-6 space-y-3">
          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-400 mb-1">Wrong Faction Wins</h3>
                <p className="text-sm text-slate-300">
                  If your non-favored faction wins the battle, you only get base rewards
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖️</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-400 mb-1">Equal Session Points</h3>
                <p className="text-sm text-slate-300">
                  If both factions have the same session points, you have no favored faction
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-400 mb-1">Battle Draws</h3>
                <p className="text-sm text-slate-300">
                  Draw results don't award bonuses (you only get 35 base coins)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💔</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-400 mb-1">Battle Losses</h3>
                <p className="text-sm text-slate-300">
                  Losing battles never award bonuses (you only get 20 base coins)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Notification Mockup */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>🔔</span>
          <span>Bonus Notification</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          When you earn a faction bonus, you'll see a special notification celebrating your loyalty:
        </p>

        {/* Notification Example */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-6 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 animate-pulse">
            <div className="text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-2xl font-bold text-amber-400">
                Faction Bonus!
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  Your favored faction won!
                </p>
                <div className="text-4xl font-bold text-amber-400">
                  +500 COINS
                </div>
              </div>
              <div className="pt-4 border-t border-amber-500/30">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <span>🛡️</span>
                  <span>West Loyalty Rewarded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faction Loyalty Meter Concept */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>📊</span>
          <span>Tracking Your Loyalty</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Your session stats show your faction loyalty at a glance. The faction with more points 
          is your favored faction and determines which wins earn you bonuses.
        </p>

        {/* Loyalty Meter Examples */}
        <div className="mt-6 space-y-6">
          {/* Strong West Loyalty */}
          <div className="space-y-3">
            <div className="text-center text-sm font-semibold text-slate-400">
              Strong West Loyalty
            </div>
            <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-blue-500/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="text-2xl font-bold text-blue-400">20</div>
                  <div className="text-xs text-slate-400 uppercase">West</div>
                </div>
                <div className="text-3xl text-slate-600">vs</div>
                <div className="flex-1 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-red-400">5</div>
                  <div className="text-xs text-slate-400 uppercase">East</div>
                </div>
              </div>
              
              {/* Visual Bar */}
              <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '80%' }}></div>
                  <div className="bg-gradient-to-r from-red-400 to-red-500" style={{ width: '20%' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    80% West Loyalty
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/50">
                  <span className="text-sm font-bold text-blue-400">🛡️ West wins = +500 bonus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Balanced Loyalty */}
          <div className="space-y-3">
            <div className="text-center text-sm font-semibold text-slate-400">
              Balanced Play
            </div>
            <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-slate-400 uppercase">West</div>
                </div>
                <div className="text-3xl text-slate-600">vs</div>
                <div className="flex-1 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-red-400">11</div>
                  <div className="text-xs text-slate-400 uppercase">East</div>
                </div>
              </div>
              
              {/* Visual Bar */}
              <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '52%' }}></div>
                  <div className="bg-gradient-to-r from-red-400 to-red-500" style={{ width: '48%' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    Nearly Balanced
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/50">
                  <span className="text-sm font-bold text-blue-400">🛡️ West wins = +500 bonus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Implications */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🎯</span>
          <span>Strategic Implications</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The faction bonus system creates interesting strategic choices. Should you commit to one 
          faction for maximum rewards, or play both sides for flexibility?
        </p>

        {/* Strategy Comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loyalty Strategy */}
          <div className="bg-slate-800/60 rounded-lg p-6 border-2 border-amber-500/30 space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">👑</div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">Loyalty Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Commit to one faction throughout the session to maximize your bonus earnings
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-700 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">Earn +500 coins on most wins</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">Build strong single-faction collection</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">Maximize coin income per session</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg">✗</span>
                <span className="text-sm text-slate-300">Limited card variety</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg">✗</span>
                <span className="text-sm text-slate-300">Can't adapt to war slider easily</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Best For</div>
                <div className="text-sm font-bold text-amber-400">Maximizing Rewards</div>
              </div>
            </div>
          </div>

          {/* Flexibility Strategy */}
          <div className="bg-slate-800/60 rounded-lg p-6 border-2 border-blue-500/30 space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">⚖️</div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">Flexibility Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Play both factions to build a diverse collection and adapt to the war
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-700 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">Collect cards from both factions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">Adapt to war slider changes</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-sm text-slate-300">More strategic options in battles</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg">✗</span>
                <span className="text-sm text-slate-300">Fewer faction bonuses</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg">✗</span>
                <span className="text-sm text-slate-300">Lower coin income per session</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Best For</div>
                <div className="text-sm font-bold text-blue-400">Collection Building</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hybrid Approach */}
        <div className="mt-6 bg-gradient-to-r from-amber-900/20 via-purple-900/20 to-blue-900/20 rounded-lg p-5 border-2 border-purple-500/30">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <h3 className="font-bold text-purple-400 mb-2">Hybrid Approach</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Many players start with loyalty to build coins quickly, then switch to balanced play 
                once they have enough resources. You can also commit to one faction per session, 
                then try the other faction in the next session!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Math Examples */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>📈</span>
          <span>Bonus Impact Over Time</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Let's see how much the faction bonus can add up over multiple battles:
        </p>

        {/* Comparison Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Scenario</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Wins</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Base Coins</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Bonuses</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>👑</span>
                    <span>Full Loyalty</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-slate-300">10</td>
                <td className="text-center py-3 px-4 text-slate-300">700</td>
                <td className="text-center py-3 px-4 text-green-400 font-bold">+5,000</td>
                <td className="text-center py-3 px-4 text-amber-400 font-bold">5,700</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>⚖️</span>
                    <span>Balanced (5/5)</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-slate-300">10</td>
                <td className="text-center py-3 px-4 text-slate-300">700</td>
                <td className="text-center py-3 px-4 text-blue-400 font-bold">+2,500</td>
                <td className="text-center py-3 px-4 text-amber-400 font-bold">3,200</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <span>No Loyalty</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-slate-300">10</td>
                <td className="text-center py-3 px-4 text-slate-300">700</td>
                <td className="text-center py-3 px-4 text-slate-400">+0</td>
                <td className="text-center py-3 px-4 text-amber-400 font-bold">700</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 info-box">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-slate-300">
                <strong className="text-amber-400">The difference is huge!</strong> A loyal player 
                earning bonuses on all 10 wins gets 5,700 coins, while a player with no loyalty 
                only gets 700 coins. That's over 8x more coins!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="info-box">
        <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Key Takeaways</span>
        </h3>
        <ul className="space-y-2 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Win battles for your favored faction to earn +500 coin bonuses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Your favored faction is the one with more session points</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>No bonus if factions are tied or wrong faction wins</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Loyalty strategy maximizes coins, flexibility builds collection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Bonuses can multiply your earnings by 8x or more!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Track your session stats to see your favored faction</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

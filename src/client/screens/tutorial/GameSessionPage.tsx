import React from 'react';

export const GameSessionPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl sm:text-7xl mb-4">🎮</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Game Sessions
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          Track your progress and earn faction bonuses
        </p>
      </div>

      {/* What is a Game Session */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>📊</span>
          <span>What is a Game Session?</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          A <strong className="text-amber-400">game session</strong> tracks your per-game progress 
          and faction loyalty. Think of it as your current "playthrough" - it records which faction 
          you've been supporting and rewards you for staying loyal.
        </p>
        <div className="info-box">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-slate-300">
                Sessions are separate from your permanent collection and all-time stats. 
                They reset periodically to give everyone a fresh start!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Points Tracking */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🎯</span>
          <span>Session Points</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Every time you win a battle, you earn <strong className="text-purple-400">1 session point</strong> for 
          that faction. Your session tracks points for both East and West separately.
        </p>

        {/* Session Stats Example */}
        <div className="mt-6 space-y-4">
          <div className="text-center text-sm font-semibold text-slate-400 mb-2">
            Example Session Stats
          </div>
          
          {/* Session Stats Card */}
          <div className="bg-slate-800/60 rounded-lg p-6 border-2 border-slate-700">
            <div className="grid grid-cols-2 gap-6">
              {/* West Points */}
              <div className="text-center space-y-2">
                <div className="text-4xl">🛡️</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">West Points</div>
                <div className="text-4xl font-bold text-blue-400">12</div>
              </div>
              
              {/* East Points */}
              <div className="text-center space-y-2">
                <div className="text-4xl">⚡</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">East Points</div>
                <div className="text-4xl font-bold text-red-400">5</div>
              </div>
            </div>
            
            {/* Favored Faction Indicator */}
            <div className="mt-6 pt-6 border-t-2 border-slate-700">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-slate-400">Favored Faction:</span>
                <span className="px-4 py-2 bg-blue-500/20 border-2 border-blue-400/50 rounded-lg text-blue-400 font-bold">
                  🛡️ West
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favored Faction Concept */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>⭐</span>
          <span>Favored Faction</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Your <strong className="text-amber-400">favored faction</strong> is the faction with the 
          most session points. This is important because you earn a <strong className="text-amber-400">+500 coin bonus</strong> when 
          your favored faction wins!
        </p>

        {/* Favored Faction Examples */}
        <div className="mt-6 space-y-3">
          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="font-semibold text-blue-400">West: 12 points</div>
                  <div className="text-sm text-slate-400">East: 5 points</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 rounded text-sm font-bold text-blue-400">
                Favored
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-semibold text-red-400">East: 18 points</div>
                  <div className="text-sm text-slate-400">West: 8 points</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-red-500/20 rounded text-sm font-bold text-red-400">
                Favored
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 border-l-4 border-slate-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <div className="font-semibold text-slate-400">West: 10 points</div>
                  <div className="text-sm text-slate-400">East: 10 points</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-500/20 rounded text-sm font-bold text-slate-400">
                No Favorite
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Completion */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🔄</span>
          <span>Session Completion & Reset</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          When you complete a game session, your progress resets to give you a fresh start. 
          This creates exciting new opportunities to try different strategies!
        </p>

        {/* What Resets */}
        <div className="mt-6 space-y-4">
          <div className="bg-red-900/20 rounded-lg p-5 border-2 border-red-500/30">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
              <span>🔄</span>
              <span>What Resets</span>
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-red-400">Level:</strong> Returns to Level 1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-red-400">XP:</strong> Resets to 0</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-red-400">Session Points:</strong> Both East and West reset to 0</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-red-400">Favored Faction:</strong> Cleared (no favorite)</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-900/20 rounded-lg p-5 border-2 border-green-500/30">
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>What's Preserved</span>
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong className="text-green-400">Card Collection:</strong> All cards and variants you own</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong className="text-green-400">Coins:</strong> Your currency balance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong className="text-green-400">Hall of Fame Points:</strong> All-time faction points never reset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span><strong className="text-green-400">All-Time Stats:</strong> Total wins, battles, and achievements</span>
              </li>
            </ul>
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
          The session system rewards <strong className="text-purple-400">faction loyalty</strong> but 
          also allows <strong className="text-purple-400">strategic flexibility</strong>. Choose your approach:
        </p>

        {/* Strategy Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loyalty Strategy */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-amber-500/30">
            <div className="text-center space-y-3">
              <div className="text-4xl">👑</div>
              <h3 className="text-lg font-bold text-amber-400">Loyalty Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stick with one faction throughout the session to maximize your +500 coin bonuses. 
                Build a strong collection for that faction!
              </p>
              <div className="pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-400">Best for:</div>
                <div className="text-sm font-semibold text-amber-400">Maximizing rewards</div>
              </div>
            </div>
          </div>

          {/* Flexibility Strategy */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-blue-500/30">
            <div className="text-center space-y-3">
              <div className="text-4xl">⚖️</div>
              <h3 className="text-lg font-bold text-blue-400">Flexibility Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Play both factions to build a balanced collection and adapt to the war slider. 
                You'll earn fewer bonuses but have more options!
              </p>
              <div className="pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-400">Best for:</div>
                <div className="text-sm font-semibold text-blue-400">Collection building</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Flow Diagram */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>📈</span>
          <span>Session Lifecycle</span>
        </h2>
        
        <div className="mt-6 space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-400">
              1
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-amber-400 mb-1">Start Fresh</h3>
              <p className="text-sm text-slate-300">Begin at Level 1 with 0 session points for both factions</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-2xl text-slate-600">↓</div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center font-bold text-purple-400">
              2
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-purple-400 mb-1">Play & Progress</h3>
              <p className="text-sm text-slate-300">Win battles, earn session points, level up, and build your collection</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-2xl text-slate-600">↓</div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center font-bold text-blue-400">
              3
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-blue-400 mb-1">Earn Bonuses</h3>
              <p className="text-sm text-slate-300">Get +500 coins when your favored faction wins battles</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-2xl text-slate-600">↓</div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center font-bold text-green-400">
              4
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-green-400 mb-1">Session Complete</h3>
              <p className="text-sm text-slate-300">Level and session points reset, but your collection and all-time stats remain!</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-2xl text-slate-600">↻</div>
          </div>

          {/* Back to Step 1 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <span className="text-sm text-slate-400">Repeat with new strategy!</span>
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
            <span>Sessions track your per-game faction loyalty and progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Your favored faction is the one with more session points</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Earn +500 coin bonuses when your favored faction wins</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Level and session points reset on completion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Your collection and all-time stats are never lost</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Choose loyalty for bonuses or flexibility for variety</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

import React from 'react';

export const FactionWarPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl sm:text-7xl mb-4">🏴</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Faction War
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          The global battle between East and West
        </p>
      </div>

      {/* War Slider Overview */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>⚔️</span>
          <span>The War Slider</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The <strong className="text-amber-400">war slider</strong> represents the global conflict 
          between East and West. Every battle you fight moves the slider toward the winning faction, 
          bringing them closer to total victory!
        </p>
        <div className="info-box">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-slate-300">
                The slider ranges from <strong className="text-blue-400">-6 (West Victory)</strong> to{' '}
                <strong className="text-red-400">+6 (East Victory)</strong>. 
                When either faction reaches their goal, they win the war!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* War Slider Visualization */}
      <div className="card p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>📈</span>
          <span>War Slider Range</span>
        </h2>
        
        {/* Slider Visual */}
        <div className="space-y-6">
          {/* Labels */}
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="text-blue-400 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span>West Victory</span>
            </div>
            <div className="text-slate-400">Neutral</div>
            <div className="text-red-400 flex items-center gap-2">
              <span>East Victory</span>
              <span className="text-2xl">⚡</span>
            </div>
          </div>

          {/* Slider Track */}
          <div className="relative">
            {/* Background gradient */}
            <div className="h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 via-slate-700 to-red-600 border-2 border-slate-600">
              {/* Grid lines */}
              <div className="absolute inset-0 flex">
                {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((value) => (
                  <div
                    key={value}
                    className="flex-1 border-r border-slate-800/50 last:border-r-0"
                  />
                ))}
              </div>
            </div>

            {/* Position markers */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((value) => (
                <div
                  key={value}
                  className={`text-xs font-bold ${
                    value === -6
                      ? 'text-blue-300'
                      : value === 6
                      ? 'text-red-300'
                      : value === 0
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          {/* Victory zones */}
          <div className="flex justify-between text-xs text-slate-400">
            <div className="text-left">
              <div className="font-semibold text-blue-400">← West wins at -6</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-400">East wins at +6 →</div>
            </div>
          </div>
        </div>

        {/* Example Positions */}
        <div className="mt-8 space-y-3">
          <div className="text-center text-sm font-semibold text-slate-400 mb-4">
            Example War Positions
          </div>

          {/* West Winning */}
          <div className="bg-blue-900/20 rounded-lg p-4 border-2 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛡️</span>
                <div>
                  <div className="font-bold text-blue-400">Position: -4</div>
                  <div className="text-sm text-slate-300">West is winning!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">2 more wins needed</div>
                <div className="text-sm font-semibold text-blue-400">for West victory</div>
              </div>
            </div>
          </div>

          {/* Neutral */}
          <div className="bg-slate-800/60 rounded-lg p-4 border-2 border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚖️</span>
                <div>
                  <div className="font-bold text-slate-400">Position: 0</div>
                  <div className="text-sm text-slate-300">Perfectly balanced</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">6 wins needed</div>
                <div className="text-sm font-semibold text-slate-400">for either faction</div>
              </div>
            </div>
          </div>

          {/* East Winning */}
          <div className="bg-red-900/20 rounded-lg p-4 border-2 border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <div className="font-bold text-red-400">Position: +5</div>
                  <div className="text-sm text-slate-300">East is dominating!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">1 more win needed</div>
                <div className="text-sm font-semibold text-red-400">for East victory</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How Battles Affect the Slider */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>🎯</span>
          <span>How Battles Move the Slider</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Every completed battle affects the war slider based on the outcome. 
          Your participation directly impacts the global war!
        </p>

        {/* Battle Outcomes */}
        <div className="mt-6 space-y-4">
          {/* West Wins */}
          <div className="bg-blue-900/20 rounded-lg p-5 border-2 border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-4xl">🛡️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-400 mb-2">West Wins Battle</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-3">
                  When West wins, the slider moves <strong className="text-blue-400">-1 toward West</strong>
                </p>
                <div className="bg-slate-800/60 rounded p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Example:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">Position 2</span>
                      <span className="text-blue-400">→</span>
                      <span className="text-blue-400 font-bold">Position 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* East Wins */}
          <div className="bg-red-900/20 rounded-lg p-5 border-2 border-red-500/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-4xl">⚡</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-2">East Wins Battle</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-3">
                  When East wins, the slider moves <strong className="text-red-400">+1 toward East</strong>
                </p>
                <div className="bg-slate-800/60 rounded p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Example:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">Position -3</span>
                      <span className="text-red-400">→</span>
                      <span className="text-red-400 font-bold">Position -2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Draw */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-4xl">🤝</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-400 mb-2">Battle Ends in Draw</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-3">
                  When a battle draws, the slider <strong className="text-slate-400">does not move</strong>
                </p>
                <div className="bg-slate-800/60 rounded p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Example:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">Position 1</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-slate-400 font-bold">Position 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* War Victory */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span>🏆</span>
          <span>War Victory & Rewards</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          When a faction reaches <strong className="text-amber-400">±6 on the war slider</strong>, 
          they achieve total victory! All players who supported the winning faction are rewarded.
        </p>

        {/* Victory Conditions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* West Victory */}
          <div className="bg-blue-900/30 rounded-lg p-5 border-2 border-blue-400/50">
            <div className="text-center space-y-3">
              <div className="text-5xl">🛡️</div>
              <h3 className="text-xl font-bold text-blue-400">West Victory</h3>
              <div className="text-3xl font-bold text-blue-300">-6</div>
              <p className="text-sm text-slate-300">
                Slider reaches -6
              </p>
            </div>
          </div>

          {/* East Victory */}
          <div className="bg-red-900/30 rounded-lg p-5 border-2 border-red-400/50">
            <div className="text-center space-y-3">
              <div className="text-5xl">⚡</div>
              <h3 className="text-xl font-bold text-red-400">East Victory</h3>
              <div className="text-3xl font-bold text-red-300">+6</div>
              <p className="text-sm text-slate-300">
                Slider reaches +6
              </p>
            </div>
          </div>
        </div>

        {/* Victory Rewards */}
        <div className="mt-6 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-lg p-6 border-2 border-amber-400/50">
          <div className="text-center space-y-4">
            <div className="text-5xl">💰</div>
            <h3 className="text-2xl font-bold text-amber-400">Victory Reward</h3>
            <div className="text-4xl font-bold text-amber-300">+100 Coins</div>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
              Every player who won at least one battle for the victorious faction 
              receives <strong className="text-amber-400">100 coins</strong> as a reward!
            </p>
          </div>
        </div>

        {/* Eligibility Note */}
        <div className="info-box">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-slate-300">
                <strong className="text-amber-400">Eligibility:</strong> You must have won at least 
                one battle for the victorious faction during the war to receive the reward. 
                Simply participating isn't enough - you need a win!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Reset */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🔄</span>
          <span>War Reset</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          After a faction achieves victory, the war slider <strong className="text-purple-400">resets to 0</strong> and 
          a new war begins! This gives both factions a fresh chance to dominate.
        </p>

        {/* Reset Flow */}
        <div className="mt-6 space-y-4">
          {/* Before Victory */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-300">Before Victory</h3>
              <span className="text-2xl">⚔️</span>
            </div>
            <div className="h-8 rounded-full bg-gradient-to-r from-blue-600 via-slate-700 to-red-600 border-2 border-slate-600 flex items-center justify-end px-2">
              <div className="text-xs font-bold text-red-300">+6 ✓</div>
            </div>
            <div className="text-center mt-2 text-sm text-red-400 font-semibold">
              East reaches +6 - Victory!
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-3xl text-amber-400">↓</div>
          </div>

          {/* After Victory */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-400">After Victory</h3>
              <span className="text-2xl">🔄</span>
            </div>
            <div className="h-8 rounded-full bg-gradient-to-r from-blue-600 via-slate-700 to-red-600 border-2 border-slate-600 flex items-center justify-center">
              <div className="text-xs font-bold text-slate-300">0</div>
            </div>
            <div className="text-center mt-2 text-sm text-amber-400 font-semibold">
              Slider resets - New war begins!
            </div>
          </div>
        </div>

        {/* What Resets */}
        <div className="mt-6 bg-purple-900/20 rounded-lg p-5 border-2 border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>What Resets After War Victory</span>
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-purple-400">War Slider:</strong> Returns to 0 (neutral)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-purple-400">Current Leaderboards:</strong> Win counts reset for both factions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-purple-400">War Eligibility:</strong> Victory reward eligibility resets</span>
            </li>
          </ul>
        </div>

        {/* What Doesn't Reset */}
        <div className="mt-4 bg-green-900/20 rounded-lg p-5 border-2 border-green-500/30">
          <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
            <span>✅</span>
            <span>What's Preserved</span>
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong className="text-green-400">Your Collection:</strong> All cards and variants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong className="text-green-400">Your Coins:</strong> Currency balance (including victory reward)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong className="text-green-400">Hall of Fame:</strong> All-time faction points never reset</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong className="text-green-400">Game Session:</strong> Your session points and favored faction</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contributing to Your Faction */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-blue-900/20 via-slate-800/80 to-red-900/20 border-2 border-purple-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-2">
          <span>🎖️</span>
          <span>Make Your Mark</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Every battle you fight contributes to the global war effort. Whether you're loyal to one 
          faction or play both sides, your victories shape the fate of the realm!
        </p>

        {/* Contribution Examples */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Single Battle Impact */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-700">
            <div className="text-center space-y-3">
              <div className="text-4xl">⚔️</div>
              <h3 className="text-lg font-bold text-amber-400">Every Battle Counts</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Each victory moves the slider by 1. Your single battle could be the one 
                that tips the scales to victory!
              </p>
            </div>
          </div>

          {/* Strategic Play */}
          <div className="bg-slate-800/60 rounded-lg p-5 border-2 border-slate-700">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎯</div>
              <h3 className="text-lg font-bold text-purple-400">Strategic Timing</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Watch the slider position! When your faction is close to victory, 
                rally together to push for the win!
              </p>
            </div>
          </div>
        </div>

        {/* War Participation Tips */}
        <div className="mt-6 bg-amber-900/20 rounded-lg p-5 border-2 border-amber-500/30">
          <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>War Participation Tips</span>
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Check the war slider regularly to see which faction needs support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Win at least one battle for a faction to be eligible for victory rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Coordinate with your faction when close to ±6 for maximum impact</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">✓</span>
              <span>Remember: draws don't move the slider, so build strong decks!</span>
            </li>
          </ul>
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
            <span>War slider ranges from -6 (West victory) to +6 (East victory)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Each battle win moves the slider by 1 toward the winning faction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Draws don't move the slider</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Victory at ±6 rewards all eligible players with +100 coins</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Must win at least one battle for the faction to receive victory reward</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Slider resets to 0 after victory, starting a new war</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">✓</span>
            <span>Your collection and Hall of Fame points are never affected by war resets</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

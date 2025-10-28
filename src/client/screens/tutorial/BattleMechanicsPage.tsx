import React from 'react';

export const BattleMechanicsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="text-5xl sm:text-6xl mb-3">🛡️</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Battle Mechanics
        </h2>
        <p className="text-base sm:text-lg text-slate-300">
          Master the art of strategic card battles
        </p>
      </div>

      {/* Battle Structure Overview */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>⚔️</span>
          <span>10v10 Battle Structure</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Every battle is a clash between two armies of 10 cards each. The West faction occupies 
          the left side, while the East faction holds the right. Choose your side and deploy your 
          strongest deities to secure victory!
        </p>
      </div>

      {/* Battlefield Layout Diagram */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-600">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center flex items-center justify-center gap-2">
          <span>🗺️</span>
          <span>Battlefield Layout</span>
        </h3>
        
        {/* Battlefield Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* West Side */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/50 rounded-lg border-2 border-blue-500/50">
                <span className="text-2xl">🛡️</span>
                <span className="font-bold text-blue-400">West Faction</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`west-${i}`}
                  className="aspect-square bg-blue-900/30 rounded-lg border-2 border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-semibold hover:border-blue-400/50 transition-all"
                >
                  Slot {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* East Side */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 rounded-lg border-2 border-red-500/50">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-red-400">East Faction</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`east-${i}`}
                  className="aspect-square bg-red-900/30 rounded-lg border-2 border-red-500/30 flex items-center justify-center text-xs text-red-400 font-semibold hover:border-red-400/50 transition-all"
                >
                  Slot {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Each faction has 10 slots to fill with deity cards
        </p>
      </div>

      {/* Starting vs Joining Battles */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center">
          Battle Participation
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Starting a Battle */}
          <div className="card p-5 sm:p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-slate-800/80 hover:border-amber-400/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎯</div>
                <h4 className="text-lg sm:text-xl font-bold text-amber-400">Starting a Battle</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Create a new battle by choosing your faction and placing the first card. You'll also 
                select which card variant to display in battle.
              </p>
              <div className="space-y-2 mt-3">
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 mt-0.5">1.</span>
                  <span>Choose West or East faction</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 mt-0.5">2.</span>
                  <span>Select a card from your collection</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 mt-0.5">3.</span>
                  <span>Pick your preferred card variant</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 mt-0.5">4.</span>
                  <span>Place your card in any empty slot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Joining a Battle */}
          <div className="card p-5 sm:p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-800/80 hover:border-purple-400/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🤝</div>
                <h4 className="text-lg sm:text-xl font-bold text-purple-400">Joining a Battle</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Join an existing battle by adding your card to an empty slot on either side. 
                Help your faction or challenge the opposition!
              </p>
              <div className="space-y-2 mt-3">
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 mt-0.5">1.</span>
                  <span>Browse active battles</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 mt-0.5">2.</span>
                  <span>Choose a battle to join</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 mt-0.5">3.</span>
                  <span>Select your card and variant</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 mt-0.5">4.</span>
                  <span>Place in an available slot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Combat Resolution */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-red-900/20 to-slate-800/80 border-2 border-red-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-red-400 flex items-center gap-2">
          <span>⚡</span>
          <span>Instant Combat Resolution</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The moment you place a card, combat begins immediately! Your card will face off against 
          the opposing card in the same slot position. Watch the battle unfold in real-time as 
          deities clash in epic combat.
        </p>
        
        {/* Combat Example */}
        <div className="grid grid-cols-3 gap-3 items-center max-w-lg mx-auto mt-4">
          <div className="text-center space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg border-2 border-blue-500 flex flex-col items-center justify-center p-2">
              <div className="text-2xl mb-1">🛡️</div>
              <div className="text-xs text-blue-300 font-bold">Zeus</div>
              <div className="text-xs text-blue-400">West</div>
            </div>
            <div className="text-xs text-slate-400">Slot 1</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl animate-pulse">⚔️</div>
            <div className="text-xs text-amber-400 font-bold mt-1">VS</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-red-700 to-red-900 rounded-lg border-2 border-red-500 flex flex-col items-center justify-center p-2">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs text-red-300 font-bold">Odin</div>
              <div className="text-xs text-red-400">East</div>
            </div>
            <div className="text-xs text-slate-400">Slot 1</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30 mt-4">
          <div className="text-2xl">💡</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-red-400">Combat Tip:</strong> Cards in the same slot position 
            fight each other. Choose your slot strategically based on which enemy card you want to face!
          </p>
        </div>
      </div>

      {/* Variant Selector */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
          <span>🎨</span>
          <span>Variant Selector</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          When placing a card in battle, you can choose which visual variant to display. Show off 
          your rare alternate artwork or stick with the classic base design - the choice is yours!
        </p>
        
        {/* Variant Selection Example */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-300">Select Variant:</span>
              <span className="text-xs text-slate-400">Choose your display</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border-2 border-amber-500 flex flex-col items-center justify-center p-2 cursor-pointer hover:border-amber-400 transition-all">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-xs text-slate-300 font-bold">Base</div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-2 py-1 bg-green-900/30 rounded text-xs text-green-400 border border-green-500/30">
                    Selected
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg border-2 border-slate-600 flex flex-col items-center justify-center p-2 cursor-pointer hover:border-purple-400 transition-all">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-xs text-purple-300 font-bold">Alt</div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 mt-4">
          <div className="text-2xl">🌟</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-purple-400">Style Note:</strong> Your variant selection only 
            affects how the card appears visually. Stats and abilities remain the same regardless 
            of which variant you choose!
          </p>
        </div>
      </div>

      {/* Battle Completion Conditions */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🏁</span>
          <span>Battle Completion</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          A battle concludes when one of two conditions is met. Once complete, the winning faction 
          is determined and rewards are distributed to all participants.
        </p>
        
        {/* Completion Conditions */}
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-4 p-4 bg-green-900/20 rounded-lg border-2 border-green-500/30">
            <div className="text-3xl">✅</div>
            <div className="flex-1">
              <h4 className="font-bold text-green-400 text-base mb-2">Condition 1: All Slots Filled</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                When all 20 slots (10 per faction) are occupied with cards, the battle immediately 
                completes. All combat is resolved and the faction with more surviving cards wins.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-blue-900/20 rounded-lg border-2 border-blue-500/30">
            <div className="text-3xl">⏰</div>
            <div className="flex-1">
              <h4 className="font-bold text-blue-400 text-base mb-2">Condition 2: 30-Minute Timeout</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                If 30 minutes pass without all slots being filled, the battle automatically completes. 
                The faction with more cards placed (and surviving) wins the battle.
              </p>
            </div>
          </div>
        </div>

        {/* Battle Status Indicators */}
        <div className="mt-6 space-y-3">
          <h4 className="font-bold text-amber-400 text-center">Battle Status Examples</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl mb-2">🟢</div>
              <div className="text-xs text-green-400 font-bold mb-1">Active</div>
              <div className="text-xs text-slate-400">Slots available</div>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl mb-2">🟡</div>
              <div className="text-xs text-amber-400 font-bold mb-1">Filling Up</div>
              <div className="text-xs text-slate-400">Few slots left</div>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 text-center">
              <div className="text-2xl mb-2">🔴</div>
              <div className="text-xs text-red-400 font-bold mb-1">Complete</div>
              <div className="text-xs text-slate-400">Battle finished</div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Flow Summary */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center">
          Battle Flow Summary
        </h3>
        
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">Player creates or joins a battle</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">Select card and variant to place</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">Choose slot position strategically</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">Instant combat resolves automatically</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              5
            </div>
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">Battle completes when full or after 30 min</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              ✓
            </div>
            <div className="flex-1 p-3 bg-green-900/20 rounded-lg border-2 border-green-500/30">
              <p className="text-sm text-green-300 font-semibold">Rewards distributed to all players!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-amber-900/30 to-purple-900/30 rounded-lg border-2 border-amber-500/30">
        <div className="text-3xl">📝</div>
        <div className="flex-1 space-y-2">
          <h4 className="font-bold text-amber-400 text-lg">Key Takeaways</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Battles are 10v10 with West on the left and East on the right</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>You can start a new battle or join an existing one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Combat happens instantly when you place a card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Choose your card variant to customize your battle display</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Battles complete when all slots are filled or after 30 minutes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

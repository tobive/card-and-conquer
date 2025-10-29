import React from 'react';
import { GameCard } from '../../components/GameCard';
import { getCardById } from '../../../shared/utils/cardCatalog';

export const CombatSystemPage: React.FC = () => {
  // Get example cards for demonstration
  const athenaCard = getCardById(2); // Athena - West
  const thorCard = getCardById(12); // Thor - East

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="text-5xl sm:text-6xl mb-3">⚡</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-400">
          Combat System
        </h2>
        <p className="text-base sm:text-lg text-slate-300">
          Understanding how deities clash in battle
        </p>
      </div>

      {/* Combat Overview */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>⚔️</span>
          <span>Turn-Based Combat Flow</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          When two cards face off in the same slot, they engage in turn-based combat. Each battle 
          progresses through three distinct phases, with abilities triggering at specific moments. 
          Combat continues until one deity's devotees are reduced to zero.
        </p>
      </div>

      {/* Three Combat Phases */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center">
          The Three Combat Phases
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pre-Combat Phase */}
          <div className="card p-5 sm:p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-slate-800/80 hover:border-blue-400/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🛡️</div>
                <h4 className="text-lg sm:text-xl font-bold text-blue-400">Pre-Combat</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Before any attacks are exchanged, pre-combat abilities trigger. These can change 
                turn order, boost stats, or provide defensive advantages.
              </p>
              <div className="space-y-2 mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="text-xs font-bold text-blue-400 mb-2">Abilities:</div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">⚡</span>
                  <span>FirstStrike</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">🛡️</span>
                  <span>Reinforcements</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">🏰</span>
                  <span>SiegeMaster</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">💪</span>
                  <span>Spartan</span>
                </div>
              </div>
            </div>
          </div>

          {/* During Combat Phase */}
          <div className="card p-5 sm:p-6 border-2 border-red-500/30 bg-gradient-to-br from-red-900/20 to-slate-800/80 hover:border-red-400/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">⚔️</div>
                <h4 className="text-lg sm:text-xl font-bold text-red-400">During Combat</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                The main combat phase where deities exchange attacks. Turn order is determined, 
                and cards deal damage based on their devotee counts.
              </p>
              <div className="space-y-2 mt-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <div className="text-xs font-bold text-red-400 mb-2">Abilities:</div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">🎯</span>
                  <span>Precision</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 italic">
                  Most damage happens here through normal attacks
                </div>
              </div>
            </div>
          </div>

          {/* Post-Combat Phase */}
          <div className="card p-5 sm:p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-800/80 hover:border-purple-400/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🌟</div>
                <h4 className="text-lg sm:text-xl font-bold text-purple-400">Post-Combat</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                After attacks are exchanged, post-combat abilities trigger. These can provide 
                last-minute saves or finishing blows.
              </p>
              <div className="space-y-2 mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="text-xs font-bold text-purple-400 mb-2">Abilities:</div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">🏃</span>
                  <span>TacticalRetreat</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">⚔️</span>
                  <span>LastStand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Turn Order Determination */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🎲</span>
          <span>Turn Order Determination</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Who attacks first can determine the outcome of battle. By default, turn order is random 
          (50/50 chance), but the FirstStrike ability can tip the scales in your favor.
        </p>
        
        {/* Turn Order Flowchart */}
        <div className="space-y-3 max-w-2xl mx-auto mt-4">
          <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-slate-600">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-purple-900/50 rounded-lg border border-purple-500/50">
                <span className="font-bold text-purple-400">Combat Begins</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-2xl">⬇️</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <div className="text-center space-y-2">
                  <div className="text-2xl">⚡</div>
                  <div className="text-sm font-bold text-blue-400">FirstStrike Active?</div>
                  <div className="text-xs text-slate-300">70% chance to go first</div>
                </div>
              </div>
              
              <div className="p-3 bg-amber-900/30 rounded-lg border border-amber-500/30">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎲</div>
                  <div className="text-sm font-bold text-amber-400">No FirstStrike</div>
                  <div className="text-xs text-slate-300">50/50 random chance</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-2xl">⬇️</div>
            </div>
            
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-green-900/50 rounded-lg border border-green-500/50">
                <span className="font-bold text-green-400">Turn Order Set!</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 mt-4">
          <div className="text-2xl">💡</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-amber-400">Strategic Tip:</strong> FirstStrike doesn't guarantee 
            you'll go first, but 70% is much better than 50%! Use it to gain an edge in critical battles.
          </p>
        </div>
      </div>


      {/* Random Damage System */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-red-900/20 to-slate-800/80 border-2 border-red-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-red-400 flex items-center gap-2">
          <span>💥</span>
          <span>Random Damage System</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Combat damage is based on each card's devotee count (HP). When a card attacks, it deals 
          random damage between 1 and its current devotee count. This creates exciting, unpredictable 
          battles where anything can happen!
        </p>
        
        {/* Damage Calculation Example */}
        <div className="space-y-4 max-w-2xl mx-auto mt-4">
          <div className="p-5 bg-slate-700/50 rounded-lg border-2 border-slate-600">
            <h4 className="font-bold text-center text-purple-400 mb-4">Damage Calculation Example</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center mb-4">
              <div className="text-center space-y-1.5 sm:space-y-2">
                {athenaCard && (
                  <div className="w-full max-w-[150px] mx-auto">
                    <GameCard
                      card={athenaCard}
                      size="thumbnail"
                      showStats={false}
                      className="w-full"
                    />
                    <div className="mt-2 px-2 sm:px-3 py-1 bg-blue-900/50 rounded-full border border-blue-400 inline-block">
                      <div className="text-[10px] sm:text-xs text-blue-300">HP: {athenaCard.devotees}</div>
                    </div>
                  </div>
                )}
                <div className="text-[10px] sm:text-xs text-slate-400">Attacker</div>
              </div>
              
              <div className="text-center space-y-1.5 sm:space-y-2">
                <div className="text-2xl sm:text-3xl">⚔️</div>
                <div className="p-2 sm:p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                  <div className="text-[10px] sm:text-xs text-slate-400 mb-1">Damage Range:</div>
                  <div className="text-base sm:text-lg font-bold text-red-400">
                    1 - {athenaCard?.devotees || 8}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs text-amber-400 font-semibold">Random!</div>
              </div>
              
              <div className="text-center space-y-1.5 sm:space-y-2">
                {thorCard && (
                  <div className="w-full max-w-[150px] mx-auto">
                    <GameCard
                      card={thorCard}
                      size="thumbnail"
                      showStats={false}
                      className="w-full"
                    />
                    <div className="mt-2 px-2 sm:px-3 py-1 bg-red-900/50 rounded-full border border-red-400 inline-block">
                      <div className="text-[10px] sm:text-xs text-red-300">HP: {thorCard.devotees}</div>
                    </div>
                  </div>
                )}
                <div className="text-[10px] sm:text-xs text-slate-400">Defender</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="text-xs text-slate-400 mb-1">Possible Outcomes:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-green-400">• Low roll (1-3): Odin survives easily</div>
                  <div className="text-amber-400">• Mid roll (4-6): Odin takes moderate damage</div>
                  <div className="text-red-400">• High roll (7-8): Odin heavily wounded</div>
                  <div className="text-purple-400">• Max roll (8): Maximum damage dealt!</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <div className="text-center space-y-2">
              <div className="text-2xl">🎲</div>
              <div className="text-sm font-bold text-purple-400">The dice roll: 6 damage!</div>
              <div className="text-xs text-slate-300">Odin's HP: 10 → 4</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30 mt-4">
          <div className="text-2xl">⚠️</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-red-400">Important:</strong> As a card takes damage and loses 
            devotees, its maximum damage output decreases. A card with 3 HP can only deal 1-3 damage!
          </p>
        </div>
      </div>


      {/* Combat Sequence Diagram */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
          <span>📊</span>
          <span>Complete Combat Sequence</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Here's a step-by-step breakdown of how a complete combat encounter unfolds from start 
          to finish. Follow along to understand the full battle flow!
        </p>
        
        {/* Step-by-Step Combat */}
        <div className="space-y-3 max-w-2xl mx-auto mt-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="flex-1 p-4 bg-blue-900/20 rounded-lg border-2 border-blue-500/30">
              <div className="font-bold text-blue-400 mb-1">Pre-Combat Phase</div>
              <p className="text-sm text-slate-300">
                Pre-combat abilities trigger (FirstStrike, Reinforcements, SiegeMaster, Spartan). 
                Stats may be modified and turn order is determined.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="flex-1 p-4 bg-amber-900/20 rounded-lg border-2 border-amber-500/30">
              <div className="font-bold text-amber-400 mb-1">First Attack</div>
              <p className="text-sm text-slate-300">
                The card that goes first attacks. Damage is calculated randomly (1 to current HP). 
                Precision ability may trigger for guaranteed maximum damage.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="flex-1 p-4 bg-red-900/20 rounded-lg border-2 border-red-500/30">
              <div className="font-bold text-red-400 mb-1">Counter Attack</div>
              <p className="text-sm text-slate-300">
                If the defender survives, they counter-attack with their own random damage. 
                The battle continues with alternating attacks.
              </p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              4
            </div>
            <div className="flex-1 p-4 bg-purple-900/20 rounded-lg border-2 border-purple-500/30">
              <div className="font-bold text-purple-400 mb-1">Post-Combat Phase</div>
              <p className="text-sm text-slate-300">
                After attacks, post-combat abilities trigger (TacticalRetreat, LastStand). 
                These can save a card from defeat or deal finishing damage.
              </p>
            </div>
          </div>
          
          {/* Step 5 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              5
            </div>
            <div className="flex-1 p-4 bg-green-900/20 rounded-lg border-2 border-green-500/30">
              <div className="font-bold text-green-400 mb-1">Victory Check</div>
              <p className="text-sm text-slate-300">
                If one card reaches 0 devotees, combat ends. If both cards survive, return to 
                step 2 and continue the battle until there's a winner!
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* HP Bar Visualization */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-green-900/20 to-slate-800/80 border-2 border-green-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-green-400 flex items-center gap-2">
          <span>❤️</span>
          <span>HP Bar Visualization</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          During combat, you can track each card's health through visual HP bars. Watch as devotees 
          fall in battle and see who will emerge victorious!
        </p>
        
        {/* HP Bar Examples */}
        <div className="space-y-6 max-w-2xl mx-auto mt-4">
          {/* Full Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-semibold">Zeus (West)</span>
              <span className="text-green-400 font-bold">10/10 HP</span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-full flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">Full Health</span>
              </div>
            </div>
          </div>
          
          {/* Moderate Damage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-semibold">Odin (East)</span>
              <span className="text-amber-400 font-bold">6/10 HP</span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 w-[60%] flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">Wounded</span>
              </div>
            </div>
          </div>
          
          {/* Heavy Damage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-semibold">Thor (West)</span>
              <span className="text-orange-400 font-bold">3/10 HP</span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 w-[30%] flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">Critical</span>
              </div>
            </div>
          </div>
          
          {/* Near Death */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-semibold">Ra (East)</span>
              <span className="text-red-400 font-bold">1/10 HP</span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 w-[10%] flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white drop-shadow-lg">!</span>
              </div>
            </div>
          </div>
          
          {/* Defeated */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-semibold line-through">Anubis (East)</span>
              <span className="text-slate-500 font-bold">0/10 HP</span>
            </div>
            <div className="h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <div className="h-full bg-slate-600 w-0 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-400">Defeated</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-green-900/20 rounded-lg border border-green-500/30 mt-4">
          <div className="text-2xl">📊</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-green-400">Visual Feedback:</strong> HP bars change color 
            from green (healthy) to red (critical) as cards take damage. Watch for the pulsing 
            animation when a card is near defeat!
          </p>
        </div>
      </div>


      {/* Combat Until Zero */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-600">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🔄</span>
          <span>Combat Continues Until Zero</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Combat is a battle of endurance. Cards exchange blows turn after turn until one deity's 
          devotees are completely depleted. The survivor claims victory for their faction!
        </p>
        
        {/* Combat Example Timeline */}
        <div className="space-y-3 max-w-2xl mx-auto mt-4">
          <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-slate-600">
            <h4 className="font-bold text-center text-purple-400 mb-4">Example Combat Timeline</h4>
            
            <div className="space-y-3">
              {/* Turn 1 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 px-3 py-1 bg-blue-900/50 rounded-full border border-blue-500">
                  <span className="text-xs font-bold text-blue-400">Turn 1</span>
                </div>
                <div className="flex-1 text-sm text-slate-300">
                  Zeus attacks Odin for <span className="text-red-400 font-bold">5 damage</span>
                  <div className="text-xs text-slate-400 mt-1">Odin: 10 → 5 HP</div>
                </div>
              </div>
              
              {/* Turn 2 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 px-3 py-1 bg-red-900/50 rounded-full border border-red-500">
                  <span className="text-xs font-bold text-red-400">Turn 2</span>
                </div>
                <div className="flex-1 text-sm text-slate-300">
                  Odin counters Zeus for <span className="text-red-400 font-bold">3 damage</span>
                  <div className="text-xs text-slate-400 mt-1">Zeus: 10 → 7 HP</div>
                </div>
              </div>
              
              {/* Turn 3 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 px-3 py-1 bg-blue-900/50 rounded-full border border-blue-500">
                  <span className="text-xs font-bold text-blue-400">Turn 3</span>
                </div>
                <div className="flex-1 text-sm text-slate-300">
                  Zeus attacks Odin for <span className="text-red-400 font-bold">4 damage</span>
                  <div className="text-xs text-slate-400 mt-1">Odin: 5 → 1 HP (Critical!)</div>
                </div>
              </div>
              
              {/* Turn 4 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 px-3 py-1 bg-red-900/50 rounded-full border border-red-500">
                  <span className="text-xs font-bold text-red-400">Turn 4</span>
                </div>
                <div className="flex-1 text-sm text-slate-300">
                  Odin attacks Zeus for <span className="text-red-400 font-bold">1 damage</span>
                  <div className="text-xs text-slate-400 mt-1">Zeus: 7 → 6 HP (low damage roll)</div>
                </div>
              </div>
              
              {/* Final Turn */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 px-3 py-1 bg-green-900/50 rounded-full border border-green-500">
                  <span className="text-xs font-bold text-green-400">Final</span>
                </div>
                <div className="flex-1 text-sm text-slate-300">
                  Zeus delivers the finishing blow for <span className="text-red-400 font-bold">1 damage</span>
                  <div className="text-xs text-green-400 mt-1 font-semibold">Odin: 1 → 0 HP - Zeus Wins! 🏆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 mt-4">
          <div className="text-2xl">⚔️</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-amber-400">Remember:</strong> Combat can last many turns! 
            Cards with higher HP have more staying power, but lucky damage rolls can turn the 
            tide at any moment.
          </p>
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
              <span>Combat flows through three phases: Pre-Combat, During Combat, and Post-Combat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Turn order is random (50/50) unless FirstStrike ability is active (70% chance)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Damage is random, ranging from 1 to the attacker's current HP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>HP bars provide visual feedback on card health during battle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Combat continues with alternating attacks until one card reaches 0 devotees</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Abilities can trigger at different phases to change the outcome of battle</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

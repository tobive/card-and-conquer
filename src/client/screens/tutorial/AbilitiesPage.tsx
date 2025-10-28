import React from 'react';

/**
 * AbilitiesPage - Tutorial page explaining all card abilities
 * Organized by combat phase with detailed descriptions
 */
export const AbilitiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">
          ✨ Card Abilities
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          Master these 7 tactical abilities to dominate the battlefield
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-slate-700">
        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
          Each card may have one special ability that triggers during combat. Abilities are
          organized by when they activate: before combat begins, during the fight, or after
          combat ends. Understanding these abilities is key to building winning strategies.
        </p>
      </div>

      {/* Pre-Combat Abilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
            PRE-COMBAT
          </div>
          <p className="text-slate-400 text-xs md:text-sm">Trigger before combat begins</p>
        </div>

        {/* FirstStrike */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">⚡</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-1">
                FirstStrike
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                70% chance to attack first
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Gain initiative in combat, potentially defeating enemies before they can strike
                back. When this ability triggers, your card attacks first regardless of normal
                turn order.
              </p>
            </div>
          </div>
        </div>

        {/* Reinforcements */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">🛡️</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-1">
                Reinforcements
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                +2 devotees at combat start
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Receive reinforcements before the battle begins, increasing your card's devotee
                count by 2. This extra health can be the difference between victory and defeat.
              </p>
            </div>
          </div>
        </div>

        {/* SiegeMaster */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">🏰</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-1">
                SiegeMaster
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                +3 devotees in cities and fortresses
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Specialized in urban warfare. When fighting in City or Fortress maps, gain +3
                devotees before combat begins. This ability is map-dependent and only activates
                in the right terrain.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded text-xs font-semibold">
                  🏙️ CITY
                </span>
                <span className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded text-xs font-semibold">
                  🏰 FORTRESS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spartan */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">💪</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-1">
                Spartan
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                +1 minimum damage dealt
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Elite training ensures every strike counts. Your card deals a minimum of 1 damage
                per attack, even when the random damage roll would normally deal 0. Consistent
                damage output makes Spartans reliable fighters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* During Combat Abilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
            DURING COMBAT
          </div>
          <p className="text-slate-400 text-xs md:text-sm">Trigger during the fight</p>
        </div>

        {/* Precision */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-red-500/30 hover:border-red-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">🎯</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-red-400 mb-1">
                Precision
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                Deal exact devotee count as damage
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Perfect accuracy eliminates randomness. Instead of rolling for damage, your card
                deals damage equal to its current devotee count. High-devotee cards with Precision
                become devastating weapons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Combat Abilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
            POST-COMBAT
          </div>
          <p className="text-slate-400 text-xs md:text-sm">Trigger after combat ends</p>
        </div>

        {/* TacticalRetreat */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-500/30 hover:border-blue-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">🏃</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-1">
                TacticalRetreat
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                Survive with 1 devotee if defeated
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                When your card would be reduced to 0 devotees, it survives with 1 devotee instead
                and the combat ends immediately. This ability can only trigger once per combat,
                giving your card a second chance at survival.
              </p>
            </div>
          </div>
        </div>

        {/* LastStand */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-500/30 hover:border-blue-500/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-3xl md:text-4xl">⚔️</div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-1">
                LastStand
              </h3>
              <p className="text-amber-300 text-sm md:text-base font-semibold mb-2">
                Deal 2 damage when defeated
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Even in defeat, your card strikes one final blow. When reduced to 0 devotees,
                your card deals 2 damage to the opponent before falling. A warrior's last stand
                can turn the tide of battle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="bg-amber-900/20 backdrop-blur-sm rounded-lg p-4 border-2 border-amber-400/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-400 mb-2">Strategic Tips</h3>
            <ul className="space-y-2 text-slate-300 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>
                  <strong className="text-amber-300">Ability Synergy:</strong> Combine
                  Reinforcements or SiegeMaster with Precision for massive damage output
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>
                  <strong className="text-amber-300">Map Awareness:</strong> Check the battle
                  location before placing SiegeMaster cards for maximum effectiveness
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>
                  <strong className="text-amber-300">Defensive Play:</strong> TacticalRetreat
                  cards are excellent for surviving tough matchups
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>
                  <strong className="text-amber-300">Aggressive Play:</strong> FirstStrike and
                  LastStand maximize damage potential in favorable matchups
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border-2 border-slate-700">
        <h3 className="text-lg font-bold text-amber-400 mb-3 text-center">
          Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 px-2 text-slate-300">Ability</th>
                <th className="text-left py-2 px-2 text-slate-300">Phase</th>
                <th className="text-left py-2 px-2 text-slate-300">Effect</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">⚡ FirstStrike</td>
                <td className="py-2 px-2">
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                    Pre
                  </span>
                </td>
                <td className="py-2 px-2">70% attack first</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">🛡️ Reinforcements</td>
                <td className="py-2 px-2">
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                    Pre
                  </span>
                </td>
                <td className="py-2 px-2">+2 devotees</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">🏰 SiegeMaster</td>
                <td className="py-2 px-2">
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                    Pre
                  </span>
                </td>
                <td className="py-2 px-2">+3 devotees (City/Fortress)</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">💪 Spartan</td>
                <td className="py-2 px-2">
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                    Pre
                  </span>
                </td>
                <td className="py-2 px-2">+1 min damage</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">🎯 Precision</td>
                <td className="py-2 px-2">
                  <span className="bg-red-600/30 text-red-300 px-2 py-0.5 rounded text-xs">
                    During
                  </span>
                </td>
                <td className="py-2 px-2">Damage = devotees</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-2">🏃 TacticalRetreat</td>
                <td className="py-2 px-2">
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs">
                    Post
                  </span>
                </td>
                <td className="py-2 px-2">Survive with 1</td>
              </tr>
              <tr>
                <td className="py-2 px-2">⚔️ LastStand</td>
                <td className="py-2 px-2">
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs">
                    Post
                  </span>
                </td>
                <td className="py-2 px-2">Deal 2 when defeated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

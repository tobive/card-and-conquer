import React from 'react';

export const LeaderboardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">🏆 Leaderboards & Hall of Fame</h2>
        <p className="text-slate-300 text-lg">
          Track your achievements and compete for glory
        </p>
      </div>

      {/* Overview */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <p className="text-slate-200 text-center">
          Card & Conquer features <span className="font-semibold text-amber-400">two types of leaderboards</span>: 
          Current War Leaderboards for short-term competition and Hall of Fame for all-time legends.
        </p>
      </div>

      {/* Current Faction Leaderboards */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
          <span>⚔️</span>
          <span>Current War Leaderboards</span>
        </h3>
        <p className="text-slate-200 mb-4">
          Track wins in the <span className="font-semibold text-amber-300">active war</span>. These leaderboards reset when a faction wins the war (reaches ±6 on the slider).
        </p>

        {/* Current Leaderboard Mockups */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* West Leaderboard */}
          <div className="bg-slate-900/60 rounded-lg p-4 border-2 border-blue-400/40">
            <h4 className="font-semibold text-blue-400 mb-3 text-center flex items-center justify-center gap-2">
              <span>🛡️</span>
              <span>West Faction</span>
            </h4>
            <div className="space-y-2">
              {/* Rank 1 */}
              <div className="flex items-center gap-3 bg-amber-900/20 rounded-lg p-2 border border-amber-400/30">
                <span className="text-2xl">🥇</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/WarriorKing</p>
                  <p className="text-slate-400 text-xs">12 wins</p>
                </div>
              </div>
              {/* Rank 2 */}
              <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2 border border-slate-600">
                <span className="text-2xl">🥈</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/ShieldMaiden</p>
                  <p className="text-slate-400 text-xs">10 wins</p>
                </div>
              </div>
              {/* Rank 3 */}
              <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2 border border-slate-600">
                <span className="text-2xl">🥉</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/Defender</p>
                  <p className="text-slate-400 text-xs">9 wins</p>
                </div>
              </div>
              {/* Other ranks */}
              <div className="flex items-center gap-3 bg-slate-800/20 rounded-lg p-2">
                <span className="text-slate-500 font-semibold text-sm w-6">4</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">u/Guardian</p>
                  <p className="text-slate-500 text-xs">7 wins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/20 rounded-lg p-2">
                <span className="text-slate-500 font-semibold text-sm w-6">5</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">u/Paladin</p>
                  <p className="text-slate-500 text-xs">6 wins</p>
                </div>
              </div>
            </div>
          </div>

          {/* East Leaderboard */}
          <div className="bg-slate-900/60 rounded-lg p-4 border-2 border-purple-400/40">
            <h4 className="font-semibold text-purple-400 mb-3 text-center flex items-center justify-center gap-2">
              <span>⚡</span>
              <span>East Faction</span>
            </h4>
            <div className="space-y-2">
              {/* Rank 1 */}
              <div className="flex items-center gap-3 bg-amber-900/20 rounded-lg p-2 border border-amber-400/30">
                <span className="text-2xl">🥇</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/DragonEmperor</p>
                  <p className="text-slate-400 text-xs">15 wins</p>
                </div>
              </div>
              {/* Rank 2 */}
              <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2 border border-slate-600">
                <span className="text-2xl">🥈</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/PhoenixRider</p>
                  <p className="text-slate-400 text-xs">11 wins</p>
                </div>
              </div>
              {/* Rank 3 */}
              <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2 border border-slate-600">
                <span className="text-2xl">🥉</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-semibold text-sm">u/TigerClaw</p>
                  <p className="text-slate-400 text-xs">9 wins</p>
                </div>
              </div>
              {/* Other ranks */}
              <div className="flex items-center gap-3 bg-slate-800/20 rounded-lg p-2">
                <span className="text-slate-500 font-semibold text-sm w-6">4</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">u/Samurai</p>
                  <p className="text-slate-500 text-xs">8 wins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/20 rounded-lg p-2">
                <span className="text-slate-500 font-semibold text-sm w-6">5</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">u/Ninja</p>
                  <p className="text-slate-500 text-xs">7 wins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
          <p className="text-slate-200 text-sm">
            <span className="font-semibold text-blue-400">⚠️ Resets on War Victory:</span> When a faction reaches ±6 on the war slider, 
            these leaderboards reset to zero for the next war.
          </p>
        </div>
      </div>

      {/* Hall of Fame */}
      <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-amber-400/50">
        <h3 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-2">
          <span>👑</span>
          <span>Hall of Fame - All-Time Legends</span>
        </h3>
        <p className="text-slate-200 mb-4">
          The Hall of Fame tracks <span className="font-semibold text-amber-300">all-time faction points</span> across every session you've ever played. 
          These points <span className="font-semibold text-purple-300">never reset</span> - your legacy is permanent!
        </p>

        {/* Three Hall of Fame Boards */}
        <div className="space-y-4">
          {/* East Champions */}
          <div className="bg-slate-900/60 rounded-lg p-4 border-2 border-purple-400/40">
            <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <span>⚡</span>
              <span>East Champions</span>
              <span className="text-xs text-slate-400 font-normal">(All-time East faction points)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Top 3 */}
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-400/30 text-center">
                <div className="text-2xl mb-1">🥇</div>
                <p className="text-slate-200 font-semibold text-sm">u/EastLegend</p>
                <p className="text-purple-400 font-bold text-lg">1,247</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-slate-200 font-semibold text-sm">u/DragonMaster</p>
                <p className="text-purple-400 font-bold text-lg">1,089</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-slate-200 font-semibold text-sm">u/PhoenixKing</p>
                <p className="text-purple-400 font-bold text-lg">956</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
            </div>
          </div>

          {/* West Champions */}
          <div className="bg-slate-900/60 rounded-lg p-4 border-2 border-blue-400/40">
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>🛡️</span>
              <span>West Champions</span>
              <span className="text-xs text-slate-400 font-normal">(All-time West faction points)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Top 3 */}
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-400/30 text-center">
                <div className="text-2xl mb-1">🥇</div>
                <p className="text-slate-200 font-semibold text-sm">u/WestHero</p>
                <p className="text-blue-400 font-bold text-lg">1,523</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-slate-200 font-semibold text-sm">u/KnightCommander</p>
                <p className="text-blue-400 font-bold text-lg">1,312</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-slate-200 font-semibold text-sm">u/Crusader</p>
                <p className="text-blue-400 font-bold text-lg">1,198</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
            </div>
          </div>

          {/* Combined Power */}
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-4 border-2 border-amber-400/60">
            <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <span>⚔️</span>
              <span>Combined Power</span>
              <span className="text-xs text-slate-400 font-normal">(Total East + West points)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Top 3 */}
              <div className="bg-amber-900/30 rounded-lg p-3 border-2 border-amber-400/50 text-center">
                <div className="text-2xl mb-1">🥇</div>
                <p className="text-slate-200 font-semibold text-sm">u/Conqueror</p>
                <p className="text-amber-400 font-bold text-lg">2,891</p>
                <p className="text-slate-500 text-xs">total points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-slate-200 font-semibold text-sm">u/Warlord</p>
                <p className="text-amber-400 font-bold text-lg">2,634</p>
                <p className="text-slate-500 text-xs">total points</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-600 text-center">
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-slate-200 font-semibold text-sm">u/Champion</p>
                <p className="text-amber-400 font-bold text-lg">2,401</p>
                <p className="text-slate-500 text-xs">total points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>Current vs Hall of Fame</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Current Leaderboards */}
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
            <h4 className="font-semibold text-blue-400 mb-3 text-center">⚔️ Current War</h4>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Tracks wins in active war</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Separate East and West boards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Resets when war ends (±6 slider)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Short-term competition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Fresh start each war</span>
              </li>
            </ul>
          </div>

          {/* Hall of Fame */}
          <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-400/30">
            <h4 className="font-semibold text-amber-400 mb-3 text-center">👑 Hall of Fame</h4>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Tracks all-time faction points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Three boards (East, West, Combined)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span><strong>Never resets</strong> - permanent legacy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Long-term achievement tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Accumulates across all sessions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Climb Leaderboards */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <span>📈</span>
          <span>How to Climb the Leaderboards</span>
        </h3>
        
        <div className="space-y-3">
          <div className="bg-slate-900/60 rounded-lg p-4">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>⚔️</span>
              <span>Current War Leaderboards</span>
            </h4>
            <p className="text-slate-200 text-sm">
              Win battles for your chosen faction during the active war. Each win counts as +1 on the leaderboard. 
              Focus on one faction per war to maximize your ranking!
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-4">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>👑</span>
              <span>Hall of Fame</span>
            </h4>
            <p className="text-slate-200 text-sm mb-2">
              Earn faction points by winning battles. Each win adds +1 faction point to your all-time total for that faction.
            </p>
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-400/30">
              <p className="text-purple-300 text-sm font-semibold mb-1">Pro Strategy:</p>
              <p className="text-slate-300 text-xs">
                Play consistently across many sessions to build your Hall of Fame legacy. 
                Every battle win contributes to your permanent record!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medal Icons Reference */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-slate-700">
        <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>🏅</span>
          <span>Rank Medals</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-400/30">
            <div className="text-4xl mb-2">🥇</div>
            <p className="text-amber-400 font-bold">1st Place</p>
            <p className="text-slate-400 text-sm">Gold Medal</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-600">
            <div className="text-4xl mb-2">🥈</div>
            <p className="text-slate-300 font-bold">2nd Place</p>
            <p className="text-slate-400 text-sm">Silver Medal</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-600">
            <div className="text-4xl mb-2">🥉</div>
            <p className="text-slate-300 font-bold">3rd Place</p>
            <p className="text-slate-400 text-sm">Bronze Medal</p>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm text-center mt-4">
          Top 3 players receive special medal recognition on the leaderboards
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
            <span>Current leaderboards track wins in the active war and reset when it ends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Hall of Fame tracks all-time faction points and never resets</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Three Hall of Fame boards: East Champions, West Champions, and Combined Power</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Every battle win contributes to your permanent Hall of Fame legacy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Top 3 players on each board receive special medal recognition</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

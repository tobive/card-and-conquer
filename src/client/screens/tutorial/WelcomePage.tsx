import React from 'react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 animate-pulse" aria-hidden="true">⚔️</div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 bg-clip-text text-transparent px-4">
          Card & Conquer
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-semibold px-4">
          Choose your faction. Conquer the realm.
        </p>
      </div>

      {/* Faction Warfare Concept */}
      <div className="card p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">🏴</span>
          <span>Faction Warfare</span>
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
          Welcome to an epic battle between two mighty factions competing for dominance! 
          Choose your side and fight in strategic card battles to tip the scales of war.
        </p>
      </div>

      {/* Faction Representations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* West Faction */}
        <div className="card p-4 sm:p-5 lg:p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-slate-800/80 hover:border-blue-400/50 transition-all touch-manipulation">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="text-4xl sm:text-5xl mb-2" aria-hidden="true">🛡️</div>
            <h4 className="text-xl sm:text-2xl font-bold text-blue-400">West Faction</h4>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span>Azure & Silver</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Champions of strategy and honor, the West faction fights with disciplined tactics 
              and unwavering resolve.
            </p>
          </div>
        </div>

        {/* East Faction */}
        <div className="card p-4 sm:p-5 lg:p-6 border-2 border-red-500/30 bg-gradient-to-br from-red-900/20 to-slate-800/80 hover:border-red-400/50 transition-all touch-manipulation">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="text-4xl sm:text-5xl mb-2" aria-hidden="true">⚡</div>
            <h4 className="text-xl sm:text-2xl font-bold text-red-400">East Faction</h4>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-600 shadow-lg shadow-red-600/50"></div>
              <span>Crimson & Gold</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Masters of power and ambition, the East faction strikes with fierce determination 
              and relentless force.
            </p>
          </div>
        </div>
      </div>

      {/* Win Condition */}
      <div className="card p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">🏆</span>
          <span>Victory Condition</span>
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
          The fate of the realm is decided by the <strong className="text-amber-400">War Slider</strong>. 
          Each battle victory pushes the slider toward your faction. 
          Be the first to reach <strong className="text-amber-400">±6</strong> and claim victory for your faction!
        </p>
        
        {/* War Slider Visualization */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold px-1">
            <span className="text-blue-400">West -6</span>
            <span className="text-slate-400">0</span>
            <span className="text-red-400">East +6</span>
          </div>
          <div className="relative h-6 sm:h-8 bg-slate-700/50 rounded-full overflow-hidden border-2 border-slate-600">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-slate-700 to-red-600 opacity-50"></div>
            
            {/* Center marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-slate-400 transform -translate-x-1/2"></div>
            
            {/* Victory zones */}
            <div className="absolute left-0 top-0 bottom-0 w-1/6 bg-blue-500/30 border-r-2 border-blue-400/50"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/6 bg-red-500/30 border-l-2 border-red-400/50"></div>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400">
            <span>🎯</span>
            <span>Push the slider to ±6 to win the war!</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-3 sm:space-y-4 py-3 sm:py-4">
        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg shadow-lg touch-manipulation" role="note" aria-label="Tutorial navigation hint" style={{ minHeight: '44px' }}>
          <span className="text-xl sm:text-2xl" aria-hidden="true">📖</span>
          <span className="text-base sm:text-lg font-bold text-white">Let's learn how to play!</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 px-4">
          <span className="hidden sm:inline">Swipe through the tutorial to master the game mechanics</span>
          <span className="sm:hidden">Tap Next to continue</span>
        </p>
      </div>
    </div>
  );
};

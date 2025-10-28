import React from 'react';

export const StrategyPage: React.FC = () => {
  const tips = [
    {
      icon: '🎮',
      title: 'Faction Loyalty Strategy',
      description:
        'Stick with one faction per session to maximize your +500 coin bonuses. Every win with your favored faction earns you an extra 500 coins, which adds up quickly over multiple battles.',
    },
    {
      icon: '💼',
      title: 'Balance Your Collection',
      description:
        'Collect cards from both factions for flexibility. While loyalty pays off, having strong cards on both sides lets you adapt to battle opportunities and join any faction when needed.',
    },
    {
      icon: '✨',
      title: 'Master Ability Synergy',
      description:
        'Abilities can turn the tide of battle. FirstStrike and Reinforcements give early advantages, while LastStand and TacticalRetreat provide comebacks. Learn which abilities counter each other.',
    },
    {
      icon: '🗺️',
      title: 'Map Awareness Matters',
      description:
        'SiegeMaster dominates on City and Fortress maps with +3 devotees. Check the map type before joining battles and prioritize SiegeMaster cards when the terrain favors them.',
    },
    {
      icon: '⏰',
      title: 'Timing is Everything',
      description:
        'Join battles early to maximize your impact. Early placement means more combat rounds and better chances to influence the outcome. Don\'t wait until battles are nearly full.',
    },
    {
      icon: '🏆',
      title: 'Build Your Hall of Fame Legacy',
      description:
        'Every battle adds to your all-time faction points in the Hall of Fame. These points never reset, so consistent play builds your permanent legacy. Focus on one faction to climb higher.',
    },
    {
      icon: '🎨',
      title: 'Collect Rare Variants',
      description:
        'Variant collection showcases your dedication. While purely cosmetic, rare variants (especially Legendary) demonstrate prestige. Use multi-pulls to increase your chances of finding alternates.',
    },
    {
      icon: '🔄',
      title: 'Session Completion Strategy',
      description:
        'Complete sessions strategically to reset your level and start fresh. Your collection and Hall of Fame points are preserved, but you\'ll return to Level 1 with new opportunities for faction bonuses.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400">
          💡 Strategy Tips
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          Master these strategies to dominate the battlefield and climb the leaderboards
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-4 hover:border-amber-400/30 transition-all duration-300"
          >
            {/* Tip Header */}
            <div className="flex items-start gap-3 mb-2">
              <div className="text-3xl flex-shrink-0">{tip.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-400 mb-1">
                  {tip.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info Box */}
      <div className="bg-purple-900/20 border-2 border-purple-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-purple-400 mb-1">
              Pro Tip: Combine Strategies
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The most successful players combine multiple strategies. Focus on faction
              loyalty for bonuses, build a balanced collection for flexibility, and time
              your battles strategically. Your Hall of Fame legacy grows with every
              battle!
            </p>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-amber-900/20 border-2 border-amber-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📝</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-400 mb-2">
              Key Takeaways
            </h3>
            <ul className="space-y-1 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Faction loyalty = more coins (+500 per favored faction win)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Balanced collection = more battle opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Ability knowledge = tactical advantages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Early battle participation = greater impact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Hall of Fame points = permanent legacy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

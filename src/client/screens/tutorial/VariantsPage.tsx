import React from 'react';

export const VariantsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="text-5xl sm:text-6xl mb-3">🎨</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-400">
          Card Variants & Customization
        </h2>
        <p className="text-base sm:text-lg text-slate-300">
          Collect rare artwork and customize your card display
        </p>
      </div>

      {/* Cosmetic Only Notice */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-blue-900/20 to-slate-800/80 border-2 border-blue-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-400 flex items-center gap-2">
          <span>ℹ️</span>
          <span>Variants Are Cosmetic Only</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Card variants are purely visual - they don't affect stats, abilities, or battle performance. 
          All variants of the same card have identical devotees (HP) and abilities. Variants are about 
          showcasing your collection and personal style!
        </p>
        
        <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 mt-4">
          <div className="text-2xl">⚖️</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-blue-400">Fair Play:</strong> Whether you use a common base variant or 
            a legendary alternate, your card performs exactly the same in battle. Collect for prestige, not power!
          </p>
        </div>
      </div>

      {/* Four Rarity Tiers */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 text-center">
          Rarity Tiers
        </h3>
        <p className="text-center text-sm text-slate-400 max-w-2xl mx-auto">
          Each card variant has a rarity tier that determines how often it appears in gacha pulls. 
          Rarer variants are harder to find but showcase your dedication as a collector.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Common */}
          <div className="card p-5 sm:p-6 border-2 border-slate-500/30 bg-gradient-to-br from-slate-700/40 to-slate-800/80 hover:border-slate-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">⚪</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-200">Common</h4>
                  <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
                    Base
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Standard artwork that appears most frequently. Every card starts with a common base variant.
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Drop Rate: <span className="text-slate-200 font-semibold">Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rare */}
          <div className="card p-5 sm:p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-slate-800/80 hover:border-blue-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">🔵</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg sm:text-xl font-bold text-blue-400">Rare</h4>
                  <span className="px-2 py-0.5 bg-blue-900/50 rounded text-xs text-blue-300 border border-blue-500/50">
                    Alternate
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Special artwork with unique styling. Less common than base variants but still obtainable.
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Drop Rate: <span className="text-blue-400 font-semibold">10x Rarer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Epic */}
          <div className="card p-5 sm:p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-800/80 hover:border-purple-400/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">🟣</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg sm:text-xl font-bold text-purple-400">Epic</h4>
                  <span className="px-2 py-0.5 bg-purple-900/50 rounded text-xs text-purple-300 border border-purple-500/50">
                    Alternate
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Impressive artwork that stands out. A prized addition to any collection.
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Drop Rate: <span className="text-purple-400 font-semibold">10x Rarer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legendary */}
          <div className="card p-5 sm:p-6 border-2 border-amber-500/50 bg-gradient-to-br from-amber-900/30 to-slate-800/80 hover:border-amber-400/70 transition-all shadow-lg shadow-amber-500/20">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">🟡</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg sm:text-xl font-bold text-amber-400">Legendary</h4>
                  <span className="px-2 py-0.5 bg-amber-900/50 rounded text-xs text-amber-300 border border-amber-500/50 font-semibold">
                    Alternate
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Breathtaking artwork that's extremely rare. The ultimate collector's prize!
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Drop Rate: <span className="text-amber-400 font-semibold">10x Rarer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10x Rarity Explanation */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
          <span>✨</span>
          <span>10x Rarity for Alternates</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          All alternate variants (Rare, Epic, and Legendary) are <strong className="text-purple-400">10 times rarer</strong> than 
          the base common variant. This means when you pull a card, you're much more likely to get the base artwork.
        </p>
        
        {/* Rarity Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="text-center mb-3">
              <div className="text-3xl mb-2">🖼️</div>
              <div className="font-bold text-slate-200">Base Variant</div>
              <div className="text-xs text-slate-400 mt-1">Common Rarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">90%</div>
              <div className="text-xs text-slate-400">of pulls</div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/50">
            <div className="text-center mb-3">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-bold text-purple-300">Alternate Variants</div>
              <div className="text-xs text-purple-400 mt-1">Rare / Epic / Legendary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">10%</div>
              <div className="text-xs text-slate-400">of pulls (combined)</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 mt-4">
          <div className="text-2xl">🎲</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-purple-400">Collector's Challenge:</strong> Finding all variants of your 
            favorite deity is a true test of dedication. Keep pulling to complete your collection!
          </p>
        </div>
      </div>

      {/* Side-by-Side Variant Comparison */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 text-center">
          Variant Comparison Example
        </h3>
        <p className="text-center text-sm text-slate-400 max-w-2xl mx-auto">
          Here's how different variants of the same card look side-by-side. Same stats, different style!
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {/* Base Variant */}
          <div className="space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border-2 border-slate-600 flex flex-col items-center justify-center p-3">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-200">Zeus</div>
                <div className="text-xs text-slate-400 mt-1">300,000 devotees</div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
                ⚪ Common
              </span>
            </div>
          </div>

          {/* Rare Variant */}
          <div className="space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg border-2 border-blue-500 flex flex-col items-center justify-center p-3 shadow-md shadow-blue-500/30">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-center">
                <div className="text-sm font-bold text-blue-200">Zeus</div>
                <div className="text-xs text-blue-300 mt-1">300,000 devotees</div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-blue-900/50 rounded text-xs text-blue-300 border border-blue-500/50">
                🔵 Rare
              </span>
            </div>
          </div>

          {/* Epic Variant */}
          <div className="space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg border-2 border-purple-500 flex flex-col items-center justify-center p-3 shadow-md shadow-purple-500/30">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-center">
                <div className="text-sm font-bold text-purple-200">Zeus</div>
                <div className="text-xs text-purple-300 mt-1">300,000 devotees</div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-purple-900/50 rounded text-xs text-purple-300 border border-purple-500/50">
                🟣 Epic
              </span>
            </div>
          </div>

          {/* Legendary Variant */}
          <div className="space-y-2">
            <div className="aspect-[2/3] bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg border-2 border-amber-400 flex flex-col items-center justify-center p-3 shadow-lg shadow-amber-500/40">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-center">
                <div className="text-sm font-bold text-amber-100">Zeus</div>
                <div className="text-xs text-amber-200 mt-1">300,000 devotees</div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-amber-900/50 rounded text-xs text-amber-300 border border-amber-500/50 font-semibold">
                🟡 Legendary
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600 mt-4">
          <p className="text-sm text-slate-300">
            <strong className="text-amber-400">Same Card, Different Look:</strong> All four variants have 
            identical stats (300,000 devotees) and abilities. Choose your favorite style!
          </p>
        </div>
      </div>

      {/* Variant Selection in Collection */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-amber-900/20 to-slate-800/80 border-2 border-amber-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>🎯</span>
          <span>Selecting Your Preferred Variant</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Once you've collected multiple variants of a card, you can choose which one to display in battles 
          and your collection. Your selected variant is what other players will see when you use that card.
        </p>
        
        {/* Selection Steps */}
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="text-2xl flex-shrink-0">1️⃣</div>
            <div>
              <div className="font-bold text-slate-200 mb-1">Open Your Collection</div>
              <div className="text-sm text-slate-400">Navigate to the Collection screen from the main menu</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="text-2xl flex-shrink-0">2️⃣</div>
            <div>
              <div className="font-bold text-slate-200 mb-1">Select a Card</div>
              <div className="text-sm text-slate-400">Tap on any card you own to view its details</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="text-2xl flex-shrink-0">3️⃣</div>
            <div>
              <div className="font-bold text-slate-200 mb-1">Choose Your Variant</div>
              <div className="text-sm text-slate-400">Browse available variants and select your favorite</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-900/30 rounded-lg border border-amber-500/50">
            <div className="text-2xl flex-shrink-0">✓</div>
            <div>
              <div className="font-bold text-amber-300 mb-1">Done!</div>
              <div className="text-sm text-amber-200">Your selected variant will now appear in all battles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection View Modes */}
      <div className="card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-purple-900/20 to-slate-800/80 border-2 border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
          <span>👁️</span>
          <span>Collection View Modes</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The collection screen offers two different view modes to help you track your progress and showcase 
          your variants.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Base Cards View */}
          <div className="p-5 bg-slate-700/40 rounded-lg border-2 border-slate-600 hover:border-slate-500 transition-all">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎴</div>
              <h4 className="text-lg font-bold text-slate-200">Base Cards View</h4>
              <div className="text-xs text-slate-400 mt-1">Default Mode</div>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Shows one card per deity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Displays your selected variant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Best for quick overview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Track unique cards collected</span>
              </li>
            </ul>
          </div>

          {/* All Variants View */}
          <div className="p-5 bg-purple-900/30 rounded-lg border-2 border-purple-500/50 hover:border-purple-400/70 transition-all">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎨</div>
              <h4 className="text-lg font-bold text-purple-300">All Variants View</h4>
              <div className="text-xs text-purple-400 mt-1">Collector Mode</div>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Shows all variant versions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>See rarity badges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Perfect for completionists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Track variant collection progress</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 mt-4">
          <div className="text-2xl">💡</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-purple-400">Pro Tip:</strong> Toggle between view modes using the button 
            at the top of the Collection screen. Use Base Cards view for quick reference, and All Variants 
            view to admire your complete collection!
          </p>
        </div>
      </div>

      {/* Rarity Badges Reference */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 text-center">
          Rarity Badge Reference
        </h3>
        <p className="text-center text-sm text-slate-400 max-w-2xl mx-auto">
          Look for these badges in your collection to identify variant rarities at a glance.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-4">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg border-2 border-slate-600">
            <div className="text-3xl mb-2">⚪</div>
            <div className="text-sm font-bold text-slate-200 mb-1">Common</div>
            <div className="text-xs text-slate-400">Base variant</div>
          </div>
          
          <div className="text-center p-4 bg-blue-900/30 rounded-lg border-2 border-blue-500/50">
            <div className="text-3xl mb-2">🔵</div>
            <div className="text-sm font-bold text-blue-400 mb-1">Rare</div>
            <div className="text-xs text-blue-300">10x rarer</div>
          </div>
          
          <div className="text-center p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/50">
            <div className="text-3xl mb-2">🟣</div>
            <div className="text-sm font-bold text-purple-400 mb-1">Epic</div>
            <div className="text-xs text-purple-300">10x rarer</div>
          </div>
          
          <div className="text-center p-4 bg-amber-900/30 rounded-lg border-2 border-amber-500/50 shadow-md shadow-amber-500/20">
            <div className="text-3xl mb-2">🟡</div>
            <div className="text-sm font-bold text-amber-400 mb-1">Legendary</div>
            <div className="text-xs text-amber-300">10x rarer</div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-purple-900/30 to-amber-900/30 rounded-lg border-2 border-purple-500/30">
        <div className="text-3xl">📝</div>
        <div className="flex-1 space-y-2">
          <h4 className="font-bold text-purple-400 text-lg">Key Takeaways</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Variants are cosmetic only - they don't affect card performance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Four rarity tiers: Common, Rare, Epic, and Legendary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Alternate variants are 10x rarer than base common variants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Select your preferred variant in the Collection screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Toggle between Base Cards and All Variants view modes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Collect rare variants to showcase your dedication and style!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

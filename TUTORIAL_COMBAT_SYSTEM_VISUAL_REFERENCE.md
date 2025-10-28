# Tutorial Task 6: Combat System Page - Visual Reference

## Overview
Implemented the Combat System tutorial page (Page 3) that explains the turn-based combat mechanics, damage system, and combat flow in Card & Conquer.

## Page Structure

### 1. Page Title
- Icon: ⚡ (Lightning bolt)
- Title: "Combat System"
- Subtitle: "Understanding how deities clash in battle"

### 2. Combat Overview
- Explains turn-based combat flow
- Introduces three combat phases
- Describes combat continuation until 0 devotees

### 3. Three Combat Phases Section
**Grid layout with three cards:**

#### Pre-Combat Phase (Blue theme)
- Icon: 🛡️
- Abilities listed:
  - ⚡ FirstStrike
  - 🛡️ Reinforcements
  - 🏰 SiegeMaster
  - 💪 Spartan
- Explains abilities trigger before attacks

#### During Combat Phase (Red theme)
- Icon: ⚔️
- Abilities listed:
  - 🎯 Precision
- Explains main damage exchange phase

#### Post-Combat Phase (Purple theme)
- Icon: 🌟
- Abilities listed:
  - 🏃 TacticalRetreat
  - ⚔️ LastStand
- Explains last-minute effects

### 4. Turn Order Determination (Amber theme)
- Icon: 🎲
- Flowchart visualization:
  - Combat Begins
  - FirstStrike Active? (70% chance) OR No FirstStrike (50/50)
  - Turn Order Set!
- Strategic tip about FirstStrike advantage

### 5. Random Damage System (Red theme)
- Icon: 💥
- Damage calculation example with Zeus vs Odin
- Shows damage range (1 to current HP)
- Possible outcomes visualization:
  - Low roll (1-3)
  - Mid roll (4-6)
  - High roll (7-8)
  - Max roll (8)
- Example result: 6 damage dealt
- Important note: Damage output decreases as HP decreases

### 6. Complete Combat Sequence (Purple theme)
- Icon: 📊
- Step-by-step breakdown:
  1. Pre-Combat Phase (Blue badge)
  2. First Attack (Amber badge)
  3. Counter Attack (Red badge)
  4. Post-Combat Phase (Purple badge)
  5. Victory Check (Green badge)

### 7. HP Bar Visualization (Green theme)
- Icon: ❤️
- Five HP bar examples:
  - **Full Health**: 10/10 HP (Green, 100%)
  - **Wounded**: 6/10 HP (Amber, 60%)
  - **Critical**: 3/10 HP (Orange, 30%)
  - **Near Death**: 1/10 HP (Red, 10%, pulsing)
  - **Defeated**: 0/10 HP (Gray, 0%)
- Color-coded feedback system

### 8. Combat Until Zero (Slate theme)
- Icon: 🔄
- Example combat timeline:
  - Turn 1: Zeus attacks Odin for 5 damage (10→5 HP)
  - Turn 2: Odin counters Zeus for 3 damage (10→7 HP)
  - Turn 3: Zeus attacks Odin for 4 damage (5→1 HP)
  - Turn 4: Odin attacks Zeus for 1 damage (7→6 HP)
  - Final: Zeus finishes Odin for 1 damage (1→0 HP) - Victory!
- Reminder about combat endurance

### 9. Key Takeaways
- Icon: 📝
- Six key points with checkmarks:
  - Three combat phases
  - Turn order mechanics
  - Random damage system
  - HP bar visual feedback
  - Combat continues until 0 HP
  - Abilities trigger at different phases

## Visual Design Elements

### Color Themes
- **Blue**: Pre-combat abilities and first attacker
- **Red**: During combat and damage
- **Purple**: Post-combat and system explanations
- **Amber**: Turn order and strategic tips
- **Green**: Victory and health status

### Interactive Elements
- Hover effects on phase cards
- Pulsing animation on critical HP
- Gradient backgrounds for emphasis
- Border highlights for important sections

### Layout Features
- Responsive grid layouts (1-3 columns)
- Card-based information blocks
- Step-by-step numbered sequences
- Visual flowcharts and diagrams
- Color-coded HP bars with percentages

## Requirements Satisfied

✅ **Requirement 6.1**: Explained turn-based combat flow (pre, during, post phases)
✅ **Requirement 6.2**: Described random damage system with devotee counts
✅ **Requirement 6.3**: Explained turn order determination (50/50 or FirstStrike)
✅ **Requirement 6.4**: Created visual combat sequence diagram
✅ **Requirement 6.5**: Added HP bar visualization examples

## Technical Implementation

### Component Location
- `src/client/screens/tutorial/CombatSystemPage.tsx`

### Integration
- Imported in `TutorialScreen.tsx`
- Rendered when `currentPage === 3`
- Follows same structure as other tutorial pages

### Styling
- Uses Tailwind CSS utility classes
- Consistent with game's design system
- Responsive breakpoints (mobile, tablet, desktop)
- Accessible color contrasts

## User Experience

### Information Flow
1. Introduction to combat system
2. Understanding three phases
3. Learning turn order mechanics
4. Grasping damage calculations
5. Following complete combat sequence
6. Visualizing health changes
7. Understanding combat duration
8. Key takeaways summary

### Visual Hierarchy
- Large icons for immediate recognition
- Color-coded sections for phase identification
- Progressive disclosure of complexity
- Examples before abstract concepts
- Summary at the end for reinforcement

## Mobile Optimization
- Single column layouts on small screens
- Touch-friendly spacing
- Readable font sizes (14px minimum)
- Stacked cards for better mobile viewing
- Responsive grid adjustments

## Accessibility Features
- Semantic HTML structure
- Descriptive text for all visual elements
- High contrast color combinations
- Clear visual hierarchy
- Logical reading order

## Next Steps
This completes Task 6. The next task (Task 7) will create the Card Abilities tutorial page (Page 4).

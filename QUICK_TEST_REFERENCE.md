# Quick Test Reference Card

## 🚀 Quick Start Testing

### Run Unit Tests
```bash
# Install test dependencies first
npm install -D jsdom @testing-library/react @testing-library/react-hooks

# Run all tests
npm test -- --run

# Run specific test file
npm test -- --run mythological-theme.test.ts
```

### Start Manual Testing
```bash
# Start dev server
npm run dev

# Open the playtest URL in your browser
# Follow TESTING_VERIFICATION_GUIDE.md
```

## 📋 Quick Verification Checklist

### ✅ Mythological Theme (5 min)
- [ ] No "White" or "Black" visible
- [ ] Shows "East" and "West" everywhere
- [ ] Cards show "devotees" not "soldiers"
- [ ] Faction colors distinct (red/gold vs blue/silver)

### ✅ Image Format (5 min)
- [ ] Open DevTools Network tab
- [ ] Navigate to Collection
- [ ] All images are .jpg (no .png)
- [ ] Placeholders work for missing cards

### ✅ Lazy Loading (5 min)
- [ ] Spinners appear while loading
- [ ] Spinners disappear when loaded
- [ ] Smooth scrolling with many cards
- [ ] Only visible cards load

### ✅ Bonus Gacha (10 min)
- [ ] Win a battle
- [ ] Check Gacha screen for bonus pull
- [ ] Use bonus pull
- [ ] Get faction-specific card
- [ ] Pull count decreases

### ✅ Statistics (10 min)
- [ ] Open User Stats from menu
- [ ] Check all stats display
- [ ] Do an action (battle/gacha)
- [ ] Return to stats
- [ ] Verify stats updated

### ✅ Data Migration (5 min)
- [ ] Old data still works
- [ ] No console errors
- [ ] Stats initialize for existing players
- [ ] Bonus gacha initializes

## 🎯 Critical Paths to Test

### Path 1: New Player Experience
1. Start game
2. Pull from gacha → Check stats updated
3. View collection → Check lazy loading
4. Create battle → Win it
5. Check bonus pull awarded
6. Use bonus pull → Get faction card

### Path 2: Existing Player
1. Load with old data
2. Check no errors
3. Verify stats show
4. Verify bonus gacha works

## 🐛 Common Issues to Watch For

- [ ] Console errors
- [ ] Broken images
- [ ] Incorrect faction names
- [ ] Stats not updating
- [ ] Bonus pulls not awarded
- [ ] Slow loading

## 📊 Test Files Location

```
src/
├── shared/__tests__/
│   ├── mythological-theme.test.ts
│   └── image-format.test.ts
├── client/__tests__/
│   └── lazy-loading.test.tsx
└── server/__tests__/
    ├── bonus-gacha.test.ts
    ├── statistics.test.ts
    └── data-migration.test.ts
```

## 📖 Full Documentation

- **Detailed Guide**: `TESTING_VERIFICATION_GUIDE.md`
- **Implementation Summary**: `TASK_15_TESTING_SUMMARY.md`
- **Test Config**: `vitest.config.ts`

## ⏱️ Estimated Testing Time

- Unit Tests: 2 minutes
- Quick Manual Check: 15 minutes
- Full Manual Testing: 45 minutes
- Complete Verification: 1 hour

## 🎉 When You're Done

- [ ] All unit tests pass
- [ ] All manual checks complete
- [ ] No critical issues found
- [ ] Document any issues in TESTING_VERIFICATION_GUIDE.md
- [ ] Mark spec as complete

---

**Need Help?** See `TESTING_VERIFICATION_GUIDE.md` for detailed procedures.

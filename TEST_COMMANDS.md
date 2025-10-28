# Test Commands Reference

## Setup

### Install Test Dependencies
```bash
npm install -D jsdom @testing-library/react @testing-library/react-hooks
```

### Add Test Script to package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest --run",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Running Tests

### Run All Tests Once
```bash
npm test -- --run
```

### Run Tests in Watch Mode
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- --run mythological-theme.test.ts
npm test -- --run image-format.test.ts
npm test -- --run lazy-loading.test.tsx
npm test -- --run bonus-gacha.test.ts
npm test -- --run statistics.test.ts
npm test -- --run data-migration.test.ts
```

### Run Tests by Pattern
```bash
# Run all shared tests
npm test -- --run src/shared/__tests__

# Run all server tests
npm test -- --run src/server/__tests__

# Run all client tests
npm test -- --run src/client/__tests__
```

### Run Tests with Coverage
```bash
npm test -- --run --coverage
```

## What Each Test File Verifies

### mythological-theme.test.ts
**Verifies**: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
- ✅ Faction enum has East/West (not White/Black)
- ✅ Faction themes return correct colors
- ✅ Cards have devotees property
- ✅ Cards use East/West factions
- ✅ Faction distribution is balanced

**Run**: `npm test -- --run mythological-theme.test.ts`

### image-format.test.ts
**Verifies**: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
- ✅ Base cards use .jpg paths
- ✅ Variant cards use .jpg paths
- ✅ Thumbnails use .jpg paths
- ✅ No .png extensions in paths
- ✅ Placeholders use .svg format
- ✅ Faction-specific placeholders exist

**Run**: `npm test -- --run image-format.test.ts`

### lazy-loading.test.tsx
**Verifies**: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
- ✅ Hook initializes correctly
- ✅ Loading states tracked
- ✅ Helper functions work
- ✅ IntersectionObserver created
- ✅ Cleanup on unmount
- ✅ Handles large card lists

**Run**: `npm test -- --run lazy-loading.test.tsx`

### bonus-gacha.test.ts
**Verifies**: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
- ✅ East victory awards East pull
- ✅ West victory awards West pull
- ✅ Total earned increments
- ✅ Pull count decrements on use
- ✅ Zero pulls prevented
- ✅ Faction-specific cards only
- ✅ Status tracked per faction
- ✅ Redis key format correct

**Run**: `npm test -- --run bonus-gacha.test.ts`

### statistics.test.ts
**Verifies**: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
- ✅ Total cards calculated correctly
- ✅ Unique cards calculated correctly
- ✅ Win rate calculated correctly
- ✅ Zero battles handled
- ✅ Battle tracking works
- ✅ Gacha tracking works
- ✅ Zero states for new players
- ✅ Redis key format correct

**Run**: `npm test -- --run statistics.test.ts`

### data-migration.test.ts
**Verifies**: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
- ✅ White maps to West
- ✅ Black maps to East
- ✅ Soldiers/devotees compatibility
- ✅ Bonus gacha initializes
- ✅ Statistics initialize
- ✅ Partial data handled
- ✅ Backward compatibility maintained
- ✅ Image path migration works

**Run**: `npm test -- --run data-migration.test.ts`

## Test Output Examples

### Successful Test Run
```
✓ src/shared/__tests__/mythological-theme.test.ts (15)
  ✓ Mythological Theme - Faction References (5)
  ✓ Mythological Theme - Card Data (6)
  ✓ Mythological Theme - Type Consistency (4)

✓ src/shared/__tests__/image-format.test.ts (12)
  ✓ Image Format - Path Generation (4)
  ✓ Image Format - Placeholder Paths (4)
  ✓ Image Format - Variant Support (4)

Test Files  6 passed (6)
     Tests  78 passed (78)
```

### Failed Test Example
```
✗ src/shared/__tests__/mythological-theme.test.ts (15)
  ✗ should have East and West factions defined
    Expected: 'East'
    Received: 'White'
```

## Debugging Tests

### Run Single Test
```bash
npm test -- --run -t "should have East and West factions"
```

### Run with Verbose Output
```bash
npm test -- --run --reporter=verbose
```

### Run with Debug Info
```bash
DEBUG=* npm test -- --run
```

## Continuous Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm install
    npm test -- --run
```

### Pre-commit Hook
```bash
# .husky/pre-commit
npm test -- --run
```

## Test Coverage

### Generate Coverage Report
```bash
npm test -- --run --coverage
```

### View Coverage in Browser
```bash
npm test -- --run --coverage --coverage.reporter=html
open coverage/index.html
```

### Coverage Thresholds
```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
});
```

## Manual Testing Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

## Quick Test Workflow

### Before Committing
```bash
# 1. Run all tests
npm test -- --run

# 2. Type check
npm run type-check

# 3. Lint
npm run lint

# 4. Build
npm run build
```

### After Making Changes
```bash
# Run affected tests
npm test -- --run [test-file-name]

# Run all tests
npm test -- --run
```

## Troubleshooting

### Tests Won't Run
```bash
# Clear cache
rm -rf node_modules/.vite
npm test -- --run --no-cache
```

### Import Errors
```bash
# Check TypeScript config
npm run type-check

# Rebuild
npm run build
```

### Mock Issues
```bash
# Clear all mocks
vi.clearAllMocks()

# Reset modules
vi.resetModules()
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test -- --run
   ```

2. **Write tests for new features**
   - Add test file in appropriate `__tests__` directory
   - Follow existing test patterns

3. **Keep tests fast**
   - Mock external dependencies
   - Use test doubles for Redis/API calls

4. **Test one thing at a time**
   - Each test should verify one behavior
   - Use descriptive test names

5. **Clean up after tests**
   - Use `beforeEach` and `afterEach`
   - Clear mocks between tests

## Resources

- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Test Guide**: `TESTING_VERIFICATION_GUIDE.md`
- **Test Summary**: `TASK_15_TESTING_SUMMARY.md`
- **Quick Reference**: `QUICK_TEST_REFERENCE.md`

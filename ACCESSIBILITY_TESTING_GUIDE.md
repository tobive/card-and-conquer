# Accessibility Testing Guide

## Overview

This guide provides instructions for testing the accessibility features implemented in the card visual redesign. All card components now include comprehensive accessibility support including descriptive alt text, ARIA labels, keyboard navigation, and WCAG AA compliant color contrast.

## Implemented Accessibility Features

### 1. Descriptive Alt Text for Card Images

**Implementation:**
- All card images include descriptive alt text with card name, faction, level, and variant information
- Example: "General Ivanka, White faction Level 3 card - Golden Edition variant"

**Testing:**
- Use a screen reader (NVDA, JAWS, VoiceOver) to navigate to card images
- Verify that the alt text is read aloud and provides complete information
- Check that variant information is included when applicable

### 2. ARIA Labels for Card Information

**Implementation:**
- Card containers have comprehensive ARIA labels describing all card properties
- Interactive elements have role="button" with appropriate aria-label
- Non-interactive cards have role="img" with descriptive aria-label
- Visual overlays are marked with aria-hidden="true" to prevent duplicate announcements
- Emoji icons have role="img" with descriptive aria-label

**Testing:**
- Navigate cards with a screen reader
- Verify that card information is announced once (not duplicated)
- Check that interactive cards announce "Press Enter or Space to select"
- Verify emoji icons are properly labeled (e.g., "devotees", "ability")

### 3. Keyboard Navigation

**Implementation:**

#### GameCard and CardThumbnail:
- Interactive cards are focusable with tabIndex={0}
- Enter and Space keys trigger onClick action
- Non-interactive cards are not in tab order

#### VariantSelector:
- Left/Right arrow keys navigate between owned variants
- Home key jumps to first owned variant
- End key jumps to last owned variant
- Enter/Space selects the focused variant
- Locked variants are not focusable (tabIndex={-1})
- Comprehensive keyboard navigation instructions in aria-label

#### CollectionViewToggle:
- Radio group semantics for view mode selection
- Tab key navigates between controls
- Space/Enter activates buttons
- Checkbox for "show unowned" option

**Testing:**

1. **Tab Navigation:**
   - Press Tab to move through interactive elements
   - Verify focus indicator is visible
   - Check that locked/disabled items are skipped

2. **Arrow Key Navigation (VariantSelector):**
   - Focus a variant in the selector
   - Press Left/Right arrows to navigate between variants
   - Verify only owned variants are navigable
   - Test Home/End keys to jump to first/last variant

3. **Activation:**
   - Press Enter or Space on focused cards
   - Verify onClick handlers are triggered
   - Check that locked variants don't activate

### 4. Color Contrast (WCAG AA Compliance)

**Implementation:**
- Enhanced text shadows for better readability: `0 2px 4px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.8)`
- White text (#ffffff) on semi-transparent dark overlays
- Faction colors (amber/purple) used for accents, not primary text
- Utility function `meetsContrastStandards()` available for testing

**Testing:**

1. **Manual Visual Inspection:**
   - View cards in different lighting conditions
   - Check text readability on various card backgrounds
   - Verify faction-colored text (ability names) is readable

2. **Automated Tools:**
   - Use browser DevTools Accessibility Inspector
   - Run axe DevTools or WAVE browser extension
   - Check contrast ratios:
     - Normal text: minimum 4.5:1
     - Large text (18pt+ or 14pt+ bold): minimum 3:1

3. **Color Blindness Testing:**
   - Use color blindness simulators (Chrome DevTools, ColorOracle)
   - Verify information isn't conveyed by color alone
   - Check that locked/unlocked states are distinguishable

### 5. Screen Reader Testing

**Recommended Screen Readers:**
- **Windows:** NVDA (free) or JAWS
- **macOS:** VoiceOver (built-in)
- **Linux:** Orca
- **Mobile:** TalkBack (Android), VoiceOver (iOS)

**Testing Checklist:**

#### GameCard Component:
- [ ] Card name is announced
- [ ] Faction is announced (White or Black)
- [ ] Level is announced
- [ ] Soldier count is announced
- [ ] Ability is announced (if present)
- [ ] Variant information is announced (if alternate)
- [ ] Interactive cards announce "Press Enter or Space to select"
- [ ] Visual overlays are not announced (aria-hidden)

#### CardThumbnail Component:
- [ ] Same as GameCard but optimized for smaller size
- [ ] All information remains accessible

#### VariantSelector Component:
- [ ] Group is announced as "Card variants for [card name]"
- [ ] Navigation instructions are announced
- [ ] Each variant announces name, rarity, ownership status
- [ ] Selected variant is announced as "Currently selected"
- [ ] Locked variants announce "Not available"
- [ ] Arrow key navigation works with screen reader

#### CollectionViewToggle Component:
- [ ] Radio group is announced
- [ ] Current selection is announced
- [ ] View mode descriptions are announced
- [ ] Options panel expand/collapse is announced
- [ ] Checkbox state is announced

## Testing Procedures

### Basic Screen Reader Test (5 minutes)

1. **Enable Screen Reader:**
   - Windows: Start NVDA (Ctrl+Alt+N)
   - macOS: Enable VoiceOver (Cmd+F5)

2. **Navigate to Collection Screen:**
   - Tab through the interface
   - Listen to announcements
   - Verify card information is complete

3. **Test Card Selection:**
   - Tab to a card
   - Press Enter to select
   - Verify action occurs

4. **Test Variant Selector:**
   - Navigate to variant selector
   - Use arrow keys to move between variants
   - Press Enter to select a variant

### Comprehensive Accessibility Audit (30 minutes)

1. **Keyboard-Only Navigation:**
   - Disconnect mouse/trackpad
   - Navigate entire application using only keyboard
   - Document any unreachable elements

2. **Screen Reader Full Test:**
   - Navigate all screens with screen reader
   - Verify all information is accessible
   - Check for duplicate announcements
   - Test all interactive elements

3. **Automated Testing:**
   ```bash
   # Install axe-core for automated testing
   npm install --save-dev @axe-core/cli
   
   # Run accessibility audit
   npx axe http://localhost:5173 --tags wcag2a,wcag2aa
   ```

4. **Color Contrast Testing:**
   - Use browser DevTools Accessibility panel
   - Check all text elements
   - Verify contrast ratios meet WCAG AA

5. **Mobile Testing:**
   - Test with mobile screen readers
   - Verify touch targets are 44x44px minimum
   - Check swipe gestures work with screen reader

## Common Issues and Solutions

### Issue: Screen Reader Announces Information Twice

**Solution:** Ensure visual overlays have `aria-hidden="true"` and main container has comprehensive `aria-label`.

### Issue: Keyboard Focus Not Visible

**Solution:** Add custom focus styles:
```css
:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}
```

### Issue: Locked Variants Are Focusable

**Solution:** Verify `tabIndex={-1}` is set for locked variants and `aria-disabled={true}` is present.

### Issue: Color Contrast Fails

**Solution:** Increase text shadow opacity or adjust overlay transparency in faction theme configuration.

## Accessibility Checklist

Use this checklist to verify all accessibility requirements are met:

- [ ] All images have descriptive alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible
- [ ] ARIA labels provide complete information
- [ ] No duplicate announcements with screen readers
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Information is not conveyed by color alone
- [ ] Touch targets are minimum 44x44px
- [ ] Screen reader testing completed on at least one platform
- [ ] Keyboard navigation works without mouse
- [ ] All interactive elements have appropriate roles
- [ ] Disabled/locked elements are properly marked
- [ ] Error messages are accessible
- [ ] Loading states are announced

## Resources

### Tools
- [NVDA Screen Reader](https://www.nvaccess.org/) (Windows, free)
- [axe DevTools](https://www.deque.com/axe/devtools/) (Browser extension)
- [WAVE](https://wave.webaim.org/) (Browser extension)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

### Testing Services
- [Accessibility Insights](https://accessibilityinsights.io/)
- [Pa11y](https://pa11y.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

## Continuous Testing

Integrate accessibility testing into your development workflow:

1. **Pre-commit:** Run automated accessibility checks
2. **PR Review:** Include accessibility checklist
3. **Manual Testing:** Test with screen reader before major releases
4. **User Feedback:** Collect feedback from users with disabilities

## Contact

For accessibility questions or issues, please refer to the project's accessibility documentation or contact the development team.

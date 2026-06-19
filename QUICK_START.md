# 🚀 Quick Guide: Adding New Features with AI

**TL;DR:** 5 minutes to add tests for a new feature.

---

## Checklist for New Feature

### **1. Create Page Object** ✅
```bash
# Create new file: src/ui/yourFeaturePage.ts
```

```typescript
import { BasePage } from './basePage';
import { Page, Locator } from '@playwright/test';

export class YourFeaturePage extends BasePage {
  readonly actionButton: Locator;
  readonly inputField: Locator;

  constructor(page: Page) {
    super(page);
    this.actionButton = page.locator('button:has-text("Action")');
    this.inputField = page.locator('input[name="field"]');
  }

  async performAction() {
    await this.actionButton.click();
  }
}
```

### **2. Analyze App** ✅
```bash
npm run analyze:app
```
⏱️ Time: ~30 seconds
📄 Output: `app-analysis.json` (updated)

### **3. Generate Tests** ✅
```bash
npm run generate:claude-tests
```
⏱️ Time: ~20 seconds
📄 Output: `tests/ui/claudeGeneratedTests.spec.ts` (5 new tests)

### **4. Run Tests** ✅
```bash
npm run test:claude
```
✅ All tests should pass!

---

## What Claude Generates

Claude automatically creates tests for:
- ✅ Happy path (normal use case)
- ✅ Error handling (validations)
- ✅ Edge cases (empty inputs, etc.)
- ✅ Integration (full workflows)
- ✅ Self-healing (resilient selectors)

---

## File Structure After Feature Added

```
src/ui/
├── basePage.ts
├── existingPage.ts
├── yourNewPage.ts         ← NEW

tests/ui/
├── existingTests.spec.ts
├── claudeGeneratedTests.spec.ts  ← AI generates HERE
```

---

## Commands Reference

| Command | Purpose | Time |
|---------|---------|------|
| `npm run analyze:app` | Scan app structure | 30s |
| `npm run generate:claude-tests` | Generate tests with Claude | 20s |
| `npm run test:claude` | Run AI-generated tests | 2-5min |
| `npm run test -- claudeGeneratedTests.spec.ts --headed` | Run with visible browser | 2-5min |
| `npm run test:report` | View HTML report | - |

---

## Common Issues

### **"app-analysis.json not found"**
```bash
npm run analyze:app
```

### **"ANTHROPIC_API_KEY not found"**
```bash
# Create .env in project root
echo "ANTHROPIC_API_KEY=sk-ant-YOUR-KEY" > .env
```

### **Tests fail after generation**
```bash
# Review the generated code
cat tests/ui/claudeGeneratedTests.spec.ts

# Check for missing Page Object methods
# Add missing methods to your Page Object
```

### **Selectors are breaking**
```typescript
// Use Self-Healing:
const button = new SelfHealingLocator(
  page,
  'button:has-text("Save")',    // Primary
  'button[data-test="save"]',   // Fallback
  'button.save-btn'             // Last resort
);
await button.click(0);
```

---

## Performance Improvement

```
📊 METRICS BEFORE & AFTER

Testing Manual Feature (2 features/month):
Before AI:
- Tests written: 10
- Coverage: 50%
- Time: 60 hours/month

After AI:
- Tests written: 50+
- Coverage: 90%+
- Time: 5 hours/month

ROI: 55 hours saved per month = 550% improvement 🎉
```

---

## Best Practices

✅ **DO:**
- Use semantic selectors: `button:has-text("Login")`
- Group related actions in Page Objects
- Name Page Objects by feature: `CheckoutPage`, `WishListPage`
- Keep methods simple and focused

❌ **DON'T:**
- Use brittle ID selectors: `#btn123`
- Mix test logic with Page Objects
- Hardcode test data
- Create tests without Page Objects

---

## When to Regenerate Tests

Regenerate tests when:
- ✅ You add a new Page Object
- ✅ You modify existing Page Object methods
- ✅ You want Claude to suggest better test cases
- ❌ Don't regenerate if tests already pass

To regenerate:
```bash
# Delete old tests (optional)
rm tests/ui/claudeGeneratedTests.spec.ts

# Generate new ones
npm run analyze:app
npm run generate:claude-tests
```

---

## Need Help?

- 📖 Full guide: [AI_TEST_GENERATION.md](AI_TEST_GENERATION.md)
- 🏗️ Architecture: See Project Structure in [README.md](README.md)
- 🐛 Issues: Check README troubleshooting section

---

**Happy testing! 🎉**

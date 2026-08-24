# 🔍 AI Error Analysis

#### **Basic Usage**
```typescript
import { AIErrorAnalyzer } from '../../src/utils/aiErrorAnalyzer';

test('Example test with error analysis', async ({ page }) => {
  const analyzer = new AIErrorAnalyzer();
  
  try {
    // Your test code
    await page.locator('button#login').click();
  } catch (error) {
    // Automatically capture context
    const context = await analyzer.analyzeFailure(
      error as Error,
      page,
      'my-test-name'
    );
    console.log('Error Context:', context);
  }
});
```
Generate Claude Analysis Prompt
```typescript
const analyzer = new AIErrorAnalyzer();

try {
  // Test code that fails
} catch (error) {
  const context = await analyzer.analyzeFailure(error as Error, page, 'test-name');
  
  // Generate prompt for Claude
  const claudePrompt = await analyzer.generateClaudePrompt(context);
  
  // Send to Claude API
  const response = await claudeClient.messages.create({
    model: "claude-3-5-sonnet-20241022",
    messages: [{ role: "user", content: claudePrompt }]
  });
  
  console.log('Claude Suggestion:', response.content[0].text);
}
```

Generate Failure Report
```typescript
const analyzer = new AIErrorAnalyzer();

// After running tests
const report = analyzer.generateReport();
console.log(report);

// Output:
// ## 📊 Test Failure Analysis Report
// **Total Failures**: 3
// ### Error Distribution
// - SELECTOR_ERROR: 1
// - TIMEOUT_ERROR: 2
```

Cleanup Old Analyses
```typescript
const analyzer = new AIErrorAnalyzer();

// Remove analyses older than 7 days
analyzer.clearOldAnalysis(7);
```

Error Classification

Error Type	Cause	Solution
SELECTOR_ERROR	Element not found (UI changed)	Update selector or use Self-Healing
TIMEOUT_ERROR	Element took too long to appear	Increase timeout or add explicit wait
ASSERTION_ERROR	Expected value doesn't match	Check test logic or app behavior
NAVIGATION_ERROR	Page didn't navigate	Check URL or page load events
NETWORK_ERROR	Network request failed	Check network conditions or API
UNKNOWN_ERROR	Other issues	Review error message
#### Output Files
After analyzing failures, check:
```css
test-results/
├── analysis/
│   ├── my-test-name-*.json          # Analysis metadata
│   └── html/
│       └── my-test-name-*.html      # Page HTML
└── screenshots/
    └── my-test-name-*.png           # Failure screenshots
```
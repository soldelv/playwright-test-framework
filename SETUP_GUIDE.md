# 🚀 Setup Guide

## Prerequisites
- Node.js 16+
- npm

## Step 1: Clone the repository
```bash
git clone https://github.com/soldelv/playwright-test-framework.git
cd playwright-test-framework
```

## Step 2: Install dependencies
```bash
npm install
```

## Step 3: Install Playwright
```bash
npx playwright install
```
## Step 4: Run tests
```bash
npm run test
```

## Step 5: View reports
```bash
npm run test:report
```

## Step 6: For AI-Powered Testing (Optional)

### Generate tests with local simulation (FREE, no API needed)
```bash
npm run generate:ai-tests
npm run test -- aiGeneratedTests.spec.ts --headed
```

### Or use Claude API (requires credits)
1. Get API key: https://console.anthropic.com
2. Create .env: echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
3. Run: 
```bash
npm run generate:claude-tests
npm run test:claude
```

## Next Steps
- See [QUICK_START.md](QUICK_START.md) to add new features
- See [AI_TEST_GENERATION.md](AI_TEST_GENERATION.md) for technical details
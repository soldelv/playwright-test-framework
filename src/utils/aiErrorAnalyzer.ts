// src/utils/aiErrorAnalyzer.ts
import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface FailureContext {
  errorMessage: string;
  errorType: string;
  screenshot: string;
  pageHTML: string;
  url: string;
  testName: string;
  timestamp: string;
  browserName: string;
  pageTitle: string;
  failedElement?: string;
}

export class AIErrorAnalyzer {
  private screenshotDir = 'test-results/screenshots';
  private analysisDir = 'test-results/analysis';

  constructor() {
    this.createDirectories();
  }

  /**
   * Creates necessary directories for storing analysis data
   */
  private createDirectories(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
    if (!fs.existsSync(this.analysisDir)) {
      fs.mkdirSync(this.analysisDir, { recursive: true });
    }
  }

  /**
   * Analyzes a test failure and collects comprehensive context
   * Ready to send to Claude for analysis
   */
  async analyzeFailure(
    error: Error,
    page: Page,
    testName: string = 'unknown-test'
  ): Promise<FailureContext> {
    console.log(`\n🔍 Analyzing failure for test: ${testName}`);

    try {
      // 1️⃣ CAPTURE SCREENSHOT
      const timestamp = this.getTimestamp();
      const screenshotPath = path.join(
        this.screenshotDir,
        `${testName}-${timestamp}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const screenshotBase64 = fs.readFileSync(screenshotPath).toString('base64');

      // 2️⃣ GET PAGE CONTENT
      const pageHTML = await page.content();
      const pageTitle = await page.title();

      // 3️⃣ EXTRACT ERROR TYPE
      const errorType = this.classifyError(error.message);

      // 4️⃣ FIND FAILED ELEMENT (if possible)
      const failedElement = await this.findFailedElement(page, error);

      // 5️⃣ COMPILE CONTEXT
      const context: FailureContext = {
        errorMessage: error.message,
        errorType,
        screenshot: screenshotBase64,
        pageHTML,
        url: page.url(),
        testName,
        timestamp,
        browserName: this.getBrowserName(page),
        pageTitle,
        failedElement,
      };

      // 6️⃣ SAVE ANALYSIS LOCALLY
      this.saveAnalysisLocally(context, testName, timestamp);

      console.log(`✅ Failure analysis complete\n`);
      return context;
    } catch (analysisError) {
      console.error('❌ Error during failure analysis:', analysisError);
      throw analysisError;
    }
  }

  /**
   * Classifies the error type based on error message
   */
  private classifyError(errorMessage: string): string {
    if (errorMessage.includes('timeout')) return 'TIMEOUT_ERROR';
    if (errorMessage.includes('not found') || errorMessage.includes('no element'))
      return 'SELECTOR_ERROR';
    if (errorMessage.includes('assertion')) return 'ASSERTION_ERROR';
    if (errorMessage.includes('navigation')) return 'NAVIGATION_ERROR';
    if (errorMessage.includes('network')) return 'NETWORK_ERROR';
    return 'UNKNOWN_ERROR';
  }

  /**
   * Attempts to find the element that caused the failure
   */
  private async findFailedElement(page: Page, error: Error): Promise<string | undefined> {
    try {
      // Extract potential selector from error message
      const selectorMatch = error.message.match(/selector "([^"]+)"/);
      if (selectorMatch) {
        const selector = selectorMatch[1];
        const element = await page.locator(selector).first();
        if (element.isVisible()) {
          return selector;
        }
      }
    } catch {
      // Silently fail if we can't find the element
    }
    return undefined;
  }

  /**
   * Gets browser name from page context
   */
  private getBrowserName(page: Page): string {
    const context = page.context();
    return context.browser()?.browserType().name() || 'unknown';
  }

  /**
   * Generates ISO timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Saves analysis to local file for review
   */
  private saveAnalysisLocally(
    context: FailureContext,
    testName: string,
    timestamp: string
  ): void {
    const filename = `${testName}-${timestamp}.json`;
    const filepath = path.join(this.analysisDir, filename);

    // Remove base64 screenshot for JSON file (too large)
    const { screenshot, pageHTML, ...jsonContext } = context;

    fs.writeFileSync(
      filepath,
      JSON.stringify(
        {
          ...jsonContext,
          screenshotFile: `screenshots/${testName}-${timestamp}.png`,
          htmlFile: `html/${testName}-${timestamp}.html`,
        },
        null,
        2
      )
    );

    // Save HTML separately
    const htmlDir = path.join(this.analysisDir, 'html');
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }
    fs.writeFileSync(path.join(htmlDir, `${testName}-${timestamp}.html`), pageHTML);

    console.log(`📁 Analysis saved: ${filepath}`);
  }

  /**
   * Generates a prompt for Claude to analyze the failure
   * Use this to send to Claude API for intelligent suggestions
   */
  async generateClaudePrompt(context: FailureContext): Promise<string> {
    return `
You are an expert QA engineer analyzing a test failure.

## Test Information
- Test Name: ${context.testName}
- URL: ${context.url}
- Browser: ${context.browserName}
- Error Type: ${context.errorType}
- Timestamp: ${context.timestamp}

## Error Message
\`\`\`
${context.errorMessage}
\`\`\`

## Page Title
${context.pageTitle}

## Failed Element
${context.failedElement || 'Not identified'}

## Page HTML (simplified)
\`\`\`html
${context.pageHTML.substring(0, 2000)}...
\`\`\`

## Your Task
Analyze this test failure and provide:
1. Root cause analysis
2. Suggested fix
3. Prevention strategy
4. Whether the issue is:
   - Broken selector (UI changed)
   - Timing issue (need wait)
   - Logic error (test is wrong)
   - Environment issue
   - Other

Be concise and actionable.
    `;
  }

  /**
   * Generates a comprehensive report of all failures
   */
  generateReport(): string {
    const analysisFiles = fs.readdirSync(this.analysisDir).filter((f) =>
      f.endsWith('.json')
    );

    if (analysisFiles.length === 0) {
      return '✅ No test failures recorded';
    }

    let report = `## 📊 Test Failure Analysis Report\n\n`;
    report += `**Total Failures**: ${analysisFiles.length}\n\n`;

    const errorCounts: Record<string, number> = {};

    analysisFiles.forEach((file) => {
      const content = JSON.parse(
        fs.readFileSync(path.join(this.analysisDir, file), 'utf-8')
      );
      errorCounts[content.errorType] = (errorCounts[content.errorType] || 0) + 1;
    });

    report += `### Error Distribution\n`;
    Object.entries(errorCounts).forEach(([type, count]) => {
      report += `- ${type}: ${count}\n`;
    });

    return report;
  }

  /**
   * Clears old analysis files (older than X days)
   */
  clearOldAnalysis(daysOld: number = 7): void {
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000;

    fs.readdirSync(this.analysisDir).forEach((file) => {
      const filepath = path.join(this.analysisDir, file);
      const stats = fs.statSync(filepath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
        console.log(`🗑️ Deleted old analysis: ${file}`);
      }
    });
  }
}
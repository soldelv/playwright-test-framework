// src/utils/aiErrorAnalyzer.ts
import { Page } from '@playwright/test';

export class AIErrorAnalyzer {
  async analyzeFailure(error: Error, page: Page): Promise<string> {
    const screenshot = await page.screenshot({ path: 'error.png' });
    const pageContent = await page.content();
    
    // Datos que enviarías a Claude via Playwright MCP
    const context = {
      errorMessage: error.message,
      screenshot: screenshot.toString('base64'),
      pageHTML: pageContent,
      url: page.url(),
      testName: 'test-name-here'
    };
    
    // IA sugiere automáticamente:
    // - "El selector cambió de id='login' a data-test='login'"
    // - "La aplicación entró en estado de error"
    // - "Falta agregar un wait para cargar elementos"
    
    return JSON.stringify(context);
  }
}
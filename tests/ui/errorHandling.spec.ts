// tests/ui/errorHandling.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/ui/loginPage';
import { AIErrorAnalyzer } from '../../src/utils/aiErrorAnalyzer';

test('Login with AI error analysis', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyzer = new AIErrorAnalyzer();
  
  try {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('**/inventory.html');
  } catch (error) {
    // IA analiza automáticamente
    const analysis = await analyzer.analyzeFailure(error as Error, page);
    console.log('🤖 IA Insight:', analysis);
    
    // IA sugiere el siguiente paso
    throw error;
  }
});
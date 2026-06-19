// tests/ui/errorAnalysisExample.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/ui/loginPage';
import { AIErrorAnalyzer } from '../../src/utils/aiErrorAnalyzer';

test.describe('Error Analysis Examples', () => {
  let analyzer: AIErrorAnalyzer;

  test.beforeEach(() => {
    analyzer = new AIErrorAnalyzer();
  });

  // ✅ EJEMPLO 1: Capturar error de selector roto
  test('Analyze selector error', async ({ page }) => {
    try {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Este selector podría fallar si la UI cambia
      await page.locator('button#non-existent-button').click();
    } catch (error) {
      // 🤖 Analizar con IA
      const context = await analyzer.analyzeFailure(
        error as Error,
        page,
        'login-selector-error'
      );

      console.log('🤖 Error Context:', context);
      // Aquí puedes enviar a Claude para análisis automático
    }
  });

  // ✅ EJEMPLO 2: Capturar error de timeout
  test('Analyze timeout error', async ({ page }) => {
    try {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');

      // Esperar elemento que nunca aparece (timeout)
      await page.locator('.non-existent-element').waitFor({ timeout: 5000 });
    } catch (error) {
      const context = await analyzer.analyzeFailure(
        error as Error,
        page,
        'checkout-timeout'
      );

      // Guardar contexto para análisis posterior
      console.log('📊 Analysis saved locally');
    }
  });

  // ✅ EJEMPLO 3: Capturar error de assertion
  test('Analyze assertion error', async ({ page }) => {
    try {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');

      // Assertion que falla
      expect(await loginPage.successLogin()).toBeFalsy(); // Esperamos falso pero es verdadero
    } catch (error) {
      const context = await analyzer.analyzeFailure(
        error as Error,
        page,
        'login-assertion-failed'
      );

      console.log('🔍 Assertion context captured');
    }
  });

  // ✅ EJEMPLO 4: Generar prompt para Claude
  test('Generate Claude analysis prompt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    try {
      // Provocar error deliberado
      await page.locator('.products-header-h1').click({ timeout: 1000 });
    } catch (error) {
      const context = await analyzer.analyzeFailure(
        error as Error,
        page,
        'products-page-error'
      );

      // Generar prompt para Claude
      const claudePrompt = await analyzer.generateClaudePrompt(context);
      console.log('📝 Claude Prompt Generated:');
      console.log(claudePrompt);

      // 🚀 En producción, enviarías esto a Claude API
      // const response = await claudeClient.messages.create({
      //   model: "claude-3-5-sonnet-20241022",
      //   messages: [{ role: "user", content: claudePrompt }]
      // });
    }
  });

  // ✅ EJEMPLO 5: Generar reporte de análisis
  test('Generate failure report', async () => {
    const report = analyzer.generateReport();
    console.log(report);
  });

  // ✅ EJEMPLO 6: Limpiar análisis antiguos
  test('Cleanup old analysis', async () => {
    analyzer.clearOldAnalysis(7); // Eliminar archivos mayores a 7 días
  });
});
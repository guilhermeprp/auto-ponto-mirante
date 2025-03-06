import { test, expect } from '@playwright/test';

// insert your login and password here
const LOGIN = 'username';
const PASSWORD = 'secret-code';

const uri = 'https://alocpro.mirante.net.br/';

test.beforeEach(async ({ page }) => {
  await page.goto(uri);
  await page.waitForLoadState('domcontentloaded');

  await page.fill('input[name="username"]', LOGIN);
  await page.fill('input[name="password"]', PASSWORD);

  await page.click('input[type="submit"]');

  await page.waitForLoadState('load');

  if (page.url() !== uri + 'alocpro/wicket/atv/registro/registroAtividades') {
    await page.click('button[type="submit"]');
    await page.waitForLoadState('domcontentloaded');
  }
});

test('Deve preencher formulario de ponto da Mirante', async ({ page }) => {
  await page.waitForSelector('.input_bater_ponto');

  const inputs = await page.locator('.input_bater_ponto');

  if (!(await inputs.all()).length) {
    throw new Error('Não foi possível encontrar os inputs');
  }

  await page.evaluate(() => {
    const inputs = document.querySelectorAll('.input_bater_ponto');

    inputs[0].value = "SP-Ailos/OS - 2021/Ailos-OS - Desenv-Programação";
    inputs[1].value = "8:00";
    inputs[2].value = "4:00";
    inputs[4].value = "Intervalo (Não Contabilizado)";
    inputs[6].value = "1:00";
    inputs[8].value = "SP-Ailos/OS - 2021/Ailos-OS - Desenv-Programação";
    inputs[10].value = "4:00";

    inputs[0].dispatchEvent(new Event("blur"));
    inputs[4].dispatchEvent(new Event("blur"));
    inputs[8].dispatchEvent(new Event("blur"));
  });

  await page.click('button[type="submit"]');

  expect(await page.locator('#form').getByText('Somente podem ser lançadas')).not.toBeNull();
});

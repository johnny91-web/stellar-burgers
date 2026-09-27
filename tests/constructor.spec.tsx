import { test, expect, Page } from '@playwright/test';

async function setupMocks(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    },
  ]);

  await page.routeFromHAR('tests/hars/get-ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.route('**/*/api/auth/user*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          _id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
        },
      }),
    });
  });

  await page.routeFromHAR('tests/hars/create-order.har', {
    url: '**/api/orders',
  });
}

async function waitForPreloaderHidden(page: Page) {
  await page.waitForSelector('.preloader_circle', { state: 'hidden', timeout: 5000 }).catch(() => {});
}

// Вспомогательная функция для добавления ингредиентов — убираем дублирование
async function addIngredients(page: Page) {
  const bunCard = page.locator('text=Краторная булка N-200i');
  const meatCard = page.locator('text=Биокотлета из марсианской Магнолии');

  await expect(bunCard).toBeVisible({ timeout: 10000 });
  await expect(meatCard).toBeVisible({ timeout: 10000 });

  const addButtonForBun = bunCard
    .locator('xpath=./ancestor::li')
    .getByText('Добавить', { exact: true });
  const addButtonFormeatCard = meatCard
    .locator('xpath=./ancestor::li')
    .getByText('Добавить', { exact: true });

  await expect(addButtonForBun).toBeVisible({ timeout: 10000 });
  await expect(addButtonFormeatCard).toBeVisible({ timeout: 10000 });

  await addButtonForBun.click();
  await expect(
    page.locator('.constructor-element__text').getByText('Краторная булка N-200i (верх)')
  ).toBeVisible({ timeout: 10000 });

  await addButtonFormeatCard.click();
  await expect(
    page.locator('.constructor-element__text').getByText('Биокотлета из марсианской Магнолии', { exact: true })
  ).toBeVisible({ timeout: 10000 });
}

test.describe('Конструктор бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await waitForPreloaderHidden(page);
  });

  test('добавление ингредиентов в конструктор', async ({ page }) => {
    await addIngredients(page);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await waitForPreloaderHidden(page);
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const bunCard = page.locator('text=Краторная булка N-200i');
    await expect(bunCard).toBeVisible({ timeout: 15000 });

    await bunCard.click();

    await expect(page.locator('text=Детали ингредиента')).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('h3').getByText('Краторная булка N-200i', { exact: true })
    ).toBeVisible({ timeout: 10000 });

    const closeButton = page.locator('button[aria-label="Закрыть"]');
    await expect(closeButton).toBeVisible({ timeout: 10000 });
    await closeButton.click();

    await expect(page.locator('text=Детали ингредиента')).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await waitForPreloaderHidden(page);
  });

  test('создание заказа и проверка модального окна подтверждения', async ({ page }) => {
    await addIngredients(page);

    const orderButton = page.locator('button').getByText('Оформить заказ', { exact: true });
    await orderButton.click();

    const orderProcessed = page.locator('h3:has-text("Оформляем заказ...")');

    const isVisible = await orderProcessed.isVisible();
      if (isVisible) {
      await orderProcessed.waitFor({ state: 'hidden', timeout: 5000 });
}


    const orderModalText = page.locator('p').getByText('Ваш заказ начали готовить', { exact: true });
    await expect(orderModalText).toBeVisible({ timeout: 10000 });

    await expect(page.locator('h2:has-text("110664")')).toBeVisible({ timeout: 10000 });

    const closeButton = page.locator('button[aria-label="Закрыть"]');
    await expect(closeButton).toBeVisible({ timeout: 10000 });
    await closeButton.click();

    await expect(page.locator('text=Ваш заказ начали готовить')).not.toBeVisible({ timeout: 10000 });
  });
});

const { test, expect } = require('@playwright/test');
const { setPlayerName, navigateToGame, dismissSwalIfPresent } = require('./helpers');

test.describe('DAB E2E', () => {
  test('create room, join, draw a line', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Drawer'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Liner'));
    await page1.goto('/');
    await page2.goto('/');

    // Navigate and create room
    await navigateToGame(page1, '/dab');
    await page1.waitForTimeout(500);
    await page1.locator('button:has-text("Create Room")').click();
    await page1.locator('div.font-sketch.text-3xl').first().waitFor({ state: 'visible', timeout: 10000 });
    const roomCodeEl = page1.locator('div.font-sketch.text-3xl').first();
    const roomCode = await roomCodeEl.textContent();
    expect(roomCode).toBeTruthy();

    // Join room
    await navigateToGame(page2, '/dab');
    await page2.waitForTimeout(3000);
    await page2.locator('button:has-text("Join Room")').click();
    await page2.locator('.swal2-input').waitFor({ state: 'visible', timeout: 5000 });
    await page2.locator('.swal2-input').fill(roomCode.trim());
    await page2.locator('.swal2-confirm').click();

    // Wait for Start Game button
    await page1.locator('button:has-text("Start Game!")').waitFor({ state: 'visible', timeout: 15000 });
    await page1.waitForTimeout(500);

    // Start game
    await page1.locator('button:has-text("Start Game!")').click();
    await page1.waitForTimeout(3000);
    await page2.waitForTimeout(3000);

    // Should see Scoreboard
    await expect(page1.locator('text=Scoreboard')).toBeVisible({ timeout: 10000 });
    await expect(page2.locator('text=Scoreboard')).toBeVisible({ timeout: 10000 });

    // Draw a line
    const lineSelectors = page1.locator('line[stroke="transparent"]');
    const lineCount = await lineSelectors.count();
    expect(lineCount).toBeGreaterThan(0);
    await lineSelectors.first().click();
    await page1.waitForTimeout(1000);

    await ctx.close();
  });

  test('extended mode selection shows in lobby', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('playerName', 'Customizer'));
    await page.goto('/dab');

    // Should see all three mode options
    await expect(page.locator('text=Classic (9×9)')).toBeVisible();
    await expect(page.locator('text=Extended (14×14)')).toBeVisible();
    await expect(page.locator('text=Marathon (19×19)')).toBeVisible();

    // Click Extended
    await page.locator('button:has-text("Extended (14×14)")').click();
    await page.waitForTimeout(300);

    // Click Create Room
    await page.locator('button:has-text("Create Room")').click();
    await page.waitForTimeout(1000);

    await ctx.close();
  });
});

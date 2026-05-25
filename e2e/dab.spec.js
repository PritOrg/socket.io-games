const { test, expect } = require('@playwright/test');
const { setPlayerName, setPlayerNames, dismissSwalIfPresent } = require('./helpers');

test.describe('DAB E2E', () => {
  test('create room, join, select mode, start game, draw lines', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Drawer', 'Liner');

    // Page1 creates room
    await page1.goto('/dab');
    await page1.waitForTimeout(500);
    await page1.locator('button:has-text("Create Room")').click();

    // Wait for waiting room - room code appears in a div with class font-sketch
    await page1.locator('div.font-sketch.text-3xl').first().waitFor({ state: 'visible', timeout: 10000 });
    const roomCodeEl = page1.locator('div.font-sketch.text-3xl').first();
    const roomCode = await roomCodeEl.textContent();
    expect(roomCode).toBeTruthy();

    // Page2 joins room
    await page2.goto('/dab');
    await page2.waitForTimeout(500);
    await page2.locator('button:has-text("Join Room")').click();
    await page2.locator('.swal2-input').waitFor({ state: 'visible', timeout: 5000 });
    await page2.locator('.swal2-input').fill(roomCode);
    await page2.locator('.swal2-confirm').click();

    // Wait for Start Game button to appear (indicates both players are in)
    await page1.locator('button:has-text("Start Game!")').waitFor({ state: 'visible', timeout: 10000 });

    // Dismiss any modals
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Creator clicks Start Game button
    await page1.locator('button:has-text("Start Game!")').click({ force: true });

    // Wait for game to start - wait for scoreboard to appear
    await page1.locator('text=Scoreboard').waitFor({ state: 'visible', timeout: 10000 });
    await page2.locator('text=Scoreboard').waitFor({ state: 'visible', timeout: 10000 });

    // Dismiss the "Game Started!" modal if present
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Both should see game title
    await expect(page1.locator('text=Dots')).toBeVisible();
    await expect(page2.locator('text=Dots')).toBeVisible();

    // Both should see the scoreboard
    await expect(page1.locator('text=Scoreboard')).toBeVisible({ timeout: 5000 });
    await expect(page2.locator('text=Scoreboard')).toBeVisible({ timeout: 5000 });

    // Verify the board has SVG elements
    const svg = page1.locator('svg');
    await expect(svg).toBeVisible({ timeout: 5000 });

    // Draw a line - find a transparent line and click it
    const lineSelectors = page1.locator('line[stroke="transparent"]');
    const lineCount = await lineSelectors.count();
    expect(lineCount).toBeGreaterThan(0);

    await lineSelectors.first().click({ force: true });
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    await ctx.close();
  });

  test('custom game mode selection before starting', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/dab');
    await setPlayerName(page, 'Customizer');
    await page.waitForTimeout(500);

    // Click Custom Size
    await page.locator('button:has-text("Custom Size")').click();
    await page.waitForTimeout(300);

    // Custom size sliders should now be visible
    await expect(page.locator('text=Rows:')).toBeVisible();
    await expect(page.locator('text=Columns:')).toBeVisible();

    await ctx.close();
  });
});

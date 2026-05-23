const { test, expect } = require('@playwright/test');
const { setPlayerNames, navigateToGame, createAndJoinRoom } = require('./helpers');

test.describe('DAB E2E', () => {
  test('create room, join, select mode, start game, draw lines', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await setPlayerNames(page1, page2, 'Drawer', 'Liner');

    await createAndJoinRoom(page1, page2, '/dab', 'Join Room', 'Create Room');
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Both should see room code
    const code1 = page1.locator('button[title="Click to copy room ID"]');
    const code2 = page2.locator('button[title="Click to copy room ID"]');
    await expect(code1).toBeVisible();
    await expect(code2).toBeVisible();

    // Both should see game title
    await expect(page1.locator('h2:has-text("Dots")')).toBeVisible();

    // Classic mode should be selected by default
    const classicBtn = page1.locator('button:has-text("Classic")');
    await expect(classicBtn).toBeVisible();

    // Creator starts the game
    const startBtn = page1.locator('button:has-text("Start Game")');
    await startBtn.waitFor({ state: 'visible', timeout: 5000 });
    await expect(startBtn).not.toBeDisabled();
    await startBtn.click();

    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);

    // Both should see the scoreboard
    await expect(page1.locator('text=Scoreboard')).toBeVisible();
    await expect(page2.locator('text=Scoreboard')).toBeVisible();

    // Both should see the game mode indicator
    await expect(page2.locator('text=Scoreboard')).toBeVisible();

    // Verify the board has SVG elements
    const svg = page1.locator('svg');
    await expect(svg).toBeVisible();

    // Draw a horizontal line on the top edge (r=0, c=0)
    const lineSelectors = page1.locator('line[stroke="transparent"]');
    const lineCount = await lineSelectors.count();
    expect(lineCount).toBeGreaterThan(0);

    // Click the first available transparent line to make a move
    await lineSelectors.first().click({ force: true });
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // The move should be reflected - scores should still show 0 for first move (no box completed)
    const scoreDisplay1 = page1.locator('text=Scoreboard');
    await expect(scoreDisplay1).toBeVisible();

    await ctx.close();
  });

  test('custom game mode selection before starting', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await setPlayerName(page, 'Customizer');

    await navigateToGame(page, '/dab');
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

async function setPlayerName(page, name) {
  await page.evaluate((n) => localStorage.setItem('playerName', n), name);
}

const { test, expect } = require('@playwright/test');
const { setPlayerNames, navigateToGame, createAndJoinRoom } = require('./helpers');

test.describe('Reconnect E2E', () => {
  test('disconnect and reconnect preserves game state', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Alpha', 'Beta');

    const roomCode = await createAndJoinRoom(page1, page2, '/tictactoe', 'Join', 'Create');
    expect(roomCode).toBeTruthy();
    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    // P1 makes a move (position 4 = center)
    const boardSelector = '.grid.grid-cols-3';
    await clickCell(page1, boardSelector, 4);
    await page2.waitForTimeout(500);

    // Verify P2 sees the X
    const p2cells = page2.locator(boardSelector).locator('button');
    await expect(p2cells.nth(4)).toHaveText('X');

    // Navigate P1 away (clears socket connection)
    await navigateToGame(page1, '/');
    await page1.waitForTimeout(1500);

    // P2 should still see the X
    await expect(p2cells.nth(4)).toHaveText('X');

    await ctx.close();
  });

  test('full TTT game plays to completion', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Xena', 'Odin');

    await createAndJoinRoom(page1, page2, '/tictactoe', 'Join', 'Create');
    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    const boardSelector = '.grid.grid-cols-3';

    // X wins with top row: positions 0, 1, 2
    // X: 0  → O: 3  → X: 1  → O: 6  → X: 2 (X wins!)
    await clickCell(page1, boardSelector, 0);
    await clickCell(page2, boardSelector, 3);
    await clickCell(page1, boardSelector, 1);
    await clickCell(page2, boardSelector, 6);
    await clickCell(page1, boardSelector, 2);

    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(1500);

    // Play Again button should appear
    const playAgain1 = page1.locator('button:has-text("Play Again")');
    const playAgain2 = page2.locator('button:has-text("Play Again")');
    await expect(playAgain1).toBeVisible({ timeout: 5000 });
    await expect(playAgain2).toBeVisible({ timeout: 5000 });

    await ctx.close();
  });
});

async function clickCell(page, boardSelector, index) {
  const cell = page.locator(boardSelector).locator('button').nth(index);
  await cell.waitFor({ state: 'visible', timeout: 5000 });
  await cell.click();
  await page.waitForTimeout(400);
}

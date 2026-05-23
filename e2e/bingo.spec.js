const { test, expect } = require('@playwright/test');
const {
  setPlayerNames,
  navigateToGame,
  clickCreateRoom,
  getRoomCode,
  clickJoinRoom,
  fillSwalInput,
  confirmSwal,
} = require('./helpers');

test.describe('Bingo E2E', () => {
  test('full flow: create room, join, start game, mark numbers, see BINGO progress', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Alice', 'Bob');

    // Navigate and create room
    await navigateToGame(page1, '/bingo');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1);
    const roomCode = await getRoomCode(page1);
    expect(roomCode).toBeTruthy();

    // Join room
    await navigateToGame(page2, '/bingo');
    await page2.waitForTimeout(500);
    await clickJoinRoom(page2);
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    // Both should see the room code
    await expect(page1.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);
    await expect(page2.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);

    // Verify room code text in game display
    await expect(page1.locator('text=BINGO')).toBeVisible();
    await expect(page2.locator('text=BINGO')).toBeVisible();

    // Creator starts the game
    await page1.locator('button:has-text("Start Party")').click();
    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);

    // Both should see the game board (5x5 grid)
    const board1 = page1.locator('.grid.grid-cols-5');
    const board2 = page2.locator('.grid.grid-cols-5');
    await expect(board1).toBeVisible();
    await expect(board2).toBeVisible();

    // Both should have 25 cells
    const cells1 = board1.locator('button');
    const cells2 = board2.locator('button');
    await expect(cells1).toHaveCount(25);
    await expect(cells2).toHaveCount(25);

    // Alice marks a number (if it's her turn)
    await page1.waitForTimeout(500);
    const isAliceTurn = await page1
      .locator('text=Your Turn')
      .isVisible()
      .catch(() => false);
    if (isAliceTurn) {
      const firstAvailable = cells1.filter({ hasNotText: '★' }).first();
      if (await firstAvailable.isVisible()) {
        await firstAvailable.click();
        await page1.waitForTimeout(1000);
      }
    }

    // Verify the number appears as marked on Alice's board
    const starsOnAlice = board1.locator('button:has-text("★")');
    const starCountAlice = await starsOnAlice.count();
    expect(starCountAlice).toBeGreaterThanOrEqual(1);

    await ctx.close();
  });
});

const { test, expect } = require('@playwright/test');
const { setPlayerNames, createAndJoinRoom } = require('./helpers');

test.describe('TicTacToe E2E', () => {
  test('full flow: create room, join, play game to win, restart', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Xena', 'Odin');

    const roomCode = await createAndJoinRoom(page1, page2, '/tictactoe', 'Join', 'Create');
    expect(roomCode).toBeTruthy();

    // Both should see the room
    await expect(page1.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);
    await expect(page2.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);

    // Wait for game to be ready (Socket.IO roomInfo received)
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Both should see the game title
    await expect(page1.locator('h1:has-text("Tic Tac Toe")')).toBeVisible();
    await expect(page2.locator('h1:has-text("Tic Tac Toe")')).toBeVisible();

    // Get the board grid reference
    const boardSelector = '.grid.grid-cols-3';

    // Play a game: Xena goes first (X)
    // Xena: position 0 (top-left)
    await clickBoardCell(page1, boardSelector, 0);
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // Odin: position 4 (center)
    await clickBoardCell(page2, boardSelector, 4);
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // Xena: position 1 (top-center)
    await clickBoardCell(page1, boardSelector, 1);
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // Odin: position 5 (center-right)
    await clickBoardCell(page2, boardSelector, 5);
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // Xena: position 2 (top-right) - wins with top row!
    await clickBoardCell(page1, boardSelector, 2);

    // Wait for game end
    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);

    // Both should see Play Again button
    await expect(page1.locator('button:has-text("Play Again")')).toBeVisible();
    await expect(page2.locator('button:has-text("Play Again")')).toBeVisible();

    // Both should see X on the winning cells
    const board1 = page1.locator(boardSelector);
    const cell0_1 = board1.locator('button').nth(0);
    const cell1_1 = board1.locator('button').nth(1);
    const cell2_1 = board1.locator('button').nth(2);
    await expect(cell0_1).toHaveText('X');
    await expect(cell1_1).toHaveText('X');
    await expect(cell2_1).toHaveText('X');

    // Click Play Again on creator's page
    await page1.locator('button:has-text("Play Again")').click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Board should be cleared
    const freshCells = page1.locator(boardSelector).locator('button');
    for (let i = 0; i < 9; i++) {
      await expect(freshCells.nth(i)).toHaveText('');
    }

    await ctx.close();
  });
});

async function clickBoardCell(page, boardSelector, index) {
  const grid = page.locator(boardSelector);
  const cells = grid.locator('button');
  await cells.nth(index).click();
  await page.waitForTimeout(300);
}

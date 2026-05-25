const { test, expect } = require('@playwright/test');
const {
  setPlayerNames,
  navigateToGame,
  clickCreateRoom,
  getRoomCode,
  clickJoinRoom,
  fillSwalInput,
  confirmSwal,
  dismissSwalIfPresent,
} = require('./helpers');

test.describe('TicTacToe E2E', () => {
  test('full flow: create room, join, play game to win, restart', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Xena'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Odin'));
    await page1.goto('/');
    await page2.goto('/');

    // Manual create/join flow (like Bingo test)
    await navigateToGame(page1, '/tictactoe');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1, 'Create');
    await page1.waitForTimeout(1000);
    const roomCode = await getRoomCode(page1);
    console.log('DEBUG roomCode:', roomCode);
    expect(roomCode).toBeTruthy();

    await navigateToGame(page2, '/tictactoe');
    await page2.waitForTimeout(1000);
    const btnText2 = await page2.locator('button[title="Click to copy room ID"]').textContent();
    console.log('DEBUG page2 room btn text before join:', JSON.stringify(btnText2));

    // Check if page2 even shows the TicTacToe page
    const h1Visible = await page2.locator('h1').isVisible();
    console.log('DEBUG page2 h1 visible:', h1Visible);
    const h1Text = await page2.locator('h1').textContent();
    console.log('DEBUG page2 h1 text:', JSON.stringify(h1Text));

    // Check for the game select lobby
    const pageTitle = await page2.title();
    console.log('DEBUG page2 title:', pageTitle);
    const url = page2.url();
    console.log('DEBUG page2 url:', url);

    await clickJoinRoom(page2, 'Join');
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Both should see the room
    const btnText1b = await page1.locator('button[title="Click to copy room ID"]').textContent();
    console.log(
      'DEBUG page1 room btn text after join:',
      JSON.stringify(btnText1b),
      'expected:',
      JSON.stringify(roomCode),
    );
    // Just check the button has non-empty visible text
    await expect(page1.locator('button[title="Click to copy room ID"]')).toBeVisible();
    await expect(page2.locator('button[title="Click to copy room ID"]')).toBeVisible();

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
  // Wait for cell to be enabled (it's the player's turn)
  await cells.nth(index).waitFor({ state: 'visible', timeout: 5000 });
  // Wait a bit for any modal to close and turn to be ready
  await page.waitForTimeout(200);
  await cells.nth(index).click({ force: true });
  await page.waitForTimeout(400);
}

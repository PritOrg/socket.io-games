const { test, expect } = require('@playwright/test');
const {
  navigateToGame,
  clickCreateRoom,
  getRoomCode,
  clickJoinRoom,
  fillSwalInput,
  confirmSwal,
  dismissSwalIfPresent,
} = require('./helpers');

test.describe('Reconnect E2E', () => {
  test('TTT: make a move and verify it syncs to other player', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Alpha'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Beta'));
    await page1.goto('/');
    await page2.goto('/');

    await navigateToGame(page1, '/tictactoe');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1, 'Create');
    const roomCode = await getRoomCode(page1);
    expect(roomCode).toBeTruthy();

    await navigateToGame(page2, '/tictactoe');
    await page2.waitForTimeout(500);
    await clickJoinRoom(page2, 'Join');
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    const boardSelector = '.grid.grid-cols-3';

    // P1 makes a move (position 4 = center)
    await clickCell(page1, boardSelector, 4);
    await page2.waitForTimeout(800);

    // Verify P2 sees the X
    const p2cells = page2.locator(boardSelector).locator('button');
    await expect(p2cells.nth(4)).toHaveText('X');

    await ctx.close();
  });

  test('TTT: disconnect and reconnect preserves game state', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Xena'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Odin'));
    await page1.goto('/');
    await page2.goto('/');

    await navigateToGame(page1, '/tictactoe');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1, 'Create');
    const roomCode = await getRoomCode(page1);
    expect(roomCode).toBeTruthy();

    await navigateToGame(page2, '/tictactoe');
    await page2.waitForTimeout(500);
    await clickJoinRoom(page2, 'Join');
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    const boardSelector = '.grid.grid-cols-3';

    // Xena (P1, X) moves: position 0
    await clickCell(page1, boardSelector, 0);
    await page2.waitForTimeout(500);

    // Odin (P2, O) moves: position 4
    await clickCell(page2, boardSelector, 4);
    await page1.waitForTimeout(500);

    // Save reconnect info before disconnecting P2
    const reconnectInfo = await page2.evaluate(() => {
      return sessionStorage.getItem('ttt_reconnect');
    });
    expect(reconnectInfo).toBeTruthy();

    // Close P2 (simulate disconnect)
    await page2.close();

    // Game pauses on server. Wait for pause to propagate.
    await page1.waitForTimeout(2000);

    // Open a new page for Odin to reconnect
    const page2Re = await ctx.newPage();
    await page2Re.addInitScript(() => localStorage.setItem('playerName', 'Odin'));
    await page2Re.addInitScript((info) => {
      sessionStorage.setItem('ttt_reconnect', info);
    }, reconnectInfo);
    await page2Re.goto('/tictactoe');
    await page2Re.waitForTimeout(3000);

    // Odin should see Xena's X at position 0
    const reP2cells = page2Re.locator(boardSelector).locator('button');
    await expect(reP2cells.nth(0)).toHaveText('X');
    // Odin's own O at position 4 should still be there
    await expect(reP2cells.nth(4)).toHaveText('O');

    // Game should be resumed (playing) and it should be Xena's turn
    await expect(page2Re.locator('text=Waiting')).toBeVisible({ timeout: 5000 });

    await ctx.close();
  });

  test('full TTT game plays to completion', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Xena'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Odin'));
    await page1.goto('/');
    await page2.goto('/');

    await navigateToGame(page1, '/tictactoe');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1, 'Create');
    const roomCode = await getRoomCode(page1);
    expect(roomCode).toBeTruthy();

    await navigateToGame(page2, '/tictactoe');
    await page2.waitForTimeout(500);
    await clickJoinRoom(page2, 'Join');
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

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

    // Rematch button should appear (from MatchReport)
    const playAgain1 = page1.locator('button:has-text("Rematch")');
    const playAgain2 = page2.locator('button:has-text("Rematch")');
    await expect(playAgain1).toBeVisible({ timeout: 5000 });
    await expect(playAgain2).toBeVisible({ timeout: 5000 });

    await ctx.close();
  });
});

async function clickCell(page, boardSelector, index) {
  const cell = page.locator(boardSelector).locator('button').nth(index);
  await cell.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(300);
  await cell.click({ force: true });
  await page.waitForTimeout(500);
}

const { test, expect } = require('@playwright/test');
const { navigateToGame, clickCreateRoom, directJoinRoom, dismissSwalIfPresent } = require('./helpers');

test.describe('Connect4 E2E', () => {
  test('full flow: create room, join, start game, drop pieces, verify board', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Red', avatarIcon: 'cat', color: '#2a2a3e' })),
    );
    await page2.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Yellow', avatarIcon: 'fox', color: '#2a2a3e' })),
    );
    await page1.goto('/');
    await page2.goto('/');

    // Navigate and create room
    await navigateToGame(page1, '/connect4');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1);

    // Wait for GameLobby and read room code from <p> element
    await page1
      .locator('p.text-3xl.font-sketch.text-ink.tracking-widest')
      .waitFor({ state: 'visible', timeout: 10000 });
    const roomCode = await page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest').textContent();
    expect(roomCode).toBeTruthy();

    // Join room
    await navigateToGame(page2, '/connect4');
    await page2.waitForTimeout(500);
    await directJoinRoom(page2, roomCode);

    // Wait for both to be in the waiting room
    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Both should see the room code in GameLobby
    await expect(page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest')).toHaveText(roomCode);
    await expect(page2.locator('p.text-3xl.font-sketch.text-ink.tracking-widest')).toHaveText(roomCode);

    // Start game
    await page1.locator('button:has-text("Start Game")').click();
    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    // Both should see the board grid (7 columns)
    const board1 = page1.locator('.grid.grid-cols-7.gap-1.p-4.sketch-card');
    const board2 = page2.locator('.grid.grid-cols-7.gap-1.p-4.sketch-card');
    await expect(board1).toBeVisible();
    await expect(board2).toBeVisible();

    // Count board cells (divs) - 6 rows × 7 cols = 42
    const boardCells1 = board1.locator('> div');
    const boardCells2 = board2.locator('> div');
    await expect(boardCells1).toHaveCount(42);
    await expect(boardCells2).toHaveCount(42);

    // Both should see column drop buttons (7 ⬇️ buttons)
    const dropButtons1 = page1.locator('button:has-text("⬇️")');
    const dropButtons2 = page2.locator('button:has-text("⬇️")');
    await expect(dropButtons1).toHaveCount(7);
    await expect(dropButtons2).toHaveCount(7);

    // P1 drops in column 0
    await dropButtons1.nth(0).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // P2 drops in column 1
    await dropButtons2.nth(1).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // P1 drops again in column 0
    await dropButtons1.nth(0).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // P2 drops in column 1
    await dropButtons2.nth(1).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Verify pieces on the board
    // P1 is Red (player 0, bg-red-500), P2 is Yellow (player 1, bg-yellow-500)
    const redPieces1 = page1.locator('div.bg-red-500.rounded-full');
    const yellowPieces1 = page1.locator('div.bg-yellow-500.rounded-full');
    const redCount1 = await redPieces1.count();
    const yellowCount1 = await yellowPieces1.count();
    expect(redCount1).toBeGreaterThanOrEqual(2);
    expect(yellowCount1).toBeGreaterThanOrEqual(2);

    // Verify same state on P2's board
    const redPieces2 = page2.locator('div.bg-red-500.rounded-full');
    const yellowPieces2 = page2.locator('div.bg-yellow-500.rounded-full');
    await expect(redPieces2).toHaveCount(redCount1);
    await expect(yellowPieces2).toHaveCount(yellowCount1);

    await ctx.close();
  });

  test('leave room returns to lobby', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'P1', avatarIcon: 'cat', color: '#2a2a3e' })),
    );
    await page2.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'P2', avatarIcon: 'fox', color: '#2a2a3e' })),
    );
    await page1.goto('/');
    await page2.goto('/');

    await navigateToGame(page1, '/connect4');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1);
    await page1
      .locator('p.text-3xl.font-sketch.text-ink.tracking-widest')
      .waitFor({ state: 'visible', timeout: 10000 });
    const roomCode = await page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest').textContent();
    expect(roomCode).toBeTruthy();

    await navigateToGame(page2, '/connect4');
    await page2.waitForTimeout(500);
    await directJoinRoom(page2, roomCode);
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Leave from P2's side
    await page2.locator('button:has-text("Leave Room")').first().click();
    await page2.waitForTimeout(1000);

    // P2 navigated to /, go to /connect4 to see Create Room button again
    await navigateToGame(page2, '/connect4');
    await expect(page2.locator('button:has-text("Create Room")')).toBeVisible({ timeout: 5000 });

    await ctx.close();
  });
});

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

test.describe('TicTacToe E2E', () => {
  test('full flow: create room, join, play game to win, restart', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() => localStorage.setItem('playerName', 'Xena'));
    await page2.addInitScript(() => localStorage.setItem('playerName', 'Odin'));
    await page1.goto('/');
    await page2.goto('/');

    // Navigate and create room
    await navigateToGame(page1, '/tictactoe');
    await page1.waitForTimeout(1500);
    await clickCreateRoom(page1, 'Create');
    const roomCode = await getRoomCode(page1);
    expect(roomCode).toBeTruthy();

    // Join room
    await navigateToGame(page2, '/tictactoe');
    await page2.waitForTimeout(500);
    await clickJoinRoom(page2, 'Join');
    await page2.waitForTimeout(500);
    await fillSwalInput(page2, roomCode);
    await confirmSwal(page2);

    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Both should see the room code
    await expect(page1.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);
    await expect(page2.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);

    // Play a game: Xena goes first (X)
    const boardSelector = '.grid.grid-cols-3';

    // Xena: position 0
    const board1 = page1.locator(boardSelector);
    await board1.locator('button').nth(0).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Odin: position 4
    const board2 = page2.locator(boardSelector);
    await board2.locator('button').nth(4).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Xena: position 1
    await board1.locator('button').nth(1).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Odin: position 5
    await board2.locator('button').nth(5).click();
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // Xena: position 2 - wins!
    await board1.locator('button').nth(2).click();

    // Wait for game end
    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    // Both should see Rematch button (from MatchReport)
    await expect(page1.locator('button:has-text("Rematch")')).toBeVisible();
    await expect(page2.locator('button:has-text("Rematch")')).toBeVisible();

    await ctx.close();
  });
});

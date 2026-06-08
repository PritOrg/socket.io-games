const { test, expect } = require('@playwright/test');
const { navigateToGame, clickCreateRoom, dismissSwalIfPresent } = require('./helpers');

test.describe('SOS E2E', () => {
  test('full flow: create room, join, start game, make moves', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Alice', avatarIcon: 'cat', color: '#2a2a3e' })),
    );
    await page2.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Bob', avatarIcon: 'fox', color: '#2a2a3e' })),
    );
    await page1.goto('/');
    await page2.goto('/');

    // Navigate and create room
    await navigateToGame(page1, '/sos');
    await page1.waitForTimeout(500);
    await clickCreateRoom(page1);

    // Wait for GameLobby and read room code from <p> element
    const roomCodeEl = page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest');
    await roomCodeEl.waitFor({ state: 'visible', timeout: 10000 });
    const roomCode = await roomCodeEl.textContent();
    expect(roomCode).toBeTruthy();

    // Navigate P2 to the game
    await navigateToGame(page2, '/sos');
    await page2.waitForTimeout(1000);

    // Fill room code and join
    const joinInput = page2.locator('input[placeholder="Room Code"]');
    await joinInput.waitFor({ state: 'visible', timeout: 5000 });
    await joinInput.fill(roomCode);
    await page2.locator('button:has-text("Join as Player")').click();

    // Wait for P2's GameLobby to appear
    const p2RoomCodeEl = page2.locator('p.text-3xl.font-sketch.text-ink.tracking-widest');
    await p2RoomCodeEl.waitFor({ state: 'visible', timeout: 10000 });

    // Both should see the room code in GameLobby
    await expect(page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest')).toHaveText(roomCode);
    await expect(p2RoomCodeEl).toHaveText(roomCode);

    // Dismiss any modals
    await dismissSwalIfPresent(page1);
    await dismissSwalIfPresent(page2);

    // Start game via host
    await page1.locator('button:has-text("Start Game")').click();
    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    // Both should see the game board with 36 cells (6x6 default)
    const grid1 = page1.locator('.grid.gap-1.p-4.sketch-card');
    const grid2 = page2.locator('.grid.gap-1.p-4.sketch-card');
    await expect(grid1).toBeVisible();
    await expect(grid2).toBeVisible();

    const cells1 = grid1.locator('button');
    const cells2 = grid2.locator('button');
    await expect(cells1).toHaveCount(36);
    await expect(cells2).toHaveCount(36);

    // Alice (P1) selects 'S' and places at row 0, col 0
    await page1.getByRole('button', { name: 'S', exact: true }).click();
    await cells1.nth(0).click();
    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    await expect(cells1.nth(0)).toHaveText('S');
    await expect(cells2.nth(0)).toHaveText('S');

    // Bob (P2) selects 'O' and places at row 0, col 1
    await page2.getByRole('button', { name: 'O', exact: true }).click();
    await cells2.nth(1).click();
    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    await expect(cells1.nth(1)).toHaveText('O');
    await expect(cells2.nth(1)).toHaveText('O');

    await ctx.close();
  });

  test('board size selection creates correct grid', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Tester', avatarIcon: 'cat', color: '#2a2a3e' })),
    );
    await page2.addInitScript(() =>
      localStorage.setItem('playerProfile', JSON.stringify({ name: 'Tester2', avatarIcon: 'fox', color: '#2a2a3e' })),
    );
    await page1.goto('/');
    await page2.goto('/');

    await navigateToGame(page1, '/sos');
    await page1.waitForTimeout(500);

    // Change board size to 4x4
    await page1.locator('select.sketch-input').selectOption('4');
    await page1.waitForTimeout(300);

    // Create room
    await clickCreateRoom(page1);
    const roomCodeEl = page1.locator('p.text-3xl.font-sketch.text-ink.tracking-widest');
    await roomCodeEl.waitFor({ state: 'visible', timeout: 10000 });
    const roomCode = await roomCodeEl.textContent();
    expect(roomCode).toBeTruthy();

    // P2 join
    await navigateToGame(page2, '/sos');
    await page2.waitForTimeout(1000);
    const joinInput = page2.locator('input[placeholder="Room Code"]');
    await joinInput.waitFor({ state: 'visible', timeout: 5000 });
    await joinInput.fill(roomCode);
    await page2.locator('button:has-text("Join as Player")').click();
    await page2
      .locator('p.text-3xl.font-sketch.text-ink.tracking-widest')
      .waitFor({ state: 'visible', timeout: 10000 });

    // Start game
    await page1.locator('button:has-text("Start Game")').click();
    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);

    // Verify 4x4 = 16 cells
    const grid = page1.locator('.grid.gap-1.p-4.sketch-card');
    await expect(grid.locator('button')).toHaveCount(16);

    await ctx.close();
  });
});

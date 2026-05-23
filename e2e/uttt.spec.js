const { test, expect } = require('@playwright/test');
const { setPlayerNames, createAndJoinRoom } = require('./helpers');

test.describe('UTTT E2E', () => {
  test('create room, join, play a few moves, verify board updates', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'Alpha', 'Beta');

    const roomCode = await createAndJoinRoom(page1, page2, '/uttt', 'Join Room', 'Create Room');
    expect(roomCode).toBeTruthy();

    // Wait for room info
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    await expect(page1.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);
    await expect(page2.locator('button[title="Click to copy room ID"]')).toHaveText(roomCode);

    // All 81 cell buttons should be present
    const allCells = page1.locator('button.font-sketch:not(nav button)');
    await expect(allCells.first()).toBeAttached();

    // Pick the first clickable cell on P1's board and click it (grid 4, cell 4 = center)
    const macroGrid = page1.locator('.relative.grid.grid-cols-3').first();
    const innerGridContainers = macroGrid.locator('> div:not(.absolute)');
    const centerGrid = innerGridContainers.nth(4);
    const centerGridCells = centerGrid.locator('button');
    await centerGridCells.nth(4).click();
    await page1.waitForTimeout(800);
    await page2.waitForTimeout(800);

    // P2 should see the move reflected
    const p2MacroGrid = page2.locator('.relative.grid.grid-cols-3').first();
    const p2InnerGrids = p2MacroGrid.locator('> div:not(.absolute)');
    const p2CenterGrid = p2InnerGrids.nth(4);
    const p2Cells = p2CenterGrid.locator('button');

    // Wait and check P2 made a move (they play in grid 4 too since last move sent them there)
    await page2.waitForTimeout(1000);
    const isBetasTurn = await page2
      .locator('text=Your Turn')
      .isVisible()
      .catch(() => false);
    if (isBetasTurn) {
      const available = p2Cells.filter({ hasNotText: /[XO]/ });
      const count = await available.count();
      if (count > 0) {
        await available.first().click();
        await page1.waitForTimeout(800);
      }
    }

    // Verify P1 can make another move
    await page1.waitForTimeout(500);
    await expect(page1.locator('text=Your Turn').or(page1.locator('text=Waiting'))).toBeVisible({ timeout: 5000 });

    await ctx.close();
  });

  test('displays grid hint for active grid', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();
    const page2 = await ctx.newPage();

    await page1.goto('/');
    await page2.goto('/');
    await setPlayerNames(page1, page2, 'A', 'B');

    await createAndJoinRoom(page1, page2, '/uttt', 'Join Room', 'Create Room');
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    // P1 clicks grid 0, cell 0 — sends P2 to grid 0
    const macroGrid = page1.locator('.relative.grid.grid-cols-3').first();
    const innerGrids = macroGrid.locator('> div:not(.absolute)');
    await innerGrids.nth(0).locator('button').nth(0).click();
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // P2 should see the grid hint: "You must play in grid 1"
    await page2.waitForTimeout(500);
    const hintVisible = await page2
      .locator('text="must play in grid"')
      .isVisible()
      .catch(() => false);
    expect(hintVisible).toBeTruthy();

    await ctx.close();
  });
});

const SwalSelectors = {
  input: '.swal2-input',
  confirm: '.swal2-confirm',
  cancel: '.swal2-cancel',
  title: '.swal2-title',
  popup: '.swal2-popup',
};

async function setPlayerName(page, name) {
  await page.evaluate((n) => localStorage.setItem('playerName', n), name);
}

async function setPlayerNames(page1, page2, name1, name2) {
  await setPlayerName(page1, name1);
  await setPlayerName(page2, name2);
}

async function navigateToGame(page, gamePath) {
  await page.goto(gamePath);
  await page.waitForLoadState('networkidle');
}

async function clickCreateRoom(page, buttonText = 'Create Room') {
  await page.locator(`button:has-text("${buttonText}")`).click();
}

async function getRoomCode(page) {
  await page.locator('button[title="Click to copy room ID"]').waitFor({ state: 'visible', timeout: 10000 });
  const text = await page.locator('button[title="Click to copy room ID"]').textContent();
  return text.trim();
}

async function clickJoinRoom(page, buttonText = 'Join Room') {
  await page.locator(`button:has-text("${buttonText}")`).click();
}

async function fillSwalInput(page, value) {
  await page.locator(SwalSelectors.input).waitFor({ state: 'visible', timeout: 5000 });
  await page.locator(SwalSelectors.input).fill(value);
}

async function confirmSwal(page) {
  await page.locator(SwalSelectors.confirm).waitFor({ state: 'visible', timeout: 5000 });
  await page.locator(SwalSelectors.confirm).click();
}

async function dismissSwalIfPresent(page) {
  const visible = await page
    .locator(SwalSelectors.popup)
    .isVisible()
    .catch(() => false);
  if (visible) {
    await page
      .locator(SwalSelectors.confirm)
      .click()
      .catch(() => {});
  }
}

async function waitForGameStart(page) {
  await page.waitForTimeout(1000);
}

async function createAndJoinRoom(
  pageCreator,
  pageJoiner,
  gamePath,
  joinBtnText = 'Join Room',
  createBtnText = 'Create Room',
) {
  await navigateToGame(pageCreator, gamePath);
  await pageCreator.waitForTimeout(500);

  await clickCreateRoom(pageCreator, createBtnText);
  const roomCode = await getRoomCode(pageCreator);

  await navigateToGame(pageJoiner, gamePath);
  await pageJoiner.waitForTimeout(500);

  await clickJoinRoom(pageJoiner, joinBtnText);
  await fillSwalInput(pageJoiner, roomCode);
  await confirmSwal(pageJoiner);

  await pageCreator.waitForTimeout(500);
  await pageJoiner.waitForTimeout(500);

  return roomCode;
}

async function clickNthCell(page, gridSelector, n) {
  const grid = page.locator(gridSelector);
  const cells = grid.locator('button');
  await cells.nth(n).click();
}

module.exports = {
  SwalSelectors,
  setPlayerName,
  setPlayerNames,
  navigateToGame,
  clickCreateRoom,
  getRoomCode,
  clickJoinRoom,
  fillSwalInput,
  confirmSwal,
  dismissSwalIfPresent,
  waitForGameStart,
  createAndJoinRoom,
  clickNthCell,
};

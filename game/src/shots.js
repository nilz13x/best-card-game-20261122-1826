// Ember Duel — deterministic screenshot scenes for ?shot=.
// The maker takes the entry's screenshots by loading the game with one of
// these queries; each stages a fixed, hand-built state (no randomness) and
// renders it, so the same URL always shows the same table.
//   ?shot=start — the title screen
//   ?shot=play  — a mid-game table: Depth 2, both hands in play
//   ?shot=win   — the victory screen
//   ?shot=lose  — the defeat screen
function shotState(shot) {
  const game = createGame(7);
  if (shot === 'start') {
    game.screen = 'title';
    return game;
  }
  if (shot === 'win') {
    game.screen = 'win';
    game.score = 412;
    game.turn = 14;
    game.cardsPlayed = 31;
    return game;
  }
  if (shot === 'lose') {
    game.screen = 'lose';
    game.score = 186;
    game.depth = 1;
    game.turn = 9;
    game.cardsPlayed = 19;
    game.enemy = freshEnemy(game, ENEMIES[1]);
    return game;
  }
  // The play shot: a real mid-game moment, staged by hand.
  startRun(game);
  game.depth = 1;
  game.enemy = freshEnemy(game, ENEMIES[1]);
  game.enemy.hp = 18;
  game.enemy.block = 4;
  game.enemy.burn = { dmg: 3, turns: 2 };
  game.enemy.hand = ['sear', 'drain', 'flicker'];
  game.player.hp = 24;
  game.player.block = 5;
  game.player.burn = null;
  game.player.energy = 2;
  game.hand = ['strike', 'guard', 'ember', 'heavy', 'focus'];
  game.drawPile = ['jab', 'mend', 'strike', 'guard', 'bulwark', 'ember', 'jab', 'focus'];
  game.discard = ['jab', 'guard'];
  game.turn = 6;
  game.score = 128;
  game.cardsPlayed = 12;
  game.log = ['Ash Wisp sears you for 7.', 'Turn 6 — your move.'];
  game.screen = 'play';
  return game;
}

function renderShot(shot) {
  shotMode = true;
  const game = shotState(shot);
  render(game);
  return game;
}

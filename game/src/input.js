// Ember Duel — mouse and keyboard: click a card or press 1–5 to play it,
// E or Space to end the turn, Enter to begin or play again, H for help,
// R to restart. In shot mode (screenshots) input is ignored so the scene
// stays exactly as staged.
let currentGame = null;
let shotMode = false;

function bindInput(game) {
  currentGame = game;
  document.getElementById('app').addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
}

function onClick(event) {
  if (shotMode || !currentGame) return;
  const game = currentGame;
  const card = event.target.closest('.card');
  if (card && game.screen === 'play') {
    const index = Number(card.getAttribute('data-index'));
    if (playCard(game, index)) render(game);
    else render(game);
    return;
  }
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  doAction(game, btn.getAttribute('data-action'));
}

function onKey(event) {
  if (shotMode || !currentGame) return;
  const game = currentGame;
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  if (key >= '1' && key <= '5' && game.screen === 'play') {
    const index = Number(key) - 1;
    playCard(game, index);
    render(game);
  } else if (key === 'e' || key === ' ') {
    if (game.screen === 'play') { endTurn(game); render(game); }
    event.preventDefault();
  } else if (key === 'enter') {
    if (game.screen === 'title' || game.screen === 'win' || game.screen === 'lose') {
      startRun(game); render(game);
    }
  } else if (key === 'h') {
    if (game.screen === 'play') { game.showHelp = !game.showHelp; render(game); }
  } else if (key === 'r') {
    if (game.screen !== 'title') { startRun(game); render(game); }
  }
}

function doAction(game, action) {
  if (action === 'start' || action === 'restart') {
    startRun(game);
  } else if (action === 'end') {
    endTurn(game);
  } else if (action === 'help') {
    game.showHelp = true;
  } else if (action === 'close-help') {
    game.showHelp = false;
  } else {
    return;
  }
  render(game);
}

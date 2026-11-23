// Ember Duel — boot: with ?shot=, stage a deterministic screenshot scene;
// otherwise open the title screen and hand the table to the player.
(function boot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const seed = Number(params.get('seed') || '20261123');
  if (shot === 'start' || shot === 'play' || shot === 'win' || shot === 'lose') {
    renderShot(shot);
    return;
  }
  const game = createGame(seed);
  bindInput(game);
  render(game);
})();

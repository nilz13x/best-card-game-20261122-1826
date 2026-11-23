// Ember Duel — every screen, drawn as DOM: the title, the table with both
// hands, and the win and loss screens. Cards are big and legible at a
// glance, suits told apart by colour and shape, values in large type.
function hpBar(hp, maxHp, cls) {
  const pct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  return '<div class="hpbar ' + cls + '"><div class="hpfill" style="width:' + pct + '%"></div>'
    + '<span class="hptext">' + Math.max(0, hp) + ' / ' + maxHp + '</span></div>';
}

function badge(label, value, cls) {
  if (!value) return '';
  return '<span class="badge ' + cls + '">' + label + ' ' + value + '</span>';
}

function playerCardHtml(id, index) {
  const card = CARDS[id];
  const kind = CARD_KINDS[card.kind];
  return '<div class="card kind-' + card.kind + '" data-index="' + index + '" data-key="' + (index + 1) + '">'
    + '<div class="card-cost">' + card.cost + '</div>'
    + '<div class="card-icon">' + kindIcon(card.kind, 44) + '</div>'
    + '<div class="card-name">' + card.name + '</div>'
    + '<div class="card-value">' + card.value + '</div>'
    + '<div class="card-kind">' + kind.label + '</div>'
    + '<div class="card-text">' + card.text + '</div>'
    + '<div class="card-key">' + (index + 1) + '</div>'
    + '</div>';
}

function foeCardHtml(id, isIntent) {
  const card = ENEMY_CARDS[id];
  return '<div class="foe-card' + (isIntent ? ' intent' : '') + '">'
    + (isIntent ? '<div class="intent-tag">NEXT</div>' : '')
    + '<div class="foe-card-name">' + card.name + '</div>'
    + '<div class="foe-card-value">' + card.value + '</div>'
    + '<div class="foe-card-text">' + card.text + '</div>'
    + '</div>';
}

function depthPips(depth) {
  let out = '';
  for (let i = 0; i < ENEMIES.length; i++) {
    out += '<span class="pip' + (i < depth ? ' done' : i === depth ? ' now' : '') + '"></span>';
  }
  return out;
}

function renderTitle(game) {
  const best = readBest();
  const samples = ['strike', 'guard', 'ember'].map(function (id, i) {
    return playerCardHtml(id, i);
  }).join('');
  return '<div class="title-screen">'
    + '<div class="title-sigil">' + playerSigil(84) + '</div>'
    + '<h1>EMBER DUEL</h1>'
    + '<p class="tagline">A card battler in three depths</p>'
    + '<div class="sample-hand">' + samples + '</div>'
    + '<button class="big-btn" data-action="start">Begin the Descent</button>'
    + '<p class="press-enter">or press Enter</p>'
    + '<div class="howto"><b>How to play</b>'
    + '<span>Play cards with the mouse or keys 1–5. Each turn you gain 3 energy.</span>'
    + '<span>Read the foe\u2019s hand: its leftmost card is what it plays next.</span>'
    + '<span>Clear all three depths to win. If your health reaches 0, the ember fades.</span>'
    + '</div>'
    + (best ? '<p class="best">Best score: ' + best + '</p>' : '')
    + '</div>';
}

function renderTable(game) {
  const you = game.player;
  const foe = game.enemy;
  const foeCards = foe.hand.map(function (id, i) { return foeCardHtml(id, i === 0); }).join('');
  const hand = game.hand.map(function (id, i) { return playerCardHtml(id, i); }).join('');
  const energy = Array.from({ length: you.energy }, function () { return '<span class="epip full"></span>'; }).join('')
    + Array.from({ length: Math.max(0, PLAYER_MAX_ENERGY - you.energy) }, function () { return '<span class="epip"></span>'; }).join('');
  const log = game.log[game.log.length - 1] || '';
  return '<div class="table">'
    + '<header class="topbar">'
    + '<div class="brand">' + playerSigil(30) + '<span>EMBER DUEL</span></div>'
    + '<div class="depth">Depth ' + (game.depth + 1) + ' / ' + ENEMIES.length + ' ' + depthPips(game.depth) + '</div>'
    + '<div class="top-stats">Score <b>' + game.score + '</b> &nbsp;·&nbsp; Deck ' + game.drawPile.length + ' &nbsp;·&nbsp; Discard ' + game.discard.length + '</div>'
    + '<button class="icon-btn" data-action="help" title="How to play">?</button>'
    + '<button class="icon-btn" data-action="restart" title="Restart run">&#8635;</button>'
    + '</header>'
    + '<section class="foe-zone">'
    + '<div class="foe-portrait">' + sigilFor(foe.def.sigil, 110) + '</div>'
    + '<div class="foe-info"><div class="foe-name">' + foe.def.name + '</div>'
    + '<div class="foe-title">' + foe.def.title + '</div>'
    + hpBar(foe.hp, foe.maxHp, 'foe')
    + '<div class="badges">' + badge('Block', foe.block, 'block') + badge('Burn', foe.burn ? foe.burn.dmg : 0, 'burn') + '</div>'
    + '</div>'
    + '<div class="foe-hand"><div class="foe-hand-label">The foe\u2019s hand — leftmost plays next</div>' + foeCards + '</div>'
    + '</section>'
    + '<div class="midbar"><div class="log">' + log + '</div>'
    + '<div class="energy">' + energy + '<span class="energy-num">' + you.energy + ' energy</span></div>'
    + '<button class="end-btn" data-action="end">End Turn</button>'
    + '</div>'
    + '<section class="you-zone">'
    + '<div class="you-panel"><div class="you-label">You</div>'
    + hpBar(you.hp, you.maxHp, 'you')
    + '<div class="badges">' + badge('Block', you.block, 'block') + badge('Burn', you.burn ? you.burn.dmg : 0, 'burn') + '</div>'
    + '<div class="turn-line">Turn ' + game.turn + '</div></div>'
    + '<div class="hand">' + hand + '</div>'
    + '</section>'
    + '<footer class="hints">Keys 1–5 play a card &nbsp;·&nbsp; E ends the turn &nbsp;·&nbsp; H help &nbsp;·&nbsp; R restart</footer>'
    + (game.showHelp ? helpOverlay() : '')
    + '</div>';
}

function helpOverlay() {
  return '<div class="overlay"><div class="help-box"><h2>How to play</h2>'
    + '<p><b>Your turn:</b> click a card or press 1–5 to play it. Each card costs energy; you gain 3 energy every turn.</p>'
    + '<p><b>Suits:</b> red triangle attacks, blue square blocks, orange flame burns the foe over two turns, green heart heals you, purple star gives energy and a draw.</p>'
    + '<p><b>The foe:</b> its hand is face up. The leftmost card, marked NEXT, is what it plays when you end your turn — guard before a big hit, mend after a burn.</p>'
    + '<p><b>Winning:</b> clear all three depths. Your score grows with every card played and every foe beaten.</p>'
    + '<button class="big-btn" data-action="close-help">Back to the table</button>'
    + '</div></div>';
}

function renderWin(game) {
  saveBest(game.score);
  return '<div class="end-screen win">'
    + '<div class="end-sigil">' + playerSigil(72) + '</div>'
    + '<h1>THE DUNGEON IS YOURS</h1>'
    + '<p class="end-sub">All three depths are cleared. The ember burns on.</p>'
    + '<div class="final-score">' + game.score + '</div><div class="final-label">final score</div>'
    + '<p class="end-stats">Turns ' + game.turn + ' &nbsp;·&nbsp; Cards played ' + game.cardsPlayed + '</p>'
    + '<button class="big-btn" data-action="restart">Play Again</button>'
    + '<p class="press-enter">or press Enter</p>'
    + '</div>';
}

function renderLose(game) {
  saveBest(game.score);
  return '<div class="end-screen lose">'
    + '<h1>THE EMBER FADES</h1>'
    + '<p class="end-sub">The ' + (game.enemy ? game.enemy.def.name : 'dungeon') + ' claims another spark.</p>'
    + '<div class="final-score">' + game.score + '</div><div class="final-label">final score</div>'
    + '<p class="end-stats">Reached Depth ' + (game.depth + 1) + ' &nbsp;·&nbsp; Turns ' + game.turn + ' &nbsp;·&nbsp; Cards played ' + game.cardsPlayed + '</p>'
    + '<button class="big-btn" data-action="restart">Try Again</button>'
    + '<p class="press-enter">or press Enter</p>'
    + '</div>';
}

function readBest() {
  try {
    const v = window.localStorage.getItem('ember-duel-best');
    return v ? Number(v) : 0;
  } catch (e) { return 0; }
}

function saveBest(score) {
  try {
    const best = readBest();
    if (score > best) window.localStorage.setItem('ember-duel-best', String(score));
  } catch (e) { /* storage unavailable: the game plays on without it */ }
}

function render(game) {
  const app = document.getElementById('app');
  if (game.screen === 'title') app.innerHTML = renderTitle(game);
  else if (game.screen === 'win') app.innerHTML = renderWin(game);
  else if (game.screen === 'lose') app.innerHTML = renderLose(game);
  else app.innerHTML = renderTable(game);
  markPlayable(game);
}

// After rendering, dim the cards the player cannot afford this turn.
function markPlayable(game) {
  if (game.screen !== 'play') return;
  const cards = document.querySelectorAll('#app .card');
  cards.forEach(function (el) {
    const index = Number(el.getAttribute('data-index'));
    el.classList.toggle('playable', canPlay(game, index));
  });
}

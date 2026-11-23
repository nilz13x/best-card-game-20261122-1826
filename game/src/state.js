// Ember Duel — the rules engine: turns, energy, draw, block, burn, win/lose.
// Pure logic, no DOM: render.js draws this state, input.js drives it.
// A turn: the player spends up to 3 energy playing cards, then ends the
// turn; the foe's burn ticks, the foe plays its telegraphed intent card, and
// a new turn begins. Block fades at the start of its owner's next turn.
// Burn ignores block and ticks at the start of the afflicted side's turn.
const MAX_HAND = 5;
const PLAYER_MAX_HP = 30;
const PLAYER_MAX_ENERGY = 3;

function createGame(seed) {
  return {
    screen: 'title',
    seed: seed,
    rng: makeRng(seed),
    depth: 0,
    turn: 1,
    score: 0,
    cardsPlayed: 0,
    player: { hp: PLAYER_MAX_HP, maxHp: PLAYER_MAX_HP, block: 0, burn: null, energy: PLAYER_MAX_ENERGY },
    enemy: null,
    drawPile: [],
    hand: [],
    discard: [],
    log: ['The dungeon waits. Press Enter or click Begin.'],
  };
}

function freshEnemy(game, def) {
  const deck = shuffleInto(def.deck, game.rng);
  const enemy = {
    def: def, hp: def.hp, maxHp: def.hp, block: 0, burn: null,
    deck: deck, hand: [], discard: [],
  };
  for (let i = 0; i < 3 && enemy.deck.length > 0; i++) enemy.hand.push(enemy.deck.pop());
  return enemy;
}

function startRun(game) {
  game.depth = 0;
  game.turn = 1;
  game.score = 0;
  game.cardsPlayed = 0;
  game.player = { hp: PLAYER_MAX_HP, maxHp: PLAYER_MAX_HP, block: 0, burn: null, energy: PLAYER_MAX_ENERGY };
  game.drawPile = shuffleInto(STARTING_DECK, game.rng);
  game.hand = [];
  game.discard = [];
  game.log = [];
  startDepth(game);
  game.screen = 'play';
  logLine(game, 'Depth 1 — the Cinder Rat blocks the way!');
}

function startDepth(game) {
  game.enemy = freshEnemy(game, ENEMIES[game.depth]);
  game.player.block = 0;
  game.player.energy = PLAYER_MAX_ENERGY;
  drawToHand(game, MAX_HAND);
}

function drawCards(game, n) {
  for (let i = 0; i < n; i++) {
    if (game.drawPile.length === 0) {
      if (game.discard.length === 0) return;
      game.drawPile = shuffleInto(game.discard, game.rng);
      game.discard = [];
    }
    game.hand.push(game.drawPile.pop());
  }
}

function drawToHand(game, target) {
  drawCards(game, Math.max(0, target - game.hand.length));
}

function logLine(game, text) {
  game.log.push(text);
  if (game.log.length > 3) game.log.shift();
}

function damageFoe(game, amount) {
  const foe = game.enemy;
  const absorbed = Math.min(foe.block, amount);
  foe.block -= absorbed;
  foe.hp -= (amount - absorbed);
  return amount - absorbed;
}

function damagePlayer(game, amount) {
  const you = game.player;
  const absorbed = Math.min(you.block, amount);
  you.block -= absorbed;
  you.hp -= (amount - absorbed);
  return amount - absorbed;
}

function tickBurn(game, side) {
  const who = side === 'enemy' ? game.enemy : game.player;
  if (!who.burn) return;
  const dmg = who.burn.dmg;
  who.hp -= dmg;
  who.burn.turns -= 1;
  if (who.burn.turns <= 0) who.burn = null;
  logLine(game, (side === 'enemy' ? who.def.name : 'You') + ' burn for ' + dmg + '.');
}

function canPlay(game, index) {
  const card = game.hand[index];
  if (!card || game.screen !== 'play') return false;
  return game.player.energy >= CARDS[card].cost;
}

function playCard(game, index) {
  if (game.screen !== 'play') return false;
  const id = game.hand[index];
  if (!id) return false;
  const card = CARDS[id];
  if (game.player.energy < card.cost) {
    logLine(game, 'Not enough energy for ' + card.name + '.');
    return false;
  }
  game.player.energy -= card.cost;
  game.hand.splice(index, 1);
  game.discard.push(id);
  game.cardsPlayed += 1;
  game.score += 2;

  if (card.kind === 'attack') {
    const dealt = damageFoe(game, card.value);
    logLine(game, card.name + ' hits the ' + game.enemy.def.name + ' for ' + dealt + '.');
  } else if (card.kind === 'block') {
    game.player.block += card.value;
    logLine(game, card.name + ': you gain ' + card.value + ' block.');
  } else if (card.kind === 'burn') {
    const foe = game.enemy;
    foe.burn = { dmg: Math.max(card.value, foe.burn ? foe.burn.dmg : 0), turns: 2 };
    logLine(game, card.name + ': the ' + foe.def.name + ' burns for ' + card.value + '.');
  } else if (card.kind === 'heal') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + card.value);
    logLine(game, card.name + ': you mend ' + card.value + ' health.');
  } else if (card.kind === 'focus') {
    game.player.energy += card.value;
    drawCards(game, 1);
    logLine(game, card.name + ': +1 energy, draw 1.');
  }
  return checkDepthCleared(game);
}

// The foe plays its intent: the leftmost card of its visible hand.
function enemyAct(game) {
  const foe = game.enemy;
  const id = foe.hand.shift();
  if (!id) return;
  foe.discard.push(id);
  const card = ENEMY_CARDS[id];
  if (card.damage) {
    const dealt = damagePlayer(game, card.damage);
    logLine(game, foe.def.name + ' plays ' + card.name + ' for ' + dealt + '.');
  } else if (card.block) {
    foe.block += card.block;
    logLine(game, foe.def.name + ' plays ' + card.name + ': +' + card.block + ' block.');
  }
  if (card.burn) {
    const you = game.player;
    you.burn = { dmg: Math.max(card.burn, you.burn ? you.burn.dmg : 0), turns: 2 };
    logLine(game, 'You burn for ' + card.burn + '.');
  }
  if (card.heal) {
    foe.hp = Math.min(foe.maxHp, foe.hp + card.heal);
    logLine(game, foe.def.name + ' drains ' + card.heal + ' health.');
  }
  if (foe.deck.length === 0) {
    foe.deck = shuffleInto(foe.discard, game.rng);
    foe.discard = [];
  }
  if (foe.deck.length > 0) foe.hand.push(foe.deck.pop());
}

function checkDepthCleared(game) {
  if (game.enemy.hp > 0) return true;
  const bonus = 100 + game.player.hp;
  game.score += bonus;
  logLine(game, game.enemy.def.name + ' falls! +' + bonus + ' score.');
  if (game.depth >= ENEMIES.length - 1) {
    game.score += 50;
    game.screen = 'win';
    return true;
  }
  game.depth += 1;
  startDepth(game);
  logLine(game, 'Depth ' + (game.depth + 1) + ' — the ' + game.enemy.def.name + ' appears!');
  return true;
}

function loseGame(game) {
  game.screen = 'lose';
  logLine(game, 'The ember fades…');
}

function endTurn(game) {
  if (game.screen !== 'play') return;
  // The foe's burn ticks, then it plays its telegraphed card.
  tickBurn(game, 'enemy');
  if (game.enemy.hp <= 0) { checkDepthCleared(game); return; }
  game.enemy.block = 0;
  enemyAct(game);
  if (game.player.hp <= 0) { loseGame(game); return; }
  // A new turn: your burn ticks, your block fades, energy refills, draw up.
  game.turn += 1;
  tickBurn(game, 'player');
  if (game.player.hp <= 0) { loseGame(game); return; }
  game.player.block = 0;
  game.player.energy = PLAYER_MAX_ENERGY;
  drawToHand(game, MAX_HAND);
  logLine(game, 'Turn ' + game.turn + ' — your move.');
}

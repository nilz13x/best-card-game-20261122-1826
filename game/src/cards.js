// Ember Duel — the card catalogue: every card the player can draw.
// Each card has a cost (energy), a kind, a value, and a suit told apart by
// colour and shape, never by text alone: attack is a red triangle, block a
// blue square, burn an orange circle, heal a green heart, focus a purple star.
const CARD_KINDS = {
  attack: { label: 'Attack', shape: 'triangle', color: '#c23b2e', dark: '#8e2318' },
  block:  { label: 'Block',  shape: 'square',   color: '#2e6fc2', dark: '#1d4a86' },
  burn:   { label: 'Burn',   shape: 'circle',   color: '#e07b1f', dark: '#9c4d08' },
  heal:   { label: 'Heal',   shape: 'heart',    color: '#2e9e5b', dark: '#1d6b3a' },
  focus:  { label: 'Focus',  shape: 'star',     color: '#7a4fd0', dark: '#4f2a99' },
};

const CARDS = {
  strike:   { id: 'strike',   name: 'Strike',     cost: 1, kind: 'attack', value: 6,  text: 'Deal 6 damage.' },
  heavy:    { id: 'heavy',    name: 'Heavy Blow', cost: 2, kind: 'attack', value: 11, text: 'Deal 11 damage.' },
  jab:      { id: 'jab',      name: 'Quick Jab',  cost: 0, kind: 'attack', value: 3,  text: 'Deal 3 damage.' },
  guard:    { id: 'guard',    name: 'Guard',      cost: 1, kind: 'block',  value: 6,  text: 'Gain 6 block.' },
  bulwark:  { id: 'bulwark',  name: 'Bulwark',    cost: 2, kind: 'block',  value: 12, text: 'Gain 12 block.' },
  ember:    { id: 'ember',    name: 'Ember',      cost: 1, kind: 'burn',   value: 3,  text: 'Burn 3: the foe takes 3 at the start of its turn, twice.' },
  mend:     { id: 'mend',     name: 'Mend',       cost: 2, kind: 'heal',   value: 5,  text: 'Restore 5 health.' },
  focus:    { id: 'focus',    name: 'Focus',      cost: 0, kind: 'focus',  value: 1,  text: 'Gain 1 energy. Draw 1 card.' },
};

// The deck the player starts every run with: 13 cards, shuffled each run.
const STARTING_DECK = [
  'strike', 'strike', 'strike', 'heavy', 'jab', 'jab',
  'guard', 'guard', 'bulwark', 'ember', 'ember', 'mend', 'focus',
];

// Small deterministic RNG (mulberry32) so a seeded run plays the same way.
function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInto(deck, rng) {
  const pile = deck.slice();
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pile[i]; pile[i] = pile[j]; pile[j] = tmp;
  }
  return pile;
}

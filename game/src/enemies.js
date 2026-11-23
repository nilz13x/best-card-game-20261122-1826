// Ember Duel — the dungeon's three depths and what each foe plays.
// Every enemy draws from its own small deck into a visible hand of three
// cards; the leftmost is its intent, the card it plays next, so the player
// can read the foe and answer it (guard before a slam, mend after a burn).
const ENEMIES = [
  {
    id: 'rat', name: 'Cinder Rat', title: 'Depth 1 · The Burrows',
    hp: 28, sigil: 'rat', color: '#b0713a',
    deck: ['bite', 'bite', 'gnaw', 'bite', 'gnaw', 'scurry'],
  },
  {
    id: 'wisp', name: 'Ash Wisp', title: 'Depth 2 · The Grey Halls',
    hp: 36, sigil: 'wisp', color: '#8a6fd0',
    deck: ['sear', 'sear', 'drain', 'sear', 'drain', 'flicker'],
  },
  {
    id: 'warden', name: 'Magma Warden', title: 'Depth 3 · The Burning Gate',
    hp: 50, sigil: 'warden', color: '#c23b2e',
    deck: ['slam', 'slam', 'magma', 'slam', 'magma', 'quake'],
  },
];

// An enemy card's effect: damage, block or healing for itself, and burn it
// puts on the player. All values are shown on the card face.
const ENEMY_CARDS = {
  bite:    { id: 'bite',    name: 'Bite',    value: 6,  damage: 6,  text: 'Bite for 6.' },
  gnaw:    { id: 'gnaw',    name: 'Gnaw',    value: 4,  damage: 4,  burn: 2, text: 'Gnaw for 4. You burn 2.' },
  scurry:  { id: 'scurry',  name: 'Scurry',  value: 5,  block: 5,  text: 'The rat hides: it gains 5 block.' },
  sear:    { id: 'sear',    name: 'Sear',    value: 8,  damage: 8,  text: 'Sear for 8.' },
  drain:   { id: 'drain',   name: 'Drain',   value: 5,  damage: 5,  heal: 5, text: 'Drain for 5. The wisp heals 5.' },
  flicker: { id: 'flicker', name: 'Flicker', value: 8,  block: 8,  text: 'The wisp vanishes: it gains 8 block.' },
  slam:    { id: 'slam',    name: 'Slam',    value: 10, damage: 10, text: 'Slam for 10.' },
  magma:   { id: 'magma',   name: 'Magma',   value: 7,  damage: 7,  burn: 3, text: 'Magma for 7. You burn 3.' },
  quake:   { id: 'quake',   name: 'Quake',   value: 14, damage: 14, text: 'Quake for 14.' },
};

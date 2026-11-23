// Ember Duel — all artwork is inline SVG, drawn by code: no image files,
// no network, and the same shapes render identically in every browser.
// Card suits are told apart by colour and shape: attack is a red triangle,
// block a blue square, burn an orange flame, heal a green heart, focus a
// purple star. Each foe has its own sigil for the table.
function kindShape(kind) {
  if (kind === 'attack') return '<polygon points="32,8 56,54 8,54" fill="#fff"/>';
  if (kind === 'block') return '<rect x="13" y="13" width="38" height="38" rx="7" fill="#fff"/>';
  if (kind === 'burn') return '<path d="M32 5 C44 20 52 28 52 40 A20 20 0 1 1 12 40 C12 28 20 20 32 5 Z" fill="#fff"/>';
  if (kind === 'heal') return '<path d="M32 56 C14 42 8 31 12 21 C15 13 25 11 32 19 C39 11 49 13 52 21 C56 31 50 42 32 56 Z" fill="#fff"/>';
  return '<polygon points="32,5 39,24 59,24 43,36 49,56 32,44 15,56 21,36 5,24 25,24" fill="#fff"/>';
}

function kindIcon(kind, size) {
  const def = CARD_KINDS[kind];
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">'
    + '<circle cx="32" cy="32" r="30" fill="' + def.color + '"/>'
    + kindShape(kind) + '</svg>';
}

function sigilFor(id, size) {
  if (id === 'rat') {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">'
      + '<polygon points="14,24 19,4 31,17" fill="#8a5426"/>'
      + '<polygon points="50,24 45,4 33,17" fill="#8a5426"/>'
      + '<circle cx="32" cy="37" r="21" fill="#b0713a"/>'
      + '<circle cx="24" cy="33" r="3.5" fill="#1c1210"/><circle cx="40" cy="33" r="3.5" fill="#1c1210"/>'
      + '<ellipse cx="32" cy="45" rx="4" ry="3" fill="#e58aa0"/>'
      + '<line x1="14" y1="44" x2="26" y2="46" stroke="#e8dcc8" stroke-width="1.6"/>'
      + '<line x1="50" y1="44" x2="38" y2="46" stroke="#e8dcc8" stroke-width="1.6"/>'
      + '<line x1="14" y1="49" x2="26" y2="48" stroke="#e8dcc8" stroke-width="1.6"/>'
      + '<line x1="50" y1="49" x2="38" y2="48" stroke="#e8dcc8" stroke-width="1.6"/>'
      + '</svg>';
  }
  if (id === 'wisp') {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">'
      + '<path d="M32 4 C44 20 54 28 54 42 A22 22 0 1 1 10 42 C10 28 20 20 32 4 Z" fill="#8a6fd0"/>'
      + '<path d="M32 26 C38 33 42 37 42 44 A10 10 0 1 1 22 44 C22 37 26 33 32 26 Z" fill="#c9b8f2"/>'
      + '<circle cx="25" cy="40" r="3" fill="#1c1210"/><circle cx="39" cy="40" r="3" fill="#1c1210"/>'
      + '</svg>';
  }
  // Magma Warden: a horned helm.
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">'
    + '<path d="M14 30 Q2 22 6 8 Q16 16 21 27 Z" fill="#e8dcc8"/>'
    + '<path d="M50 30 Q62 22 58 8 Q48 16 43 27 Z" fill="#e8dcc8"/>'
    + '<path d="M12 50 A20 20 0 0 1 52 50 L52 56 L12 56 Z" fill="#c23b2e"/>'
    + '<rect x="20" y="38" width="24" height="6" rx="3" fill="#1c1210"/>'
    + '<rect x="30" y="38" width="4" height="14" fill="#8e2318"/>'
    + '</svg>';
}

// The player's sigil: a small ember knight's helm, used on the player panel.
function playerSigil(size) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">'
    + '<path d="M32 4 C44 20 52 28 52 40 A20 20 0 1 1 12 40 C12 28 20 20 32 4 Z" fill="#f5b942"/>'
    + '<path d="M32 26 C38 33 42 37 42 44 A10 10 0 1 1 22 44 C22 37 26 33 32 26 Z" fill="#c23b2e"/>'
    + '</svg>';
}

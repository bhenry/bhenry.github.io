let store = {};

store.get = function(k){
  return JSON.parse(localStorage.getItem(k));
};

store.put = function(k, v){
  localStorage.setItem(k, JSON.stringify(v));
};

store.card = function(card){
  let [ri, si] = card.identifier.split("-").map(Number);
  return {
    rank_index: ri,
    suit_index: si,
    cards_below: card.cards_below,
    facing_up: !!card.facing_up
  };
};

store.pile = function(pile){
  return {
    location: pile.location,
    in_hand: !!pile.in_hand,
    cards: pile.cards.map(c => store.card(c))
  };
};

store.game = function(game){
  return {
    state: {
      board_height: game.state.board_height,
      hand_height: game.state.hand_height
    },
    piles: Object.values(game.piles).filter(p => p.cards.length).map(p => store.pile(p))
  };
};

store.save = function(game){
  store.put(game.uid, store.game(game));
};

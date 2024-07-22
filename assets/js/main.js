let game = {};
game.state = {};
game.game = document.getElementById("game");
game.board = document.getElementById("board");
game.hand = document.getElementById("hand");
game.piles = {};
game.pile = function(cards, coords){
  let p = {};
  p.cards = cards;
  p.location = coords;

  p.render = function(){
    let c = p.cards[0];
    if (!c){
      return;
    }
    c.cards_below = p.cards.length - 1;
    game.piles[p.cards[0].identifier] = p;
    game.save();
    c.div.style.top = `${p.location[0]}px`;
    c.div.style.left = `${p.location[1]}px`;
    c.render();
    $(c.div).droppable({
      greedy: true,
      drop: function(event, ui){
        let dragging_card = ui.draggable.data("c");
        dragging_card.cards_below = p.cards.length;
        delete game.piles[c.identifier];
        p.cards.unshift(dragging_card);
        $(c.div).droppable('disable');
        p.render();
      }
    }).droppable('enable');
    $(c.div).draggable({
      containment: "div#game",
      stack: "#game .card",
      distance: 6,
      start: function(e, ui){
        clearTimeout(util.menuTimer);
        $(c.div).off('mouseup');
        c.div.classList.remove("pile-13", "pile-26", "pile-39", "pile-52");
        p.cards.shift();
        p.render();
      }
    }).css({position: "absolute", top: p.location[0], left: p.location[1]});
    game.game.append(c.div);
  }
  return p;
};

$(game.board).droppable({
  drop: function(event,ui){
    let new_card = ui.draggable.data("c");
    new_card.cards_below = 0;
    let new_pile = game.pile([new_card],[new_card.div.style.top, new_card.div.style.left]);
    new_pile.render();
  }
}).resizable({
  handles: {s: '.resizer'},
  stop: function(e, ui){
    game.state.board_height = $(game.board).height();
    game.save();
  }
});

$(game.hand).droppable({
  drop: function(event,ui){
    let new_card = ui.draggable.data("c");
    new_card.cards_below = 0;
    let new_pile = game.pile([new_card],[new_card.div.style.top, new_card.div.style.left]);
    new_pile.in_hand = true;
    new_pile.render();
  }
}).resizable({
  handles: {s: '.resizer'},
  stop: function(e, ui){
    game.state.hand_height = $(game.hand).height();
    game.save();
  }
}).css({height: game.state.board_height});

game.save = function(){
  store.save(game);
};

game.set = function(data){
  game.state.board_height = data.state.board_height;
  game.state.hand_height = data.state.hand_height;
  $(game.board).css({height: data.state.board_height});
  $(game.hand).css({height: data.state.hand_height});
  data.piles.forEach(function(p){
    let cards = p.cards.map(c => util.make_card(game.save, c));
    game.pile(cards, p.location).render();
  });
};

game.reset = function(){
  Object.values(game.piles).map(function(p){
    p.cards.map(function(c){
      $(c.div).remove();
    });
  });
  game.piles = {};
  let d = util.shuffle(util.make_deck(game.save));
  let p = game.pile(util.shuffle(d), [0,0]);
  game.piles[p.cards[0].identifier] = p;
  game.set(store.game(game));
};

game.start = function(){
  let data = store.get(game.uid);
  if (data){
    game.set(data);
  } else {
    game.reset();
  }
};

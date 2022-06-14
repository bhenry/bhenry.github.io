var Game = {};
Game.content = $("div#content");
Game.timeToAnswer = 60 * 1000;

Game.board = function(){
  return Game.content.find("div.board");
};

Game.equationParts = function(){
  return Game.board().find(".equation-parts");
};

Game.randomInteger = function() {
  min = Math.ceil(1);
  max = Math.floor(9);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Game.players = {};

Game.playerCount = function(){ return Object.keys(Game.players).length };

Game.addPlayer = function(playername, playerbuzzer) {
  var playerDisplay = $("<div class='player'></div>");
  var nameDisplay = $("<h2></h2>").text(playername);
  var buzzerHumanForm = Game.buzzerOptions[playerbuzzer];
  var buzzerLabel = $("<p></p>").text("buzzer: " + buzzerHumanForm);
  var scoreDisplay = $("<p></p>").text("score: ");
  var score = $("<span></span>").text("0");
  scoreDisplay.append(score);
  playerDisplay.append(nameDisplay, scoreDisplay, buzzerLabel);
  var player = {};
  player.name = playername;
  player.score = score;
  Game.players[playerbuzzer] = player;
  delete Game.buzzerOptions[playerbuzzer];
  Game.content.find("div.players").append(playerDisplay);

  if (Game.playerCount() == 2) {
    Game.showStartButton();
  }
};

Game.buzzerOptions = {}
Game.buzzerOptions[8] = "Delete";
Game.buzzerOptions[9] = "Tab";
Game.buzzerOptions[13] = "Enter";
Game.buzzerOptions[16] = "Shift";
Game.buzzerOptions[17] = "Ctrl";
Game.buzzerOptions[20] = "CapsLock";
Game.buzzerOptions[27] = "Escape";
Game.buzzerOptions[32] = "SpaceBar";
Game.buzzerOptions[191] = "/";
Game.buzzerOptions[220] = "\\";
Game.buzzerOptions[190] = ".";
Game.buzzerOptions[222] = "'";
Game.buzzerOptions[187] = "=";
Game.buzzerOptions[192] = "`";

Game.buzzerOption = function(code, display){
  return $("<option value='" + code + "'></option>").text(display);
}

Game.addBuzzerOptions = function(buzzer){
  Object.keys(Game.buzzerOptions).forEach(function(key) {
    buzzer.append(Game.buzzerOption(key, Game.buzzerOptions[key]));
  });
};

Game.displayUserForm = function() {
  var playernumber = Game.playerCount() + 1;
  var formContainer = $("<div class='user-form'></div>");
  var form = $("<form></form>");
  var label = $("<p></p>").text("Player " + playernumber + ", enter your name");
  var nameinput = $("<input class='playername' type='text' maxlength='12'></input>");
  var buzzerlabel = $("<p></p>").text("Choose your buzzer key:");
  var buzzer = $("<select class='buzzer'></select>");
  Game.addBuzzerOptions(buzzer);
  var button = $("<input type='submit' value='add'></input>");

  form.append(label, nameinput, buzzerlabel, buzzer, button);

  formContainer.append(form);
  $("div.players").prepend(formContainer);

  form.submit(function(event){
    event.preventDefault();
    playername = nameinput.val();
    if (playername) {
      Game.addPlayer(nameinput.val(), buzzer.val());
      formContainer.remove();
      if (playernumber < 6) {
        Game.displayUserForm();
      }
    }
  });

  nameinput.focus();
};

Game.displayPlayerList = function(){
  players = $("<div class='players'></div>");
  Game.content.prepend(players);
};

Game.displayGameArea = function(){
  gamearea = $("<div class='board'></div>");
  Game.content.append(gamearea);
};

Game.showStartButton = function(){
  var button = $("<input id='startgame' type='submit' value='Start Game'></input>");

  button.click(function(e){
    e.preventDefault();
    Game.start();
  });
  Game.board().append(button);
};

Game.start = function(){
  //remove the start button and the user form
  Game.content.find("input#startgame").remove();
  Game.content.find("div.user-form").remove();

  //display the numbers for the equation
  var equationParts = $("<div id='problem' class='equation-parts'></div>")
  var numbers = $("<span></span>").addClass("numbers");
  var oneCount = 0;
  for (i = 1; i <= 4; i++) {
    var random = Game.randomInteger();
    if (random == 1){
      if (oneCount > 0){
        random = random + Game.randomInteger();
        if (random > 9){
          random = 4;
        }
      }
      oneCount++;
    }
    var number = $("<h1 class='equation-part number number" + i + "'></h1>").text(random);
    numbers.append(number);
  }
  equationParts.append(numbers);

  Game.board().append(equationParts);
  Game.addSkipButton();

  //bind the buzzer handlers
  $( document ).off('keydown', Game.buzzIn);
  $( document ).on('keydown', Game.buzzIn);

};

Game.addSkipButton = function(){
  var skipButtonContainer = $("<div></div>").addClass("skip-button");
  var skipButton = $("<input type='submit' value='skip'></input>");
  skipButton.on("click", Game.skipQuestion);
  skipButtonContainer.append(skipButton);
  Game.board().append(skipButtonContainer);
};

Game.buzzIn = function(e){
  e.preventDefault();
  var buzzer = e.which;
  var player = Game.players[buzzer];
  if (player){
    //unbind the buzzer handlers
    $( document ).off('keydown', Game.buzzIn);
    Game.removeSkipButton();
    Game.equationMaker(player);
    //start timer
    Game.answerTimer = setTimeout(function(){
      alert(player.name + " took too long to answer and loses a point.");
      Game.wrongAnswer(player);
    }, Game.timeToAnswer);
  }
};

Game.wrongAnswer = function(player){
  var equationParts = Game.board().find("div.equation-parts");
  equationParts.find("span.parens").remove();
  equationParts.find("span.operations").remove();
  equationParts.find("span.delete").remove();
  equationParts.find("span.numbers").removeClass("disabled");
  equationParts.find("span.numbers h1.number").removeClass("unavailable disabled");
  Game.resetBuilder();
  Game.addSkipButton();
  equationParts.removeClass("shrunken");
  Game.changeScore(player, -1);
  //bind the buzzer handlers
  $( document ).on('keydown', Game.buzzIn);
};

Game.equationPart = function(text){
  return $("<h1></h1>").addClass("equation-part").html(text);
};

Game.equationMaker = function(player){
  //shrink boxes
  var equationParts = Game.equationParts();
  equationParts.addClass("shrunken");

  //add parens
  var parens = $("<span></span>").addClass("parens");
  var leftp = Game.equationPart("(").addClass("leftp");
  var rightp = Game.equationPart(")").addClass("rightp disabled");
  parens.append(leftp, rightp);
  equationParts.append(parens);

  //add operations
  var operations = $("<span></span>").addClass("operations").addClass('disabled');
  var add = Game.equationPart("+");
  var subtract = Game.equationPart("-");
  var multiply = Game.equationPart("*"); //Game.equationPart("&times;");
  var divide = Game.equationPart("/");   //Game.equationPart("&divide;");
  operations.append(add, subtract, multiply, divide);

  //add delete button
  var deleter = $("<span></span>").addClass("delete").addClass("disabled");
  var deleteButton = $("<h1></h1>").addClass("equation-part").text("<<");
  deleter.append(deleteButton);

  equationParts.append(operations, deleter);

  var builder = $("<div></div>").addClass("builder");
  var helperText = player.name + "'s answer: ";
  var helper = $("<div></div>").addClass("helper").text(helperText);
  var equation = $("<div></div>").addClass("equation shrunken");
  var buttonContainer = $("<div></div>").addClass("answer-button");
  var button = $("<input id='answer' type='submit' value='submit' disabled='disabled'></input>").addClass("equation shrunken");

  buttonContainer.append(button)
  builder.append(helper, equation, buttonContainer);
  Game.board().append(builder);

  //add click handlers
  equationParts.find("h1").on("click", Game.editEquation);
  button.click(function(e){
    Game.submitAnswer(player, equation);
  });
};

Game.resetBuilder = function(){
  var equationParts = Game.equationParts();
  equationParts.find("h1").off("click", Game.editEquation);
  Game.content.find("div.builder").remove();
  Game.equation = [];
}

Game.skipQuestion = function(){
  Game.content.find("div#problem").remove();
  Game.removeSkipButton();
  Game.resetBuilder();
  Game.start();
};

Game.removeSkipButton = function(){
  Game.board().find("div.skip-button").remove();
};

Game.changeScore = function(player, diff){
  scoreElement = player.score;
  oldScore = parseInt(scoreElement.text());
  scoreElement.text(oldScore + diff);
};

Game.submitAnswer = function(player, equation){
  clearTimeout(Game.answerTimer);
  var value = eval(equation.text());

  if(value == 24){
    alert("Correct! +1 point for " + player.name + ". Press OK for the next question.");
    Game.changeScore(player, 1)
    Game.skipQuestion();
  }else{
    alert("Incorrect! That equals " + value + "! -1 point for " + player.name + ".");
    Game.wrongAnswer(player);
  }

};

Game.buttonEnabled = function(button){
  return !(button.hasClass("disabled") || button.parent().hasClass("disabled"));
};

Game.editEquation = function(e){
  e.preventDefault();
  if (!Game.buttonEnabled($(this))){
    //don't allow clicking the disabled ones
    return;
  }
  clicked = $(this);
  if (clicked.parent().hasClass("delete")){
    //delete the last thing
    Game.equation.pop().removeClass("unavailable");
  }else{
    //add thing to equation
    Game.equation.push(clicked);
  }
  Game.renderEquation();
};

Game.renderEquation = function(){
  //rendering
  var equation = Game.board().find("div.equation").html("");
  for (i = 0; i < Game.equation.length; i++){
    var button = Game.equation[i];
    var thing = Game.equationPart(button.text());
    if (button.parent().hasClass("numbers")){
      button.addClass("unavailable");
    }
    equation.append(thing);
  }

  //handle delete button status
  if (Game.equation.length > 0){
    Game.board().find("span.delete").removeClass("disabled");
  }else{
    Game.board().find("span.delete").addClass("disabled");
  }

  var lastThing = Game.equation[Game.equation.length - 1];
  var secondToLast = Game.equation[Game.equation.length - 2];
  var leftp = Game.board().find("h1.leftp");
  var rightp = Game.board().find("h1.rightp");
  var leftpCount = (equation.text().match(/\(/g) || []).length;
  var rightpCount = (equation.text().match(/\)/g) || []).length;
  var numbers = Game.board().find("span.numbers");
  var operations = Game.board().find("span.operations");
  var submit = Game.board().find("input#answer");

  if (leftpCount == rightpCount && numbers.find(".unavailable").length == 4){
    submit.prop("disabled", false);
  }else{
    submit.prop("disabled", true);
  }

  if (leftpCount - rightpCount > 0){
    rightp.removeClass("disabled");
  } else {
    rightp.addClass("disabled");
  } //set rightp status here and overwrite where applicable

  if (lastThing){
    if (lastThing.parent().hasClass("numbers")){
      numbers.addClass("disabled");
      operations.removeClass("disabled");
      leftp.addClass("disabled");
    } else if (lastThing.parent().hasClass("operations")){
      numbers.removeClass("disabled");
      operations.addClass("disabled");
      leftp.removeClass("disabled");
      rightp.addClass("disabled");
    } else if (lastThing.hasClass("rightp")){
      leftp.addClass("disabled");
      operations.removeClass("disabled");
      numbers.addClass("disabled");
    } else if (lastThing.hasClass("leftp")){
      numbers.removeClass("disabled");
      operations.addClass("disabled");
      rightp.addClass("disabled");
      leftp.addClass("disabled");
    }
  } else {
    numbers.removeClass("disabled");
    operations.addClass("disabled");
    leftp.removeClass("disabled");
    rightp.addClass("disabled");
  }

  //edge cases
  var remainingCount = numbers.find("h1").not(".unavailable").length;
  if (remainingCount <= 0){
    operations.addClass("disabled");
  }
};

Game.equation = [];

$( document ).ready(function() {
    // when page loads
    Game.displayPlayerList();
    Game.displayGameArea();
    Game.displayUserForm();
    //for testing
    // Game.addPlayer("User 1", 8);
    // Game.addPlayer("User 2", 9);
    // Game.start();
    // var e = jQuery.Event("keydown");
    // e.which = 8;
    // $(document).trigger(e);


});

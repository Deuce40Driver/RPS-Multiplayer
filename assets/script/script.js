// Firebase configuration
var config = {
    apiKey: "AIzaSyCHp_a6ZqFR6Kngcw8HOKhsgWeaqdrZwCg",
    authDomain: "rock-paper-scissors-live.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-live.firebaseio.com",
    projectId: "rock-paper-scissors-live",
    storageBucket: "",
    messagingSenderId: "863352612570",
    appId: "1:863352612570:web:34fd9366ed84f8d3"
};

// Initialize Firebase
firebase.initializeApp(config);

// VARIABLES
var database = firebase.database();
var ref = database.ref();

var playerOneRef = database.ref('players/playerOne');
var playerTwoRef = database.ref('players/playerTwo');

var chatOneRef = firebase.database().ref('chat/playerOne');
var chatTwoRef = firebase.database().ref('chat/playerTwo');

//var newMessageRef = chatRef.push();
/*  Push new message to Chat database
        newMessageRef.set({
          'userId': '',
          'text': '',
          'timeStamp': 0
        });
*/

// Initial Values
var name = "";
var wins = 0;
var losses = 0;
var guess = "";
var guessed = false;


// Page load event
$(document).ready(function() {
    ref.once('value')
      .then(function(snapshot) { 
        if(snapshot.child('players/playerOne').exists()) {
          $("#play1-name").empty();
          $("<span>").attr("id", "show-name1").appendTo("#play1-name");
          $("#show-name1").text(snapshot.child('players/playerOne/name').val()).addClass("display-4");
          $("#play1-wins").text(snapshot.child('players/playerOne/wins').val()).addClass("display-4");
          $("#play1-losses").text(snapshot.child('players/playerOne/losses').val()).addClass("display-4");
        };
        if(snapshot.child('players/playerTwo').exists()) {
          $("#play2-name").empty();
          $("<span>").attr("id", "show-name2").appendTo("#play2-name");
          $("#show-name2").text(snapshot.child('players/playerTwo/name').val()).addClass("display-4");
          $("#play2-wins").text(snapshot.child('players/playerTwo/wins').val()).addClass("display-4");
          $("#play2-losses").text(snapshot.child('players/playerTwo/losses').val()).addClass("display-4");
        };
      }, function(errorObject) {
        console.log("Error logged: " + errorObject);
      });
});

// FUNCTIONS + EVENTS

// PLayer 1 Start Button
$("#play1-start-button").on("click", function(event) {
    event.preventDefault();
    // Capture playerOne's name
    name = $('input').val();
    // Push playerOne object to Firebase
    playerOneRef.set({
        name: name,
        wins: wins,
        losses: losses,
        guess: guess,
        guessed: guessed
    });
    // Populate DOM with data from snapshot
    ref.on("value", function(snapshot) {
        console.log("PlayerOne: " + snapshot.child('players/playerOne').val());
        $("#play1-name").empty();
        $("<span>").attr("id", "show-name1").appendTo("#play1-name");
        $("#show-name1").text(snapshot.child('players/playerOne/name').val()).addClass("display-4");
        $("#play1-wins").text(snapshot.child('players/playerOne/wins').val()).addClass("display-4");
        $("#play1-losses").text(snapshot.child('players/playerOne/losses').val()).addClass("display-4");
    }, function(errorObject) {
        console.log("Error logged: " + errorObject);
    });
});


// Player 2 Start Button
$("#play2-start-button").on("click", function(event) {
  event.preventDefault();
  // Capture playerOne's name
  name = $('input').val();
  // Push playerOne object to Firebase
  playerTwoRef.set({
      name: name,
      wins: wins,
      losses: losses,
      guess: guess,
      guessed: guessed
  });
  // Populate DOM with data from snapshot
  ref.on("value", function(snapshot) {
      console.log("PlayerTwo: " + snapshot.child('players/playerTwo').val());
      $("#play2-name").empty();
      $("<span>").attr("id", "show-name2").appendTo("#play2-name");
      $("#show-name2").text(snapshot.child('players/playerTwo/name').val()).addClass("display-4");
      $("#play2-wins").text(snapshot.child('players/playerTwo/wins').val()).addClass("display-4");
      $("#play2-losses").text(snapshot.child('players/playerTwo/losses').val()).addClass("display-4");
  }, function(errorObject) {
      console.log("Error logged: " + errorObject);
  });
});


// Event to capture PLayer 1's choice
$("#player-1-Button").on("click", function(){
  var guess = $(this).val();
  playerOneRef.child('guess').set(guess);
  playerOneRef.child('guessed').set(true);
});

// Event to capture PLayer 2's choice
$("#player-2-Button").on("click", function(){
  var guess = $(this).val();
  playerTwoRef.child('guess').set(guess);
  playerTwoRef.child('guessed').set(true);
});



// Game function when both players have guessed
ref.on("value", function(snapshot) {
  if (snapshot.child("players/playerOne/guessed").val() == true && snapshot.child("players/playerTwo/guessed").val() == true) {
      var choice1 = snapshot.child("players/playerOne/guess").val();
      var choice2 = snapshot.child("players/playerTwo/guess").val();
      var result;
      if ((choice1 == "rock" && choice2 == "rock") || (choice1 == "paper" && choice2 == "rock") || (choice1 == "scissors" && choice2 == "paper")) {  
          console.log("Winner: Player 1");
          playerOneRef.child('guess').set("");
          playerTwoRef.child('guess').set("");

          wins = wins++
          playerOneRef.child('wins').set(wins);
          playerTwoRef.child('losses').set(losses++);
          result = 0;
      };
      if ((choice1 == "rock" && choice2 == "paper") || (choice1 == "paper" && choice2 == "scissors") || (choice1 == "scissors" && choice2 == "rock")) {  
          console.log("Winner: Player 2");
          playerOneRef.child('guess').set("");
          playerTwoRef.child('guess').set("");

          playerTwoRef.child('wins').set(wins++);
          playerOneRef.child('losses').set(losses++);
          result = 1;
      };
      if ((choice1 == "rock" && choice2 == "rock") || (choice1 == "paper" && choice2 == "paper") || (choice1 == "scissors" && choice2 == "scissors")) {  
          console.log("Tie Game. Try again.");
          playerOneRef.child('guess').set("");
          playerTwoRef.child('guess').set("");
          result = 2;
      };
      switch(result) {
          case 0:
              console.log("Winner: Player 1");
              break;
          case 1:
              console.log("Winner: Player 2");
              break;
          case 2:
              console.log("Tie Game");
              break;
      };
  }; 
}, function(errorObject) {
  console.log("Error logged: " + errorObject);
});



// Leave button 1 clears user info from database
$("#leave-game1").on("click", function() {
    playerOneRef.remove()  
        .then(function() {
            console.log("Remove succeeded.")
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
});

// Leave button 2 clears user info from database
$("#leave-game2").on("click", function() {
    playerTwoRef.remove()  
    .then(function() {
        console.log("Remove succeeded.")
    })
    .catch(function(error) {
        console.log("Remove failed: " + error.message)
    });
});


      /*          $("#play1-name").empty();

                  <form>
                    <div class="form-group">
                      <input id="player-name" class="form-control form-control-lg" type="text" placeholder="Enter Name">
                      <br>
                      <button id="play1-start-button" type="submit" class="btn btn-secondary">Start</button>
                    </div>        
                  </form>
        */


//_________________________________________________________________________________________________________________________
//_________________________________________________________________________________________________________________________
// MAIN PROCESS + INITIAL CODE
// --------------------------------------------------------------------------------



/*
 If player 1 exists
 set player 2
 else set player 1


 ref.onDisconnect(clearDatabase());

*/







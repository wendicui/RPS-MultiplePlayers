//connect firebase
	 var config = {
	    apiKey: "AIzaSyAod5TSvCj8MYsXYKUiwX814ZrKQNwX1EE",
	    authDomain: "trial-fa16e.firebaseapp.com",
	    databaseURL: "https://trial-fa16e.firebaseio.com",
	    projectId: "trial-fa16e",
	    storageBucket: "trial-fa16e.appspot.com",
	    messagingSenderId: "94331143015"
	  };
	  firebase.initializeApp(config);
//when player come into the room, gave ID: Player 1, Player 2
	var playerID = 0;
	var data = firebase.database()
	var qual = 0;
	//check whether the game is on, then means whether peole leave or come
	var begin = false;
	var player = 0;
	var otherChoose = 0
	//prevent user click multiple times in the same round
	var round = false
	//win or lose
	var status
	var win = 0;
	var lose = 0;
//push player to database

	data.ref("player").once("value", function(snapshot){

		if(snapshot.hasChild("player2") && snapshot.hasChild("player1")){

			alert("full")
			

		}else if(snapshot.hasChild("player1") && !snapshot.hasChild("player2")){
			data.ref("player").set({
				player2: 2,
				player1: 1
			})
			playerID = 2;
		}else if (snapshot.hasChild("player2") && !snapshot.hasChild("player1")){
			data.ref("player").set({
				player1: 1,
				player2: 2
			})
			playerID = 1;
		}else{
			data.ref("player").set({
				player1: 1
			})
			playerID = 1;
		}
	})

	
	// data.ref("player").set({
	// 			player: player
	// })

	// data.ref("player").on("value",function(snapshot){

	// 			player = snapshot.val().player
	// 		})
//function start, start next round
	function start(){
		setTimeout(function(){
			$("#yourChoice").attr("src", "");
			$("#OtherChoice").attr("src", "");
			data.ref("choice").set({
			
			})
			setTimeout(function(){round = false;},1000)
			
		},3000)

	}

//function newGame, start another game
function newGame(){
	win = 0;
	lose = 0;

	$("#win").html(win)
	$("#lose").html(lose)

	data.ref("dialogue").set({
			
	})

	$("#chathistory").html("")
}

//leave function

	$("#leave"). on("click", function(){
		if(playerID === 1){
			data.ref("player").set({
				player2:2
				})
		}else if(playerID === 2){
			data.ref("player").set({
				player1: 1
				})
		}

		
		round = true;

	})
//alert people
	data.ref("player/player1").on("value", function(snapshot){
		if(playerID === 2 && begin === true){
			alert("Opponent left");
			begin = false
			newGame()

		}else if(playerID === 2 && begin != true){
			alert("New Opponent join, Begin Battle!")
			newGame()
		}
	})

		data.ref("player/player2").on("value", function(snapshot){
		if(playerID === 1 && begin === true){
			alert("Opponent left");
			begin = false
			newGame()
		}

		else if(playerID === 1 && begin != true){
			alert("New Opponent join, Begin Battle!")
			newGame()
		}
	})

//move what you choose to choice region.

	$(".play").on("click", function(){

		if(round === false && playerID != 0){
			begin = true;
			$("#yourChoice").attr("src", $(this).attr("src"))
			qual = $(this).attr("qual")
			round = true;
			console.log(" round begin")
			upload();
			
			
		}
	})

//upload choice 

	function upload(){
		
		if(playerID === 1 ){
			console.log("Uploading")
			data.ref("choice/player1").set({
			choose: qual
			})
		}else{
			console.log("Uploading")
			data.ref("choice/player2").set({
			choose: qual
			})
		}
	}

//wait till all party choose
	
	data.ref("choice").on("value", function(snapshot){

		if(snapshot.hasChild("player2") && snapshot.hasChild("player1")){
			if(playerID === 1){
				otherChoose = snapshot.val().player2.choose
				
			
			}else{
				otherChoose = snapshot.val().player1.choose	
							
			}
			add()
			compare();
		}
	})


// add other choose to page
	function add(){
		$("#OtherChoice").attr("src", "Assets/Img/" + otherChoose + ".jpg")
	}

//compare win or lose
	function compare(){
	
		qual = parseInt(qual);
		otherChoose = parseInt(otherChoose)
			
		if(qual === otherChoose){ 
			status = "tie"	
			//console.log("tie")
		}else if ( qual=== 1 && otherChoose === 2){
			status = "lose"
			lose ++
			//console.log("lose")
		}else if( qual ===2 &&otherChoose ===3){
			status = "lose"
			lose ++
			//console.log("lose")

		}else if( qual ===3 && otherChoose ===1){
			status = "lose"
			lose ++
			//console.log("lose")

		}else{
			status = "win"
			win++
			//console.log("win")

		}

		
		$("#win").html(win)
		$("#lose").html(lose)
		start();
	
	}







//dialogue----------------------------------------------------------------------
	//update input infor
	$(".button").on("click", function(event){

		event.preventDefault();
		
		var input = $("#input").val().trim()
		data.ref("dialogue").push({
			history:"player " + playerID + "says: " + input
		})

		$("#input").val("")
	})

	//display dialogue		
	data.ref("dialogue").on("child_added", function(snapshot){
		var info = snapshot.val();
		var newContent =  info.history + "\n"
		$("#chathistory").append(newContent)

		 var psconsole = $('#chathistory');
	     psconsole.scrollTop(psconsole[0].scrollHeight);
	
	})
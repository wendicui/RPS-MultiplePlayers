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
	var begin = false;
	var player = 0;
	var otherChoose = 0
	//prevent user click multiple times in the same round
	var round = false
	var status
	var win = 0;
	var lose = 0;
//push player to database

	data.ref("player").once("value", function(snapshot){

		if(snapshot.hasChild("player2")){

			alert("full")
			begin = true;

		}else if(snapshot.hasChild("player1")){
			data.ref("player").set({
				player2: 2,
				player1: 1
			})
			playerID = 2;
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
//function begin
	function start(){
		setTimeout(function(){
			$("#yourChoice").attr("src", "");
			$("#OtherChoice").attr("src", "");
			data.ref("choice").set({
			
			})
		},3000)

	}



	$("#begin"). on("click", function(){
		begin = true;
		round = false;
		start()

	})
//move what you choose to choice region.

	$(".play").on("click", function(){

		if(round === false){
			$("#yourChoice").attr("src", $(this).attr("src"))
			qual = $(this).attr("qual")
			round = true;
			upload();
			console.log("beforeshow")
			
		}
	})

//upload choice 

	function upload(){
		if(playerID === 1 ){
			data.ref("choice/player1").set({
			choose: qual
			})
		}else{
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
		console.log("add")
	}

//compare win or lose
	function compare(){
	
		qual = parseInt(qual);
		otherChoose = parseInt(otherChoose)
			
		if(qual === otherChoose){ 
			status = "tie"	
			console.log("tie")
		}else if ( qual=== 1 && otherChoose === 2){
			status = "lose"
			lose ++
			console.log("lose")
		}else if( qual ===2 &&otherChoose ===3){
			status = "lose"
			lose ++
			console.log("lose")

		}else if( qual ===3 && otherChoose ===1){
			status = "lose"
			lose ++
			console.log("lose")

		}else{
			status = "win"
			win++
			console.log("win")

		}

		round = false;
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
			history:playerID + ": " + input
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


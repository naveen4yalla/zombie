
//c384def2bccd35bb06d1e19236644d640e86ecac46af8a43adc3c550c5137be2
//0x2Bfc1118c784fb8e1C50fA628B38005f50eF2815
const CONTRACT_ADDRESS = "0x2Bfc1118c784fb8e1C50fA628B38005f50eF2815"
//configuration.networks['5777'].address;
const CONTRACT_ABI = cryptoZombiesABI;

const web3 = new Web3(
Web3.givenProvider || 'http://127.0.0.1:7545'
);
const cryptoZombies = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
function startApp() {
 
cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
   .on("data", function (event) {
     let data = event.returnValues;
     getZombiesByOwner(userAccount).then(displayZombies);
   }).on("error", console.error);

}





//Js functions
function displayZombies(ids) {
  $("#txStatus").empty();  
  $("#zombies").empty();
     for (id of ids) {
    // for (let [index, id] of ids){
       getZombieDetails(id)
         .then(function (zombie) {

          var temp = zombie.dna.slice(-1);
           $("#zombies").append(`<div class="zombie row-image">
           <div class ="column-image">
           <ul>
               <li>ID:${zombie.id}</li>
               <li class="${zombie.id}">Name: ${zombie.name}</li>
               <button onclick="editName(${zombie.id},'name')" type="submit" class="${zombie.id}">Edit</button>
  <button onclick="editDone('name',${zombie.id},${zombie.id},${zombie.level})" style="display:none;" type="submit" class="${zombie.id}">Done</button>
               <li class="${zombie.id}">DNA: ${zombie.dna}</li>
               <button onclick="editName(${zombie.id},'dna')" type="submit" class="${zombie.id}">Edit</button>
               <button onclick="editDone('dna',${zombie.id},${zombie.id},${zombie.level})" style="display:none;" type="submit" class="${zombie.id}">Done</button>
               <li>Level: ${zombie.level}</li>
               <li>Wins: ${zombie.winCount}</li>
               <li>Losses: ${zombie.lossCount}</li>
               <li>Ready Time: ${zombie.readyTime}</li>
             </ul>
             </div>
             <div class ="column-image">
             <img src="images/${temp}.jpg" alt="Paris" width="200" height="230">
             </div>
           </div>`);
         });
     }
   }
   function displayHumans(ids) {
    console.log(ids);
    $("#zombies").empty();
    for (id of ids) {

      getHumanDetails(id)
        .then(function (zombie) {


          $("#zombies").append(`<div class="zombie">
            <ul>
              <li>Name: ${zombie.name}</li>
              <li>DNA: ${zombie.dna}</li>
            </ul>
          </div>`);
        });
    }

  }

  
function createRandomZombie(name) {

  $("#txStatus").empty();
     $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
     
     return cryptoZombies.methods.createRandomZombie(name)
       .send({ from: userAccount })
       .on("receipt", function (receipt) {
         $("#txStatus").text("Successfully created " + name + "!");

         getZombiesByOwner(userAccount).then(displayZombies);
       })
       .on("error", function (error) {

         $("#txStatus").text(error);
       });
   }

  

   function levelUp(zombieId) {
    $("#txStatus").empty();
     $("#txStatus").text("Leveling up your zombie...");
     return cryptoZombies.methods.levelUp(zombieId)
       .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
       .on("receipt", function (receipt) {
         $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
       })
       .on("error", function (error) {
         $("#txStatus").text(error);
       });
   }

   function getZombieDetails(id) {
     return cryptoZombies.methods.zombies(id).call()
   }
   function getHumanDetails(id){
   
     return  cryptoZombies.methods.humans(id).call()
   }

   function zombieToOwner(id) {
     return cryptoZombies.methods.zombieToOwner(id).call()
   }

   function getZombiesByOwner(owner) {
     return cryptoZombies.methods.getZombiesByOwner(owner).call()
   }
   function getAllHumans(owner){

     return cryptoZombies.methods.getAllHumans(owner).call()
   }

   //edit even listners
   function editName(index,text){
    var end_button;
    var paragraph;
    var edit_button;
    console.log(text,index)
    if (text=="name")
    {  console.log(text)
     end_button = document.getElementsByClassName(index)[2];
     paragraph = document.getElementsByClassName(index)[0];
     edit_button = document.getElementsByClassName(index)[1];}
    else{
    
       end_button = document.getElementsByClassName(index)[5];
       paragraph = document.getElementsByClassName(index)[3];
       edit_button = document.getElementsByClassName(index)[4];
    }
    end_button.style.display = "inline";
    paragraph.contentEditable = true;
    paragraph.style.backgroundColor = "#dddbdb";
  }
  function editDone(text,index,id,level){
    $("#txStatus").empty();
    var end_button;
    var paragraph;
    var edit_button;

    if (text=="name"){
      end_button = document.getElementsByClassName(index)[2];
      paragraph = document.getElementsByClassName(index)[0];
      edit_button = document.getElementsByClassName(index)[1];}
      else{
        end_button = document.getElementsByClassName(index)[5];
        paragraph = document.getElementsByClassName(index)[3];
        edit_button = document.getElementsByClassName(index)[4];
      }
    end_button.style.display = "none";
    paragraph.contentEditable = false;
    paragraph.style.backgroundColor = "#ffe44d";
    if(text=="name"){
    if (paragraph.innerHTML && (parseInt(level)>=2)){
      cryptoZombies.methods.changeName(parseInt(id),String(paragraph.innerHTML))
       .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
       .on("receipt", function (receipt) {
         $("#txStatus").text("Name change successfull");
       })
       .on("error", function (error) {
         $("#txStatus").text(error);
       });
    }
    else{
      alert("The zombie level should be 4 to change the name")
      paragraph.contentEditable = false;
      paragraph.style.backgroundColor = "#ffe44d";
    }
  }
  else{
    var temp  = parseInt(paragraph.innerHTML);
    if (temp.isNumber== false ||temp>=100){
      alert("The dna should be given in number and less than 100")
      paragraph.contentEditable = false;
      paragraph.style.backgroundColor = "#ffe44d";

    }
    if (paragraph.innerHTML && (parseInt(level)>=20) && temp<=100){
    
       cryptoZombies.methods.changeDna(parseInt(id),parseInt(paragraph.innerHTML))
       .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
       .on("receipt", function (receipt) {
         $("#txStatus").text("Dna change Successfull");
       })
       .on("error", function (error) {
         $("#txStatus").text(error);
       });
    }
    else{
      alert("The zombie level should be 20 to change the dna");
      paragraph.contentEditable = false;
      paragraph.style.backgroundColor = "#ffe44d";
    }
  }
    
 
 
 
  } 
  function feedOnHumans(a,b,c){
    $("#txStatus").empty();
    cryptoZombies.methods.feedOnHumans(parseInt(a),parseInt(b),String(c))
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function (receipt) {
      $("#txStatus").text("New Zombie Added");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });

  }
  function attackOnOtherZombies(a,b){
    $("#txStatus").empty();
    cryptoZombies.methods.attack(parseInt(a),parseInt(b))
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function (receipt) {
     $("#txStatus").text("Attack success");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
  //  var id = getZombiesByOwner(parseInt(a))
   // $("#zombieswin").empty()
   // $("#zombieswin").append(`<div class="zombie">
   // <ul>
    //  <li>Wins: ${id.winCount}</li>
   // </ul>
 // </div>`);
  }

  function transferZombie(a,b,c){
    $("#txStatus").empty();
    cryptoZombies.methods.transferFrom(a,c,parseInt(b))
    .send({ from: a, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function (receipt) {
     $("#txStatus").text("Attack success");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
  }
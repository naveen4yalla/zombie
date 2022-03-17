
const CONTRACT_ADDRESS = "0xf1A6986c149d62F191232E0bdccB090e53a1Ec29"
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
   
     $("#zombies").empty();
     for (id of ids) {

       getZombieDetails(id)
         .then(function (zombie) {


           $("#zombies").append(`<div class="zombie">
             <ul>
               <li>Name: ${zombie.name}</li>
               <li>DNA: ${zombie.dna}</li>
               <li>Level: ${zombie.level}</li>
               <li>Wins: ${zombie.winCount}</li>
               <li>Losses: ${zombie.lossCount}</li>
               <li>Ready Time: ${zombie.readyTime}</li>
             </ul>
           </div>`);
         });
     }
   }
function createRandomZombie(name) {


     $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
      console.log("hello")
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

   function feedOnKitty(zombieId, kittyId) {
     $("#txStatus").text("Eating a kitty. This may take a while...");
     return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
       .send({ from: userAccount })
       .on("receipt", function (receipt) {
         $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
         getZombiesByOwner(userAccount).then(displayZombies);
       })
       .on("error", function (error) {
         $("#txStatus").text(error);
       });
   }

   function levelUp(zombieId) {
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

   function zombieToOwner(id) {
     return cryptoZombies.methods.zombieToOwner(id).call()
   }

   function getZombiesByOwner(owner) {
     console.log("ddddd")
     return cryptoZombies.methods.getZombiesByOwner(owner).call()
   }
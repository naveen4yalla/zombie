pragma solidity ^0.4.25;

import "./zombiefactory.sol";

contract KittyInterface {
  function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
  );
}

contract ZombieFeeding is ZombieFactory {
 uint humanFee = 0.001 ether;
  KittyInterface kittyContract;
   struct Human {
    uint name;
    uint dna;
  }
  mapping (uint => address) public humanToZombie;
  mapping (address => uint) public ownerZombieHumanCount;
  Human[] public humans;
  constructor() public{
   for (uint i = 0; i <10; i++) {
       uint rand = uint(keccak256(abi.encodePacked(i)));
       humans.push(Human(i,rand%(10**16)));
   }
  }

  modifier onlyOwnerOf(uint _zombieId) {
    require(msg.sender == zombieToOwner[_zombieId]);
    _;
  }

  function setKittyContractAddress(address _address) external onlyOwner {
    kittyContract = KittyInterface(_address);
  }

  function _triggerCooldown(Zombie storage _zombie) internal {
    _zombie.readyTime = uint32(now + cooldownTime);
  }

  function _isReady(Zombie storage _zombie) internal view returns (bool) {
      return (_zombie.readyTime <= now);
  }

  function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    require(_isReady(myZombie));
    _targetDna = _targetDna % dnaModulus;
    uint newDna = (myZombie.dna + _targetDna) / 2;
    if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
      newDna = newDna - newDna % 100 + 99;
    }
    _createZombie("NoName", newDna);
    _triggerCooldown(myZombie);
  }

  function feedOnKitty(uint _zombieId, uint _kittyId) public {
    uint kittyDna;
    (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
    feedAndMultiply(_zombieId, kittyDna, "kitty");
  }


  function feedAndMutiplies(uint _zombieId, uint _targetDna , string _species ,string name,uint _humanId) internal onlyOwnerOf(_zombieId){
     Zombie storage myZombie = zombies[_zombieId];
     require(_isReady(myZombie));
      uint newDna = (myZombie.dna + _targetDna) / 2;
    if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("humans"))) {
      newDna = newDna - newDna % 100 + 99;
    }
     _createZombie(name, newDna);
     humanToZombie[_humanId] = msg.sender;
     ownerZombieHumanCount[msg.sender] = ownerZombieHumanCount[msg.sender].add(1);
     _triggerCooldown(myZombie);


  }
  function feedOnHumans(uint _zombieId ,uint _humanId,string name) external payable{
    //require(msg.value == humanFee);
    Human storage myHuman = humans[_humanId];
    feedAndMutiplies(_zombieId,myHuman.dna,"humans",name,myHuman.name);
    
  }

 //function feedOnHumans(uint _zombieId ,uint _humanId,string name) external payable{
  //  require(msg.value == humanFee);
 //   Human storage myHuman = humans[_humanId];
 //   feedAndMutiplies(_zombieId,myHuman.dna,"humans",name,myHuman.name);
    
//  }




}


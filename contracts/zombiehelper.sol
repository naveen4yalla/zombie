pragma solidity ^0.4.25;

import "./zombiefeeding.sol";

contract ZombieHelper is ZombieFeeding {

  uint levelUpFee = 0.001 ether;
  uint nameFee = 0.001 ether;

  modifier aboveLevel(uint _level, uint _zombieId) {
    require(zombies[_zombieId].level >= _level);
    _;
  }

  function withdraw() external onlyOwner {
    address _owner = owner();
    _owner.transfer(address(this).balance);
  }

  function setLevelUpFee(uint _fee) external onlyOwner {
    levelUpFee = _fee;
  }

  function levelUp(uint _zombieId) external payable {
    require(msg.value == levelUpFee);
    zombies[_zombieId].level = zombies[_zombieId].level.add(1);
  }

  function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) onlyOwnerOf(_zombieId) payable {
    require(msg.value == nameFee);
    Zombie storage myZombie = zombies[_zombieId];
    myZombie.name = _newName;
  }

  function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) onlyOwnerOf(_zombieId) payable {
    
    require(msg.value == nameFee);
    Zombie storage myZombie = zombies[_zombieId];
    uint rand = uint(keccak256(abi.encodePacked(_newDna)));
    rand = rand % dnaModulus;
    rand = rand - rand % 100;
    myZombie.dna = rand;
  }

  function getZombiesByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerZombieCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < zombies.length; i++) {
      if (zombieToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }
  function getAllHumans(address _owner) external view returns(uint[]){
    uint[] memory result = new uint[](humanZombiecount);
    uint counter =0;
    for (uint i = 0; i < humans.length; i++) {
      if (humanToZombie[i] == address(0x0)){
        result[counter] = i;
        counter++;
     }
    }
    return result;
  }

}

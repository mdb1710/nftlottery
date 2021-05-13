// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
    uint score = 5;

    function getScore() public view returns (uint){
        return score;
    }

    function setScore (uint new_score) public {
        score = new_score;
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Cryptocurrency {

    // Mapping of addresses to balances
    mapping(address => uint256) public balances;
    event CheckBalance(string text, uint amount);
    
    // Escrow variables
    address public buyer;
    address public seller;
    uint256 public escrowAmount;
    bool public escrowReleased;

    // Constructor to initialize the contract
    // Uncomment the constructor to run

    constructor() {
        escrowReleased = false;
    }

    // Function to deposit cryptocurrency into the contract
    function deposit() external payable {
        require(msg.value > 0, "You must deposit some cryptocurrency.");
        balances[msg.sender] += msg.value;
    }

    // Function to transfer cryptocurrency to another address
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    // Transfer function with a condition
    function transferWithCondition(address to, uint256 amount, bool condition) external {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
    /*
        if (condition) {
            // Check the condition here (you can customize this)
            require(msg.sender == owner, "Condition not met.");
        }
    */

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    // Function to set up an escrow transaction
    function createEscrow(address _seller, uint256 _amount) external payable {
        require(!escrowReleased, "Escrow already released.");
        require(balances[msg.sender] >= _amount, "Insufficient balance.");
        require(_amount > 0, "Escrow amount must be greater than 0.");
        seller = _seller;
        buyer = msg.sender;
        escrowAmount = _amount;
        escrowReleased = false;
    }

    // Function to release escrow to the seller
    function releaseEscrow() external {
        require(msg.sender == buyer, "Only the buyer can release escrow.");
        require(escrowReleased == false, "Escrow already released.");
        balances[seller] += escrowAmount;
        escrowReleased = true;
    }

    // Function to refund escrow to the buyer
    function refundEscrow() external {
        require(msg.sender == seller, "Only the seller can refund escrow.");
        require(escrowReleased == false, "Escrow already released.");
        balances[buyer] += escrowAmount;
        escrowReleased = true;
    }

    // Function to check the balance of an address
    // function getBalance(address account) external view returns (uint256) {
    //     return balances[account];
    // }


    function getBalance(address user_account) external returns (uint){
       string memory data = "User Balance is : ";
       uint user_bal = user_account.balance;
       emit CheckBalance(data, user_bal );
       return (user_bal);

    }
}

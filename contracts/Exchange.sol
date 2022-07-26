//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
	address public feeAccount;
	uint256 public feePercent;

	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;
	uint256 public ordersCount;

	event Deposit(
		address token,
		address user,
		uint256 amount,
		uint256 balance
	);

	event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
    	address user,
    	address tokenGet,
    	uint256 amountGet,
    	address tokenGive,
    	uint256 amountGive,
    	uint256 timestamp
    );

    struct _Order {
    	uint256 id; // Unique identifier for order
    	address user; // User who made order
    	address tokenGet;  // Address of token received
    	uint256 amountGet; // Amount of token received
    	address tokenGive;  // Address of token given
    	uint256 amountGive;  // Amount of token given
    	uint256 timestamp; // When order was created
    }
    
	constructor(address _feeAccount, uint256 _feePercent) {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}


	// ------------------------
	// DEPOSIT & WITHDRAW TOKEN

	function depositToken(address _token, uint256 _amount) public {
		// Transfer tokens to exchange
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));

		// Update user balance
		tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

		// Emit an event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint256 _amount) public {
		// Ensure user has enough tokens to withdraw
		require(tokens[_token][msg.sender] >= _amount);

		// Transfer tokens to user
		Token(_token).transfer(msg.sender, _amount);

		// Update user balance
		tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

		// Emit an event
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user)
		public
		view
		returns (uint256)
	{
		return tokens[_token][_user];
	}

	// --------------------
	// MAKE & CANCEL ORDERS

	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {

		require(balanceOf(_tokenGive, msg.sender) >= _amountGive);
		ordersCount = ordersCount + 1;

		orders[ordersCount] = _Order(
			ordersCount,
			msg.sender,
			_tokenGet,
			_amountGet,
			_tokenGive,
			_amountGive,
			block.timestamp
		);

		emit Order(ordersCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
	}
}

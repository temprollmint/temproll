// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITIP20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

contract MintSale {
    ITIP20 public immutable paymentToken;
    ITIP20 public immutable saleToken;
    address public immutable owner;

    // Fixed mint price: $0.50 pathUSD (6 decimals)
    uint256 public constant MINT_PRICE = 500_000;

    // Base tokens per spin: 10,000 TEMPROLL (6 decimals)
    uint256 public constant BASE_TOKENS = 10_000_000_000;

    // Public supply cap: 80,000,000 TEMPROLL (6 decimals)
    uint256 public constant PUBLIC_SUPPLY = 80_000_000_000_000;

    // Tracking
    uint256 public totalTokensSold;
    uint256 public totalSpins;
    mapping(address => uint256) public userSpins;
    mapping(address => uint256) public userTokens;

    // Nonce for randomness entropy
    uint256 private _nonce;

    bool public mintClosed;

    event Minted(address indexed user, uint256 amountPaid, uint256 tokensReceived, uint8 rarity);
    event MintClosed(uint256 totalSold, uint256 totalSpinsCount);

    constructor(address _paymentToken, address _saleToken, address _owner) {
        paymentToken = ITIP20(_paymentToken);
        saleToken = ITIP20(_saleToken);
        owner = _owner;
    }

    /// @notice Spin & Mint. Pay exactly $1 pathUSD, receive 10K-100K TEMPROLL based on on-chain rarity.
    function mint() external {
        require(!mintClosed, "Mint closed");

        // Generate on-chain random number (0-99)
        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    _nonce,
                    totalSpins
                )
            )
        ) % 100;

        _nonce++;

        // Determine rarity tier and token multiplier
        uint256 tokensOut;
        uint8 rarity;

        if (rand < 75) {
            // Bronze (75% chance) — 1x = 10,000 tokens
            rarity = 0;
            tokensOut = BASE_TOKENS;
        } else if (rand < 90) {
            // Silver (15% chance) — 1.25x = 12,500 tokens
            rarity = 1;
            tokensOut = BASE_TOKENS * 125 / 100;
        } else if (rand < 95) {
            // Platinum (5% chance) — 1.5x = 15,000 tokens
            rarity = 2;
            tokensOut = BASE_TOKENS * 150 / 100;
        } else if (rand < 98) {
            // Diamond (3% chance) — 2.5x = 25,000 tokens
            rarity = 3;
            tokensOut = BASE_TOKENS * 25 / 10;
        } else {
            // Golden (2% chance) — 5x = 50,000 tokens JACKPOT!
            rarity = 4;
            tokensOut = BASE_TOKENS * 5;
        }

        // Check supply cap
        require(totalTokensSold + tokensOut <= PUBLIC_SUPPLY, "Exceeds supply");

        // Transfer $1 pathUSD from user to owner (treasury)
        require(
            paymentToken.transferFrom(msg.sender, owner, MINT_PRICE),
            "Payment failed"
        );

        // Mint TEMPROLL to user
        saleToken.mint(msg.sender, tokensOut);

        // Update tracking
        totalTokensSold += tokensOut;
        totalSpins++;
        userSpins[msg.sender]++;
        userTokens[msg.sender] += tokensOut;

        emit Minted(msg.sender, MINT_PRICE, tokensOut, rarity);

        // Auto-close if supply is nearly exhausted (can't fit even a base spin)
        if (PUBLIC_SUPPLY - totalTokensSold < BASE_TOKENS) {
            _closeMint();
        }
    }

    function _closeMint() internal {
        mintClosed = true;
        emit MintClosed(totalTokensSold, totalSpins);
    }

    /// @notice Owner can manually close mint if needed
    function closeMint() external {
        require(msg.sender == owner, "Not owner");
        _closeMint();
    }

    function remainingTokens() external view returns (uint256) {
        return PUBLIC_SUPPLY - totalTokensSold;
    }

    function totalRaised() external view returns (uint256) {
        return totalSpins * MINT_PRICE;
    }
}

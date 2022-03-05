// -vlGn2rjckV7gbxXestB7Y67S9ZYzz1V
// 0x30605DE67Ba08d95D86495eF26FaaCEb1f750E0b
//https://eth-ropsten.alchemyapi.io/v2/-vlGn2rjckV7gbxXestB7Y67S9ZYzz1V

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/-vlGn2rjckV7gbxXestB7Y67S9ZYzz1V',
      accounts: ['dc311c3c061609a19ff2e21302689442f00409351a825891554417cfa45f6c4f'],
    }
  }
}
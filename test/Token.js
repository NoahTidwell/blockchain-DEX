const { expect } = require("chai");
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Token", () => {
let token

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Cryptoker', 'CTOKE', '1000000')
  })

  describe('Deployment', () => {
    const name = 'Cryptoker'
    const symbol = 'CTOKE'
    const decimals = '18'
    const totalSupply = tokens('1000000')

    it("Contract has correct name", async () => {
      expect(await token.name()).to.equal(name)
  })

    it("Contract has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol)
  })

    it("Contract has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals)
  })

    it("Contract has correct total supply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply)
  })
})
  
})

const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
  let token, accounts, deployer, receiver

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Cryptoker', 'CTOKE', '1000000')

    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
  })

  describe('Deployment', () => {
    const name = 'Cryptoker'
    const symbol = 'CTOKE'
    const decimals = '18'
    const totalSupply = tokens('1000000')

    it('has correct name', async () => {
      expect(await token.name()).to.equal(name)
    })

    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol)
    })

    it('has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals)
    })

    it('has correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply)
    })

    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })

  })

  describe('Sending Tokens', () => {
    let amount, tx, result

    describe('Success', () => {
      
      beforeEach( async () => {
      amount = tokens(100)

      // transfer tokens transaction
      tx = await token.connect(deployer).transfer(receiver.address, amount)
      result = await tx.wait()
    })

    it('transfers token balances', async () => {

      /* Log balance before transfer
      console.log("Deployer Balnace before transfer", await token.balanceOf(deployer.address))
      console.log("Receiver balance before transfer", await token.balanceOf(receiver.address))
      */

       /* Log balance after transfer
       console.log("Deployer Balnace after transfer", await token.balanceOf(deployer.address))
       console.log("Receiver balance after transfer", await token.balanceOf(receiver.address))
       */

       // Ensure that tokens were transfered (balance change)
       expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
       expect(await token.balanceOf(receiver.address)).to.equal(amount)
    })

    it('emits a Transfer Event', async () => {
      const event = result.events[0]
      expect(event.event).to.equal('Transfer')

      const args = event.args
      expect(args.from).to.equal(deployer.address)
      expect(args.to).to.equal(receiver.address)
      expect(args.value).to.equal(amount)
    })

    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        // Transfer more tokens than deployer has
        const invalidBalance = tokens(100000000)
        await expect(token.connect(deployer).transfer(receiver.address, invalidBalance)).to.be.reverted
      })

      it('rejects invalid recipent', async () => {
        const amount = tokens(100)
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
      })

    })

  })

})


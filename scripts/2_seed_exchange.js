const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {

// Fetch accounts
 const accounts = await ethers.getSigners()

 const { chainId } = await ethers.provider.getNetwork()
 console.log("Using chainId:", chainId)

// Fetch Tokens and Exchange contracts
 const cryptokerToken = await ethers.getContractAt('Token', config[chainId].cryptokerToken.address)
 console.log(`Token fetched: ${cryptokerToken.address}\n`)

 const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
 console.log(`Token fetched: ${mETH.address}\n`)

 const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
 console.log(`Token fetched: ${mDAI.address}\n`)

 const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
 console.log(`Exchange fetched: ${exchange.address}\n`)

 const sender = accounts[0]
 const receiver = accounts[1]
 let amount = tokens(10000)

 // distribute tokens

 let tx, result

 tx = await mETH.connect(sender).transfer(receiver.address, amount)
 result = await tx.wait()
 console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

 const user1 = accounts[0]
 const user2 = accounts[1]
 amount = tokens(10000)

// user1 approves 10,000 CTOKE
 tx = await cryptokerToken.connect(user1).approve(exchange.address, amount)
 result = await tx.wait()
 console.log(`Approved ${amount} tokens from ${user1.address}`)

// user1 deposits 10,000 CTOKE
 tx = await exchange.connect(user1).depositToken(cryptokerToken.address, amount)
 result = await tx.wait()
 console.log(`Deposited ${amount} CTOKE from ${user1.address}`)

// user2 approves 10,000 mETH
 tx = await mETH.connect(user2).approve(exchange.address, amount)
 result = await tx.wait()
 console.log(`Approved ${amount} tokens from ${user2.address}`)

// user2 deposits 10,000 mETH
 tx = await exchange.connect(user2).depositToken(mETH.address, amount)
 result = await tx.wait()
 console.log(`Deposited ${amount} mETH from ${user2.address}\n`)


// ----------------------
// Seed a cancelled order
let orderId
tx = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), cryptokerToken.address, tokens(5))
result = await tx.wait()
console.log(`Made order from ${user1.address}`)

console.log(result)
orderId = result.events[0].args.id
tx = await exchange.connect(user1).cancelOrder(orderId)
result = await tx.wait()
console.log(`Cancelled order from ${user1.address}\n`)

// wait 1 second
await wait(1)

// -------------------
// Seed a filled orders

// ORDER #1
tx = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), cryptokerToken.address, tokens(10))
result = await tx.wait()
console.log(`Made order from: ${user1.address}`)

orderId = result.events[0].args.id
tx = await exchange.connect(user2).fillOrder(orderId)
result = await tx.wait()
console.log(`Filled order from ${user1.address}\n`)

await wait(1)

// ORDER #2
tx = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), cryptokerToken.address, tokens(15))
result = await tx.wait()
console.log(`Made order from: ${user1.address}`)

orderId = result.events[0].args.id
tx = await exchange.connect(user2).fillOrder(orderId)
result = await tx.wait()
console.log(`Filled order from ${user1.address}\n`)

await wait(1)

// ORDER #3
tx = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), cryptokerToken.address, tokens(20))
result = await tx.wait()
console.log(`Made order from: ${user1.address}`)

orderId = result.events[0].args.id
tx = await exchange.connect(user2).fillOrder(orderId)
result = await tx.wait()
console.log(`Filled order from ${user1.address}\n`)

await wait(1)

// ----------------
// Seed Open Orders

for(let i = 1; i <= 10; i++) {
 tx = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), cryptokerToken.address, tokens(10))
 result = await tx.wait()

 console.log(`Made order from ${user1.address}`)

 await wait(1)
}

for(let i = 1; i <= 10; i++) {
 tx = await exchange.connect(user2).makeOrder(cryptokerToken.address, tokens(10), mETH.address, tokens(10 * i))
 result = await tx.wait()

 console.log(`Made order from ${user2.address}`)

 await wait(1)
}

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

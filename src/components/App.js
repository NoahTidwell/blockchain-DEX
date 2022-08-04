import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange
} from '../store/interactions';

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch)
    // Fetch current network's chain ID
    const chainId = await loadNetwork(provider, dispatch)

    // Fetch current account and balance from MetaMask
    await loadAccount(provider, dispatch)

    // Load Token Smart Contracts
    const ctoke = config[chainId].cryptokerToken
    const mETH = config[chainId].mETH
    await loadTokens(provider, [ctoke.address, mETH.address], dispatch)

    // Load Exchange Smart Contract
    const exchangeConfig = config[chainId].exchange
    await loadExchange(provider, exchangeConfig.address, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
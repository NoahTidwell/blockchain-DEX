import logo from '../assets/hawaii.png';
import eth from '../assets/eth.svg';
import { useSelector, useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import { loadAccount } from '../store/interactions';
import config from '../config.json';

const Navbar = () => {
  const provider = useSelector(state => state.provider.connection)
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const balance = useSelector(state => state.provider.balance)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    // Load Account...
    await loadAccount(provider, dispatch)
  }

  const networkHandler = async (event) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: event.target.value }]
    })
  }
  return(
    <div className='exchange__header grid'>
      <div className='exchange__header--brand flex'>
        <img className='logo' src={logo} alt='dead logo'></img>
        <h1>Cryptoker's Token Exchange</h1>
      </div>

      <div className='exchange__header--networks flex'>
        <img className="logo" src={eth} alt="eth logo"></img>

        {chainId && (
          <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : `0`} onChange={networkHandler}>
          <option value="0" disabled>Select Network</option>
          <option value="0x7A69">Localhost</option>
          <option value="0x2a">Kovan</option>
          </select>
        )}

      </div>

      <div className='exchange__header--account flex'>
      {balance ? (
        <p><small>My Balance</small>{Number(balance).toFixed(2)} ETH</p>
      ) : (
        <p><small>My Balance</small>0 ETH</p>
      )}
      
        {account ? (
          <a 
          href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : `#`}
          target="_blank"
          rel="noreferrer">

          {account.slice(0,5) + '...' + account.slice(38,42)}

            <Blockies 
            seed={account}
            size={10}
            scale={3}
            className='identicon'
          />
          </a>
          ) : (
            <button className="button" onClick={connectHandler}>Connect</button>
          )}


      </div>
    </div>
  )
}

export default Navbar;
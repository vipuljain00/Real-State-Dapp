import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

function App() {
 
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [homes, setHomes] = useState([])
  
  const loadBlockchainData = async () => {
    if(window.ethereum){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)
        const network = await provider.getNetwork()
        // const code = await provider.getCode(config[network.chainId].realEstate.address)
        // console.log(code)


        //grtting accounts initially
        const accounts = await provider.send('eth_requestAccounts', []);
        const retreivedaccount = ethers.utils.getAddress(accounts[0])
        setAccount(retreivedaccount);

        const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider)
        const totalSupply = await realEstate.totalSupply()   
        // console.log(totalSupply.toString()); 

        const homeArray = []
        for (var i = 1; i <= 3; i++) {
          
          const uri = await realEstate.tokenURI(i)
          console.log(uri)
          const response = await fetch(uri)
          const metadata = await response.json()
          homeArray.push(metadata)
        }
        setHomes(homeArray)
        // console.log(homes)

        const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
        setEscrow(escrow)

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const retreivedAccount = ethers.utils.getAddress(accounts[0])
          setAccount(retreivedAccount);
        })
      }
      catch(error){
        console.error('Error Loading Blockchain Data:', error)
      }
    }else{
      console.error('Please Install WEB3 Wallet')
    }
  } 
  
  useEffect(()=>{
    loadBlockchainData()
  }, [])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <Search />
      <div className='cards__section'>

        <h3>Homes For You</h3>
        <hr/>

        <div className ='Cards'>

          {homes.map((home,index)=>(

            <div className='card' key={index}>

              <div className='card_image'>
                <img alt='Home Image' src={home.image}/>
              </div>

              <div className='card__info'>
                <h1>{home.attributes[0].value} ETH</h1>
                <p>
                  <strong>{home.attributes[2].value}</strong> Beds|
                  <strong>{home.attributes[3].value}</strong> Baths|
                  <strong>{home.attributes[4].value}</strong> sqft 
                </p>
                <p>{home.address}</p>
              </div>

            </div>
          
          ))}
          
        </div>

      </div>

    </div>
  );
}

export default App;

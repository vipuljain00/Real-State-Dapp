import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ home, provider, escrow, togglePop }) => {

    // const buyHandler = ()=>{

    // }

    // const hasBought = ()=>{

    // }

    return (
        <div className="home">
            <div className='home__details'>
                <div className='home__image'>
                     <img src={home.image} />    
                </div>
                <div className='home__overview'>
                    <h1>{home.name}</h1>
                    <p>
                        <strong>{home.attributes[2].value}</strong> Beds|
                        <strong>{home.attributes[3].value}</strong> Baths|
                        <strong>{home.attributes[4].value}</strong> sqft
                    </p>
                    <p>{}home.address</p>
                    <h2>{home.attributes[0].value} ETH</h2>

                    <button className='home__buy'>
                        Buy
                    </button>
                    <button className='home__contact'>
                        Contact Agent
                    </button>
                    <hr />

                    <h2>Overview</h2>
                    <p>{home.description}</p>
                    <hr />

                    <h2>Facts and Features</h2>
                    <ul>
                        {home.attributes.map((attribute,index)=>(
                            <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                        ))}
                    </ul>

                </div>
                <button className='home__close' onClick={togglePop}>
                    <img src={close} alt='close' />
                </button>
            </div>
        </div>
    );
}

export default Home;

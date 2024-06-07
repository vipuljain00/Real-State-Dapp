const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {

    let buyer, seller, inspector, lender
    let realEstate, escrow

    beforeEach(async()=>{
        [buyer, seller, inspector, lender] = await ethers.getSigners()                   //returns a list of 20 addresses provided by hardhat for testing of smart contract
        
        //Deploy RealEstate.sol
        const RealEstate = await ethers.getContractFactory("RealEstate")
        realEstate = await RealEstate.deploy()

        //Mint
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmXAGUpK9DngZMhuP7k6wSHmiNXJ8SjnGFDDcHLNShDwzq?filename=1.json")
        await transaction.wait()  

        //Deploy Escrow.sol
        const Escrow = await ethers.getContractFactory("Escrow")
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        )

    })

    describe('Deployment',()=>{

        it("returns NFT Adress",async()=>{
            const result = await escrow.nftAddress()
            expect(result).to.equal(realEstate.address)
        })

        it("returns seller",async()=>{
            const result = await escrow.seller()
            expect(result).to.equal(seller.address)
        })

        it("returns inpector",async()=>{
            const result = await escrow.inspector()
            expect(result).to.equal(inspector.address)
        })

        it("returns lender",async()=>{
            const result = await escrow.lender()
            expect(result).to.equal(lender.address)    
        })
    })
})

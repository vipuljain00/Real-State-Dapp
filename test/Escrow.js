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
        
        //approving escrow to transfer nft on the behalf of owner
        transaction=await realEstate.connect(seller).approve(escrow.address,1)
        await transaction.wait()

        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
        await transaction.wait()
    })

    describe('Deployment',()=>{

        it("returns NFT Adress",async()=>{
            const result = await escrow.nftContractAddress()
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

    describe("Listing",async()=>{

        it("Updates as Listed",async()=>{
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })
        
        it("Updates Ownership",async()=>{
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })

        it("returns the Purchase Price",async()=>{
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })
        
        it("reutrns buyer",async()=>{
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })
        
        it("returns Escrow Amount",async()=>{
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })
    })
})

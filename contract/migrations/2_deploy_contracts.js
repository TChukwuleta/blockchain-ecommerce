const Dai = artifacts.require("Dai");
const PaymentProcessor = artifacts.require("PaymentProcessor");

module.exports = async function (deployer, network, addresses) {
    const [admin, payer, _] = addresses
    if(network == 'develop'){
        await deployer.deploy(Dai)
        const dai = await Dai.deployed()
        await dai.faucet(payer, web3.utils.toWei('10000'))

        await deployer.deploy(PaymentProcessor, admin, dai.address)
    }
    else{
        const AdminAddress = ''
        const DaiAddress = ''
        await deployer.deploy(PaymentProcessor, AdminAddress, DaiAddress)
    }
};

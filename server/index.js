const Koa = require('koa')
const Router = require('@koa/router')
const cors = require('@koa/cors')
const ethers = require('ethers')
const PaymentProcessor = require('../contract/build/contracts/PaymentProcessor.json')
const { Payment } = require('./db')

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const DB = `mongodb+srv://TChukwuleta:Iamgreat97@cluster1.ejith.mongodb.net/blockchainecommerce?retryWrites=true&w=majority`

mongoose
.connect(DB, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => {
console.log('Connected to DB successfully...');
});

const app = new Koa()
const router = new Router()

const items = {
    '1': {id: 1, url: 'http://urltodownloaditemone'},
    '2': {id: 2, url: 'http://urltodownloaditemtwo'}
}

router.get('/api/getpaymentid/:itemId', async ctx => {
    const paymentId = (Math.random() * 10000).toFixed(0)
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false
    })
    ctx.body = {
        paymentId
    }
})

router.get('/api/getItemUrl/paymentId', async ctx => {
    const payment = await Payment.findOne({ id: ctx.params.paymentId })
    if(payment && payment.paid === true){
        ctx.body = {
            url: items[payment.itemId].url
        }
    }
    else {
        ctx.body = {
            url: ''
        }
    }
})

app
.use(cors())
.use(router.routes())
.use(router.allowedMethods())

app.listen(4000, () => {
    console.log('Server has started running')
})


const listenToEvents = () => {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545')
    const networkId = '5777'

    const PaymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    )

    PaymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
        console.log(`
            from ${payer}
            amount ${amount}
            paymentId ${paymentId}
            date ${(new Date(date.toNumber() * 1000)).toLocaleString()}
        `)
        const payment = await Payment.findOne({ id: paymentId })
        if(payment){
            payment.paid = true
            await payment.save()
        }
    })
}

listenToEvents()
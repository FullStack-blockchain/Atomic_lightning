/*
* Test Contract
* Developer:  Josiah
**/
const Swapoffchain   = artifacts.require('Swapoffchains')
const intervalTime = require("../modules/interval-time")

var Common = require("../modules/common");

var secret_module = (new Common()).GenerateSecret();

const secret = secret_module.secret;
const secretHash = secret_module.hashedSecret;
//console.log ("Secret & HashedSecret :" + secret + "------" + secretHash);
//const secret        = '0xc0809ce9f484fdcdfb2d5aabd609768ce0374ee97a1a5618ce4cd3f16c00a078'
//const secretHash    = '0xc0933f9be51a284acb6b1a6617a48d795bdeaa80'
const getSwapValue  = () => 0.1e18

contract('Swapoffchains >', async (accounts) => {

//  console.log(accounts[0]);
  const Owner = accounts[3]
  const btcOwner = accounts[4]
  const ethOwner = accounts[5]

  let Swap
  let swapValue

  before('setup contract', async () => {
    Swap   = await Swapoffchain.deployed()
  })

  describe('Init >', () => {

    it('check creator balance', async () => {
      const ethOwnerBalance = await web3.eth.getBalance(btcOwner)
      // console.log("BTC Owner: ", btcOwner);
      // console.log("Balance: ", ethOwnerBalance);
      assert.isTrue(ethOwnerBalance.toNumber() >= getSwapValue(), 'not enough balance')
    })
  })

  /*
   * Scenrio #1: 'Withdraw' case
   **/
  describe('Scenario #1: Withdraw case >', () => {

    describe('Create Swap >', () => {

      before('Swap init', () => {
        swapValue = getSwapValue()
      })

      it('create swap', async () => {
        await Swap.createSwap(secretHash, btcOwner, {
          from: ethOwner,
          value: swapValue,
        })
      })

      it('check balance', async () => {
        const balance = await Swap.getBalance(ethOwner, {
          from: btcOwner,
        })

        assert.equal(swapValue, balance, 'Wrong balance')
      })
    })

    describe('Withdraw Swap >', () => {

      let btcOwnerBalance
      let withdrawTransactionCost

      before('before', async () => {
        btcOwnerBalance = await web3.eth.getBalance(btcOwner)
      })

      it('withdraw', async () => {
        const { receipt: { transactionHash, gasUsed } } = await Swap.withdraw(secret, ethOwner, {
          from: btcOwner,
        })
        const { gasPrice } = await web3.eth.getTransaction(transactionHash)

        withdrawTransactionCost = gasPrice * gasUsed
      })

      it('check participant balance', async () => {
        const _btcOwnerBalance = await web3.eth.getBalance(btcOwner)

        assert.equal(btcOwnerBalance.toNumber() - withdrawTransactionCost + swapValue, _btcOwnerBalance.toNumber())
      })

      it('check secret', async () => {
        const _secret = await Swap.getSecret.call(btcOwner, {
          from: ethOwner,
        })

        assert.equal(secret, _secret)
      })
    })

  })

 /**
   * Scenrio #2: 'Refund' case
   */
  describe('Scenario #2: Refund case >', () => {

    describe('Create Swap >', () => {

      before('Swap init', () => {
        swapValue = getSwapValue()
      })

      it('create swap', async () => {
        await Swap.createSwap(secretHash, btcOwner, {
          from: ethOwner,
          value: swapValue,
        })
      })

      it('check balance', async () => {
        const balance = await Swap.getBalance(ethOwner, {
          from: btcOwner,
        })

        assert.equal(swapValue, balance, 'Wrong balance')
      })
    })

    describe('TimeOut >', () => {

      it('time', (done) => {
        setTimeout(done, 6000)
      })
    })

    describe('Refund Swap >', () => {

      let ethOwnerBalance
      let refundTransactionCost

      before('before', async () => {
        ethOwnerBalance = await web3.eth.getBalance(ethOwner)
      })

      it('refund', async () => {
        console.log("Interval Time :11111111");
        await intervalTime(3600 * 3)

        const { receipt: { transactionHash, gasUsed } } = await Swap.refund(btcOwner, {
          from: ethOwner,
        })

        const { gasPrice } = await web3.eth.getTransaction(transactionHash)

        refundTransactionCost = gasPrice * gasUsed
      })

      it('check creator balance', async () => {
        const _ethOwnerBalance = await web3.eth.getBalance(ethOwner)

        assert.equal(ethOwnerBalance.toNumber() - refundTransactionCost + swapValue, _ethOwnerBalance.toNumber())
      })

    })

  })

  /**
   * Scenrio #2: 'Abort' case
   */
  describe('Scenario #3 Abort case >', () => {

    describe('Init Swap >', () => {

    })

    describe('TimeOut >', () => {

      it('time', (done) => {
        setTimeout(done, 6000)
      })
    })


  })

  

})

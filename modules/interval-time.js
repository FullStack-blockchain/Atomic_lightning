/*
* Set interval
* Developer:  Josiah
**/
const jsonrpc = '2.0'
const id = 0
const send = (method, params = []) => new Promise(resolve =>
  web3.currentProvider.sendAsync({ id, jsonrpc, method, params }, resolve))

const intervalTime = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

module.exports = intervalTime

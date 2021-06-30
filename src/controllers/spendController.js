import {MemoryAccount, Node, Universal} from '@aeternity/aepp-sdk/es';
import {BigNumber} from "bignumber.js";
import axios from 'axios'

let client = null;

const atomsToAe = (atoms) => (new BigNumber(atoms)).dividedBy(new BigNumber('1e18'));
const aeToAtoms = (ae) => (new BigNumber(ae)).multipliedBy(new BigNumber('1e18'));


const faucet = async () => {
  if (!client) await init();
  const address = await client.address();
  const balance = await client.balance(address, {format: false}).then(atomsToAe).catch(() => 0);
  if (balance <= 5) {
    await axios.post(`https://testnet.faucet.aepps.com/account/${address}`, {}, {headers: {'content-type': 'application/x-www-form-urlencoded'}})
  }
};

const init = async () => {
  client = await Universal({
    nodes: [{
      name: 'node',
      instance: await Node({
        url: 'https://testnet.aeternity.io'
      })
    }],
    accounts: [
      MemoryAccount({
        keypair: {
          publicKey: 'ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt',
          secretKey: '57634f88c48e9e63732aed1adec05d01532d499658f9b9f5f625570e6ccb96832f92b03ad7c18058fd768f250e02a06bbc70d1b7083bc46978d563977fd68e4b',
        }
      })],
  });

  await faucet();
};

const spend = async (amount, recipient) => {
  if (!client) await init();
  return client.spend(amount, recipient);
};

export default {spend, faucet, init, atomsToAe, aeToAtoms};

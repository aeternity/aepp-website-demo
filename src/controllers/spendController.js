import Universal from '@aeternity/aepp-sdk/es/ae/universal';

const getClient = () => Universal({
  url: "https://sdk-testnet.aepps.com",
  internalUrl: "https://sdk-testnet.aepps.com",
  keypair: {
    publicKey: "ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt",
    secretKey: "57634f88c48e9e63732aed1adec05d01532d499658f9b9f5f625570e6ccb96832f92b03ad7c18058fd768f250e02a06bbc70d1b7083bc46978d563977fd68e4b"
  }
});

const spend = async (amount, recipient) => {
  const client = await getClient();
  return client.spend(amount, recipient);
};


export default {spend};



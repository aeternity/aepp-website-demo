<template>
  <div class="content">
    <div class="code fixedCode">{{fixedCode}}</div>
    <div class="code" contentEditable @input="onInput">{{code}}</div>
    <div class="code fixedCodeAfter">{{fixedCodeAfter}}</div>

    <button @click="test">Test</button>
  </div>
</template>

<script>

  import Universal from '@aeternity/aepp-sdk/es/ae/universal';

  export default {
    name: 'spendTx',
    data() {
      return {
        fixedCode: `import Universal from '@aeternity/aepp-sdk/es/ae/universal';
const test = async () => {

  const client = await Universal({
    url: "https://sdk-testnet.aepps.com",
    internalUrl: "https://sdk-testnet.aepps.com",
    keypair: {
      publicKey: "ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt",
      secretKey: "57634f88c48e9e63...63977fd68e4b"
    }
  });`,
        code: `
  const amount = 123;
  const recipient = "ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688";

  client.spend(amount, recipient);
`,
        fixedCodeAfter: `
};

test();
        `
      }
    },
    async mounted() {
      window.client = await Universal({
        url: "https://sdk-testnet.aepps.com",
        internalUrl: "https://sdk-testnet.aepps.com",
        keypair: {
          publicKey: "ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt",
          secretKey: "57634f88c48e9e63732aed1adec05d01532d499658f9b9f5f625570e6ccb96832f92b03ad7c18058fd768f250e02a06bbc70d1b7083bc46978d563977fd68e4b"
        }
      });
    },
    methods: {
      onInput(e) {
        this.code = e.target.innerText;
      },
      test() {
        const add = `
        const test = async () => {
        let client = window.client;`;

        console.log(add + this.code + this.fixedCodeAfter);

        eval(add + this.code + this.fixedCodeAfter);
      }
    }
  }
</script>

<style scoped>
  .code {
    white-space: pre-wrap;
    font-family: monospace;
  }

  .content {
    display: flex;
    width: 650px;
    flex-direction: column;
  }
</style>

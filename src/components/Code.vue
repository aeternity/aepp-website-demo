<template>
  <div class="h-full w-full" style="max-width: 1200px">
    <div class="absolute flex justify-center items-center inset-0 z-20" v-if="!client || showLoading" style="background-color: rgba(255,255,255,0.5)">
      <BiggerLoader></BiggerLoader>
    </div>
    <div v-if="!result">
      <prism-editor readonly :code="fixedCode" language="js" class="opacity-50"></prism-editor>
      <prism-editor v-model="code" :code="code" language="js"></prism-editor>
      <prism-editor readonly :code="fixedCodeAfter" language="js" class="opacity-50"></prism-editor>
      <ae-button-group class="mt-4">
        <ae-button @click="$emit('reset')" type="exciting">Return to demo aepp</ae-button>
        <ae-button @click="run" type="dramatic">Run code in browser</ae-button>
      </ae-button-group>
    </div>
    <ae-card v-if="result">
        <div class="w-full h-full overflow-auto p-4">
          <prism-editor readonly :code="result"></prism-editor>
        </div>
        <div class="absolute top-0 right-0 text-5xl text-black cursor-pointer py-3 px-4" @click="result = ''">
          &times;
        </div>
    </ae-card>

  </div>
</template>

<script>
  import 'prismjs'
  import 'prismjs/themes/prism.css'
  import 'vue-prism-editor/dist/VuePrismEditor.css' // import the styles
  import PrismEditor from 'vue-prism-editor'
  import Universal from '@aeternity/aepp-sdk/es/ae/universal'
  import AeButton from '@aeternity/aepp-components/src/components/aeButton/aeButton'
  import AeButtonGroup from '@aeternity/aepp-components/src/components/ae-button-group/ae-button-group'
  import AeBackdrop from '@aeternity/aepp-components/src/components/ae-backdrop/ae-backdrop'
  import AeCard from '@aeternity/aepp-components/src/components/ae-card/ae-card'
  import BiggerLoader from './BiggerLoader'

  export default {
    name: 'Code',
    components: {
      BiggerLoader,
      AeCard,
      AeBackdrop,
      AeButtonGroup,
      AeButton,
      PrismEditor,
    },
    data () {
      return {
        fixedCode: `
import Universal from '@aeternity/aepp-sdk/es/ae/universal';

Universal({
  url: "https://sdk-testnet.aepps.com",
  internalUrl: "https://sdk-testnet.aepps.com",
  keypair: {
    publicKey: "ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt",
    secretKey: "57634f88c48e9e63...63977fd68e4b"
  }
}).then(async (client) =>`,
        code: `    const amount = 123;
    const recipient = "ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688";
    return await client.spend(amount, recipient);`,
        fixedCodeAfter: `});
        `,
        result: null,
        client: null,
        showLoading: false
      }
    },
    async mounted () {

      this.client = await Universal({
        url: 'https://sdk-testnet.aepps.com',
        internalUrl: 'https://sdk-testnet.aepps.com',
        keypair: {
          publicKey: 'ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt',
          secretKey: '57634f88c48e9e63732aed1adec05d01532d499658f9b9f5f625570e6ccb96832f92b03ad7c18058fd768f250e02a06bbc70d1b7083bc46978d563977fd68e4b',
        },
      })
      window.client = this.client
    },
    methods: {
      async run () {
        const add = `
        (async () => {
        let client = window.client;`

        const post = `})();`

        this.showLoading = true
        try {
          const result = await eval(add + this.code + post)
          try {
            this.result = JSON.stringify(result, null, 2)
          } catch (e) {
            this.result = String(result)
          }
        } catch (e) {
          this.result = String(e.message)
        }

        this.showLoading = false

      },
    },
  }
</script>

<style>
  pre[class*="language-js"] {
    background-color: #f7fafc;
    padding-top: 0;
    padding-bottom: 0;
    white-space: pre-wrap;
  }
  code[class*="language-js"] {
    white-space: pre-wrap;
  }
</style>

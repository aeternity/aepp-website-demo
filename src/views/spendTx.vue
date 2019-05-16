<template>
  <div>
    <ae-card>
      <div class="flex flex-row">
        <!-- PART ONE, DEMO / CODE -->
        <div class="flex flex-col flex-1 p-4 border-r-2">
          <div class="flex flex-row h-24 items-center justify-center">
            <AeIdentityLight address="ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt" :collapsed="true"/>
            <div class="px-4">
              ->
            </div>
            <AeIdentityLight address="ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688" :collapsed="true"/>
          </div>
          <div class="h-40">
            <ae-input label="Enter Amount" placeholder="0.0" aemount v-model="aemount" :error="!!error">
              <ae-text slot="header" fill="black">AE</ae-text>
              <ae-toolbar slot="footer" v-if="error">
                0.005AE is the minimum amount to send!
              </ae-toolbar>
            </ae-input>
          </div>
          <div class="flex justify-center pt-2">
            <ae-button type="dramatic" @click="spend">
              Send Tokens
            </ae-button>
          </div>
        </div>
        <!-- END PART ONE -->
        <!-- PART TWO, EXPLAINAER -->
        <div class="flex flex-col flex-1 p-4">
          <div class="h-24">
            <h2 class="font-bold">
              Spend Transactions
            </h2>
            In this example a variable amount of tokens is transferred between two accounts.
          </div>
          <div class="h-40 pt-1">
            Enter the desired amount here. A fee will be automatically calculated and redacted from the senders account.
          </div>
          <div>
            By clicking this button you sign the transaction and it will be broadcasted to the network for verification.
          </div>
        </div>
        <!-- END PART TWO -->
      </div>
    </ae-card>
  </div>
</template>

<script>

  import SpendController from '../controllers/spendController';

  import AeCard from '@aeternity/aepp-components/src/components/ae-card/ae-card'
  import AeIdentityLight from '../components/AeIdentityLight'
  import AeInput from '@aeternity/aepp-components/src/components/ae-input/ae-input'
  import AeText from '@aeternity/aepp-components/src/components/ae-text/ae-text'
  import AeButton from '@aeternity/aepp-components/src/components/aeButton/aeButton'
  import AeToolbar from '@aeternity/aepp-components/src/components/ae-toolbar/ae-toolbar'
  import {BigNumber} from 'bignumber.js'

  export default {
    name: 'spendTx',
    components: {AeToolbar, AeButton, AeText, AeInput, AeIdentityLight, AeCard},
    data() {
      return {
        spendResult: null,
        aemount: '',
        error: null
      }
    },
    mounted() {
      SpendController.init();
    },
    methods: {
      spend() {
        if (!this.aemount || this.aemount < 0.005) return this.error = true;
        const sendAmount = new BigNumber(this.aemount).multipliedBy(new BigNumber('10e18'));
        SpendController.spend(sendAmount.toFixed(), "ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688").then(console.log);
      }
    }
  }
</script>

<style scoped>

</style>

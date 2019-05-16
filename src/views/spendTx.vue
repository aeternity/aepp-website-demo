<template>
  <div>
    <ae-card>
      <Code v-if="isStatusCode"></Code>
      <div class="flex flex-row" v-else>
        <!-- PART ONE, DEMO -->
        <div class="flex-1 p-4 border-r-2">
          <div class="flex flex-col" v-if="isStatusSuccess || isStatusInitial">
            <div class="flex flex-row h-20 items-center justify-center">
              <AeIdentityLight address="ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt" :collapsed="true"/>
              <div class="px-4">
                ->
              </div>
              <AeIdentityLight address="ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688" :collapsed="true"/>
            </div>
            <div class="h-40" v-if="isStatusInitial">
              <ae-input label="Enter Amount" placeholder="0.0" aemount v-model="aemount" :error="!!error">
                <ae-text slot="header">AE</ae-text>
                <ae-toolbar slot="footer" v-if="error">
                  0.005AE is the minimum amount to send!
                </ae-toolbar>
              </ae-input>
            </div>
            <div v-if="isStatusSuccess" class="h-48">
              <div>
                <h2 class="text-xl text-center">Success!</h2>
              </div>
              <hr class="border"/>
              <div class="flex justify-between">
                <span class="label">Block</span>
                <ae-text face="mono-base">{{result.blockHeight}}</ae-text>
              </div>
              <div class="flex justify-between">
                <span class="label">Type</span>
                <ae-text face="mono-base">{{result.tx.type}}</ae-text>
              </div>
              <hr class="border"/>
              <div class="flex justify-between">
                <span class="label">Amount</span>
                <ae-text face="mono-base">{{toAe(result.tx.amount)}} AE</ae-text>
              </div>
              <div class="flex justify-between">
                <span class="label">Fee</span>
                <ae-text face="mono-base">{{toAe(result.tx.fee)}} AE</ae-text>
              </div>
              <div class="flex justify-between">
                <span class="label">Total</span>
                <ae-text face="mono-base" fill="black">{{toAe(Number(result.tx.amount) + Number(result.tx.fee))}} AE
                </ae-text>
              </div>
            </div>
            <div class="flex justify-center pt-2">
              <div class="flex flex-col text-center" v-if="isStatusInitial">
                <ae-button type="dramatic" @click="spend">
                  Send tokens
                </ae-button>
                <a href="#" @click.stop.prevent="switchToCode" class="mt-2 underline">Switch to code</a>
              </div>
              <div class="flex flex-col text-center" v-if="isStatusSuccess">
                <ae-button type="dramatic" @click="openInExplorer">
                  View on the blockchain
                </ae-button>
                <a href="#" @click.stop.prevent="reset" class="mt-2 underline">Reset example</a>
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center" v-if="isStatusLoading">
            <BiggerLoader></BiggerLoader>
          </div>
        </div>
        <!-- END PART ONE -->
        <!-- PART TWO, EXPLAINAER -->
        <div class="flex flex-col flex-1 p-4">
          <div v-if="isStatusInitial || isStatusLoading">
            <div class="h-20">
              <h2 class="font-bold">
                Spend Transactions
              </h2>
              In this example a variable amount of tokens is transferred between two accounts.
            </div>
            <div class="h-40 pt-1">
              Enter the desired amount here. A fee will be automatically calculated and redacted from the senders
              account.
            </div>
            <div>
              By clicking this button you sign the transaction and it will be broadcasted to the network for
              verification.
            </div>
          </div>
          <div v-if="isStatusSuccess">
            <div class="h-20">
              <h2 class="font-bold">
                Spend Transaction Successful
              </h2>
              In this example {{toAe(result.tx.amount)}} tokens were transferred between two accounts.
            </div>
            <div class="h-24 pt-1">
              Your transaction (<span class="font-mono">{{result.hash.substr(0,5)}}...{{result.hash.substr(result.hash.length - 5)}}</span>)
              has been included in block <span class="font-mono">{{result.blockHeight}}</span>. The fee to process the
              transaction is roughly equal to <span class="font-mono">${{Math.round(Number(toAe(result.tx.fee)) * 0.54 * 1000000) / 1000000}}</span>.
            </div>
            <div>
              <div>
                Are you a developer? We provide an interactive code example for you to explore our easy to use SDK that
                also powers this demo.
              </div>
              <div class="flex justify-center mt-1">
                <ae-button type="exiting" @click="switchToCode">
                  Switch to code
                </ae-button>
              </div>

            </div>
          </div>
        </div>
        <!-- END PART TWO -->
      </div>
    </ae-card>
  </div>
</template>

<script>

  //SpendController.skiled

  import SpendController from '../controllers/spendController'

  import AeCard from '@aeternity/aepp-components/src/components/ae-card/ae-card'
  import AeIdentityLight from '../components/AeIdentityLight'
  import AeInput from '@aeternity/aepp-components/src/components/ae-input/ae-input'
  import AeText from '@aeternity/aepp-components/src/components/ae-text/ae-text'
  import AeButton from '@aeternity/aepp-components/src/components/aeButton/aeButton'
  import AeToolbar from '@aeternity/aepp-components/src/components/ae-toolbar/ae-toolbar'
  import {BigNumber} from 'bignumber.js'
  import BiggerLoader from '../components/BiggerLoader'
  import AeLabel from '@aeternity/aepp-components/src/components/aeLabel/aeLabel'
  import Code from '../components/Code'

  const STATUS_INITIAL = 0, STATUS_LOADING = 1, STATUS_SUCCESS = 2, STATUS_CODE = 3

  export default {
    name: 'spendTx',
    components: {Code, AeLabel, BiggerLoader, AeToolbar, AeButton, AeText, AeInput, AeIdentityLight, AeCard },
    data () {
      return {
        spendResult: null,
        aemount: '',
        error: null,
        status: STATUS_SUCCESS,
        result: JSON.parse(
          '{"blockHash":"mh_iQ7TRDR7eXPVPWJxuRz2kDmAQC6vyWynLSZxcEzcmdPf4yPLT","blockHeight":81175,"hash":"th_qt9qN42o2zqPy4qEbRzdC8sZyVobkRzUeJeAcYYVP9qpANNuY","signatures":["sg_aTbj9FkYxiN3GNNghGWyUcDFYRQKRBUKCigReKwZwh1Hufzxpy3DZhSdfrNFE6uGcNwkGSBW6jNeT3Mps5HhRyXZEszSD"],"tx":{"amount":"10000000000000000","fee":16820000000000,"nonce":15,"payload":"","recipientId":"ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688","senderId":"ak_MxBw2jMz9otWXw5pGKze7uKvS67bxixsYTgbi8crTtUa5BJKt","type":"SpendTx","version":1},"rawTx":""}'),
      }
    },
    computed: {
      isStatusInitial () {
        return this.status === STATUS_INITIAL
      },
      isStatusLoading () {
        return this.status === STATUS_LOADING
      },
      isStatusSuccess () {
        return this.status === STATUS_SUCCESS
      },
      isStatusCode () {
        return this.status === STATUS_CODE
      },
    },
    mounted() {
      SpendController.init();
    },
    methods: {
      async spend () {
        if (!this.aemount || this.aemount < 0.005) return this.error = true
        const sendAmount = new BigNumber(this.aemount).multipliedBy(new BigNumber('1e18'))
        this.status = STATUS_LOADING
        this.result = await SpendController.spend(sendAmount.toFixed(),
          'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688')
        this.result.rawTx = ''
        this.status = STATUS_SUCCESS
      },
      toAe (aetoString) {
        return new BigNumber(aetoString).dividedBy(new BigNumber('1e18')).toFixed()
      },
      reset () {
        this.status = STATUS_INITIAL
        this.result = null
      },
      openInExplorer () {
        window.open('https://testnet.explorer.aepps.com/#/tx/' + this.result.hash)
      },
      switchToCode() {
        this.status = STATUS_CODE
      }
    },
  }
</script>

<style scoped>

</style>

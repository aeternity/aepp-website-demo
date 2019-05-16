<template>
  <div>
    <button @click="spend">Spend</button>
    <span>{{spendResult}}</span>
  </div>
</template>

<script>

  import SpendController from '../controllers/spendController';

  export default {
    name: 'spendTx',
    data() {
      return {
        spendResult: null
      }
    },
    methods: {
      spend() {
        SpendController.spend(1000, "ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688").then(result => this.spendResult = result);
      }
    }
  }
</script>

<style scoped>

</style>

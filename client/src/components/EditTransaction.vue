<template>
  <div class="form">
    <h1>Edit Transaction: {{ name }}</h1>
      <div>
        <label v-if="duplicateSaleNumber" class="errorLabel" for="saleNumber">Error: Duplicate Sale Number. Sale Number must be unique.</label>
        
        <label v-else class="errorLabel" for="saleNumber" >{{ errors.first('saleNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=saleNumber placeholder="Sale Number" v-model=saleNumber>

        <label class="errorLabel" for="bidderNumber" >{{ errors.first('bidderNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=bidderNumber placeholder="BidderNumber" v-model=bidderNumber>

        <label class="errorLabel" for="purchaseAmount" >{{ errors.first('purchaseAmount') }}</label>
        <input v-validate="'required|numeric'" type=text name=purchaseAmount placeholder="Purchase Amount" v-model=purchaseAmount>

        <!--<label class="errorLabel" for="purchaseType" >{{ errors.first('purchaseType') }}</label>
        <input v-validate="'required'" type=text name=purchaseType placeholder="Purchase Type" v-model=purchaseType>-->

        <label class="errorLabel" for="processor" >{{ errors.first('processor') }}</label>
        <input v-validate="''" type=text name=processor placeholder="Processor Name" v-model=processor autocomplete="on">

        <button class="manage__button" @click=validate>Update</button>
        <router-link v-bind:to="{ name: 'Manage', params: { view: false, view2: true, view3: false } }">
          <button class="manage__button">Cancel</button>
        </router-link>
      </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'EditTransaction',
  data () {
    return {
      saleNumber: '',
      bidderNumber: '',
      purchaseAmount: '',
      purchaseType: 'Buyer',
      processor: '',
      transactions: [],
      originalSaleNumber: ''
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created: function() {
    this.fetchTransactions()
  },

  mounted () {
    this.getTransaction()
  },

  computed: {
    duplicateSaleNumber () {
      return this.transactions.some(transaction => {
        if (this.saleNumber == transaction.saleNumber && this.originalSaleNumber != this.saleNumber) return true
      })
    }
  },

  methods: {
    fetchTransactions() {
      let uri = `http://${process.env.HOST_NAME}:8081/transaction`
      this.axios.get(uri).then(response => {
        this.transactions = response.data
      })
    },
    async getTransaction () {
      let uri = `http://${process.env.HOST_NAME}:8081/transaction/` + this.$route.params.id
      await this.axios.get(uri).then(response => {
      this.saleNumber = response.data.saleNumber
      this.originalSaleNumber = response.data.saleNumber
      this.bidderNumber = response.data.bidderNumber
      this.purchaseAmount = response.data.purchaseAmount
      this.purchaseType = 'Buyer'
      this.processor = response.data.processor
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateSaleNumber) {
        this.updatePost()
      }
    },
    async updatePost () {
      let updatedTransaction = {
        id: this.$route.params.id,
        saleNumber: this.saleNumber,
        bidderNumber: this.bidderNumber,
        purchaseAmount: this.purchaseAmount,
        purchaseType: this.purchaseType,
        processor: this.processor
      }
      let uri = `http://${process.env.HOST_NAME}:8081/transaction/` + this.$route.params.id
      await this.axios.put(uri, updatedTransaction).then((response) => {
        console.log(response)
      })
      this.$router.push({ name: 'Manage', params: { view: false, view2: true, view3: false } })
    }
  }
}
</script>

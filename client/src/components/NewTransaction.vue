<template>
  <main class="form">
    <h1>Add Transaction</h1>
      <div v-if="this.isDataReady">
        <label v-if="duplicatetransactionumber" class="errorLabel" for="saleNumber">Error: Duplicate Sale Number. Sale Number must be unique.</label>
        <label v-else class="errorLabel" for="saleNumber" >{{ errors.first('saleNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=saleNumber :placeholder="'Sale Number* (next available: ' + nextAvailableSaleNumber + ')'" v-model=saleNumber autocomplete="off">
        <label class="errorLabel" for="bidderNumber" >{{ errors.first('bidderNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=bidderNumber placeholder="BidderNumber*" v-model=bidderNumber autocomplete="off">
        <label class="errorLabel" for="purchaseAmount" >{{ errors.first('purchaseAmount') }}</label>
        <input v-validate="'required|numeric'" v-model="purchaseAmount" :options="options" name="purchaseAmount" placeholder="Purchase Amount*">
        <label class="errorLabel" for="purchaseType" >{{ errors.first('purchaseType') }}</label>
        <input v-validate="'required'" type=text name=purchaseType placeholder="Purchase Type*" v-model=purchaseType autocomplete="off">
        
        <button class="transactions__button" @click=validate>Add</button>
        <router-link v-bind:to="{ name: 'Manage', params: {view: false, view2: true} }">
          <button class="transactions__button">Return to Manage</button>
        </router-link>
        <p>* Indicates required field.</p>
      </div>
  </main>
</template>

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'NewTransaction',
  data () {
    return {
      saleNumber: null,
      bidderNumber: null,
      purchaseAmount: null,
      purchaseType: null,
      transactions: [],
      isDataReady: false
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created () {
    this.fetchTransactions()
    this.getNextAvailableSaleNumber()
  },

  computed: {
    duplicateSaleNumber () {
      return this.transactions.some(transaction => {
        if (this.saleNumber == transaction.saleNumber) return true
      })
    },
    nextAvailableSaleNumber () {
      var existingSaleNumbers = []
      var transaction

      this.fetchTransactions()
      if (this.transactions.length == 0) return 1

      for (transaction of this.transactions) {
        existingSaleNumbers.push(transaction.saleNumber)
      }

      var max = parseInt(Math.max(...existingSaleNumbers))
      return max + 1
    }
  },

  methods: {
    fetchTransactions() {
      let uri = `http://${process.env.HOST_NAME}:8081/transaction`
      this.axios.get(uri).then(response => {
        this.transactions = response.data
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateSaleNumber) {
        this.confirmAdd()
        this.addTransaction()
        this.resetTransaction()
      }
    },
    async addTransaction () {
      let newTransaction = {
        saleNumber: this.saleNumber,
        bidderNumber: this.name,
        purchaseAmount: this.purchaseAmount,
        purchaseType: this.phone.purchaseType
      }
      let uri = `http://${process.env.HOST_NAME}:8081/transaction/add`
      this.axios.post(uri, newTransaction).then((response) => {
        console.log(response)
        if (response.status == 200) {
          this.$validator.errors.clear()
          this.confirmAdd('success')
        } else {
          this.confirmAdd('fail')
        }
      })
    },
    getNextAvailableSaleNumber () {
      var existingSaleNumbers = []
      var transaction

      this.fetchTransactions()

      if (this.transactions.length == 0) {
        this.isDataReady = true
        return 1
      }

      for (transaction of this.transactions) {
        existingSaleNumbers.push(transaction.saleNumber)
      }
      if (this.saleNumber != null) {
        existingSaleNumbers.push(parseInt(this.saleNumber))
      }
      this.isDataReady = true

      var max = parseInt(Math.max(...existingSaleNumbers))
      return max + 1
    },
    resetTransaction () {
      this.saleNumber = this.getNextAvailableSaleNumber()
      this.bidderNumber = ''
      this.purchaseAmount = ''
      this.purchaseType = ''
    },
    addDashes()
    {
      this.phone.value = this.phone.value.replace(/\D/g, '')
      this.phone.value = this.phone.value.slice(0, 3) + "-" + this.phone.value.slice(3, 6) + "-" + this.phone.value.slice(6, 15)
    },
    confirmAdd(sts) {
      if (sts == 'success') {
        document.getElementById("confirmLabel").innerText = "Added successfully!"
      } else if (sts == 'fail') {
        document.getElementById("confirmLabel").innerText = "Transaction not added"
      } else {
        document.getElementById("confirmLabel").innerText = ''
      }
    }
  }
}
</script>

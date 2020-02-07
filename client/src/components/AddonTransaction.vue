<template>
  <div class="addon_transaction">
    <router-link v-bind:to="{ name: 'Admin' }">
      <button class="transaction__top-button--yellow"><span class="button-arrow">&#8592;</span> Return to Dashboard</button>
    </router-link>
    <main>
      <h1>Create Addon Transactions</h1>
      <div class="addon_grid-container">
        <div class="sale_form">
          <div class="green_border">
            <p class="input-field__label">Sale Number</p>
            <input @focus="clearSaleNumber" @blur="zeroSaleNumber" @change="fetchData" autocomplete="off" v-validate="'required|numeric'" type="number" v-on:input="getExhibitorBySaleNum" name="saleNumber" v-model="saleNumber">
            <label class="errorLabel" for="saleNumber">{{ errors.first('saleNumber') }}</label>
            <label class="input__name-label">Exhibitor Name: {{ exhibitorName }}</label>
          </div>
          <div class="green_border">
            <section class="form__section">
              <p class="input-field__label">Addon Bidder Number</p>
              <input @focus="clearAddon" @blur="zeroAddon" v-validate="'required|numeric'" type="number" v-on:input="getAddonByBidderNum" name="addonNumber" v-model="addonNumber">
              <label class="errorLabel" for="saleNumber" >{{ errors.first('addonNumber') }}</label>
              <label class="input__name-label">Buyer Name: {{ addonName }}</label>
              <p class="input-field__label">Amount</p>
              <label class="errorLabel" for="addonPurchaseAmount" >{{ errors.first('purchaseAmount') }}</label>
              <input @focus="clearPurchase" @blur="zeroPurchase" v-validate="'required|numeric'" type="number" name="purchaseAmount" v-model="purchaseAmount">
              <button class="form__button--second" name="addBtn" @click="addNewTransaction">Submit Addon</button>
            </section>
          </div>
        </div>
        <div class="sale_view">
          <div class="current_exhibitor">
            <p>Sale:</p>
            <p v-if="exhibitor != null && saleNumber != 0">{{exhibitor.fullName}}</p>
            <p v-else>Waiting for input</p>
            <p v-if="exhibitor != null && saleNumber != 0">{{exhibitor.saleNumber}}</p>
            <p v-else>#</p>
          </div>
          <div class="current_buyers">
            <table class="inner_table">
              <thead>Buyers</thead>
              <tbody v-if="exhibitor != null">
                <tr v-if="buyers != null" v-for="buyer in buyerNumbers" :key="buyer">
                  <td>{{ buyers[buyer].name }}</td>
                </tr>
                <tr>
                  <td v-if="t.purchaseType == buyer" v-for="t in transactions" :key="t._id">Purchase Amount: ${{t.purchaseAmount}}</td>
                  <td v-else-if="t.purchaseType == buyer">Purchase Amount: none</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="current_addons">
            <table class="inner_table">
              <thead>Addons</thead>
              <tbody v-if="exhibitor != null">
                <tr v-if="addon.column == 1" v-for="addon in addons" :key="addon._id">
                  <td>{{ addon.name }}</td>
                  <td>${{ addon.purchaseAmount }}</td>
                  <td class="clickable" @click="deleteAddon(addon._id)">Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="current_addons2">
            <table class="inner_table">
              <thead>Addons</thead>
              <tbody v-if="exhibitor != null">
                <tr v-if="addon.column == 2" v-for="addon in addons" :key="addon._id">
                  <td>{{ addon.name }}</td>
                  <td>${{ addon.purchaseAmount }}</td>
                  <td class="clickable" @click="deleteAddon(addon._id)">Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'AddonTransaction',
    data () {
      return {
        saleNumber: 0,
        addonNumber: 0,
        purchaseAmount: 0,
        buyers: [],
        addons: [],
        exhibitor: [],
        transactions: [],
        buyerNumbers: [],
        addonName: "",
        buyerName: "",
        exhibitorName: "",
        buyer: "Buyer"
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      async fetchData () {
        await this.fetchExhibitor()
        await this.fetchBuyers()
        await this.fetchTransactions()
      },
      async fetchExhibitor() {
        // fetches the current exhibitor by its sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber}`
        await this.axios.get(url).then(response => {
          this.exhibitor = response.data
        })
      },
      async fetchBuyers() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer`
        this.axios.get(uri).then(response => {
          response.data.forEach((buyer) => { this.buyers[buyer.bidderNumber] = buyer })
        })
      },
      async fetchAddons() {
        this.addons = []

        let col = 1
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Addon") {
            col = Math.floor(i / 21 + 1)
            this.addons.push({
            _id: this.transactions[i]._id,
            name: this.buyers[this.transactions[i].bidderNumber].name,
            purchaseAmount: this.transactions[i].purchaseAmount,
            column: col
            })
          }
        }
      },
      async fetchTransactions() {
        let url = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.saleNumber}`
        await this.axios.get(url).then(response => {
          this.transactions = response.data
        })
        .catch(() => console.log("Waiting for transaction to occur"))
        this.fetchBuyerNumbers()
        this.fetchAddons()
      },
      async fetchBuyerNumbers() {
        let buyerIndex = -1
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Buyer") buyerIndex = i
        }
        if (this.transactions.length > 0 && buyerIndex >= 0) this.buyerNumbers = this.transactions[buyerIndex].bidderNumber.split('-').map(Number)
        else this.buyerNumbers = []
      },
      async getExhibitorBySaleNum() {
        let uri = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber}`
        await this.axios.get(uri).then(response => {
          if (response.data == null) {
            this.exhibitorName = `Exhibitor with sale number ${this.saleNumber} does not exist.`
          }
          else {
            this.exhibitorName = response.data.fullName
          }
        })
      },
      async getBuyerByBidderNum() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer/bidderNumber/${this.bidderNumber}`
        await this.axios.get(uri).then(response => {
          if (response.data == null) {
            this.buyerName = `Buyer with bidder number ${this.bidderNumber} does not exist.`
          }
          else {
            this.buyerName = response.data.name
          }
        })
      },
      async getAddonByBidderNum() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer/bidderNumber/${this.addonNumber}`
        await this.axios.get(uri).then(response => {
          if (response.data == null) {
            this.addonName = `Buyer with bidder number ${this.addonNumber} does not exist.`
          }
          else {
            this.addonName = response.data.name
          }
        })
      },
      async deleteAddon(id) {
        console.log(id)
        let uri = `http://${process.env.HOST_NAME}:8081/transaction/` + id
        await this.axios.delete(uri).then((response) => {
          console.log(response)
        })
        this.fetchTransactions()
      },
      async addNewTransaction () {
        if (this.addonNumber != 0 && this.buyers[this.addonNumber] != null) {
          let newTransaction = {
            saleNumber: this.saleNumber,
            bidderNumber: this.addonNumber,
            purchaseAmount: this.purchaseAmount,
            purchaseType: "Addon"
          }
          let uri = `http://${process.env.HOST_NAME}:8081/transaction/add`
          await this.axios.post(uri, newTransaction)
          .then((response) => {
            console.log(response)
            this.fetchTransactions()
          })
          .then(() => {
            this.addonNumber = 0
            this.purchaseAmount = 0
          })
        } else {
          window.alert("Addon number cannot be null")
        }
      },
      clearSaleNumber () {
        this.saleNumber = ''
        this.exhibitor = null
        this.addons = []
        this.buyers = []
      },
      zeroSaleNumber () {
        this.saleNumber = this.saleNumber == '' ? 0 : this.saleNumber
      },
      clearAddon () {
        this.addonNumber = this.addonNumber == 0 ? '' : this.addonNumber
      },
      zeroAddon () {
        this.addonNumber = this.addonNumber == '' ? 0 : this.addonNumber
      },
      clearPurchase() {
        this.purchaseAmount = this.purchaseAmount == 0 ? '' : this.purchaseAmount
      },
      zeroPurchase() {
        this.purchaseAmount = this.purchaseAmount == '' ? 0 : this.purchaseAmount
      }
    }
  }
</script>

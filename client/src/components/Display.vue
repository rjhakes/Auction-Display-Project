<template>
    <main class="display">
      <!-- CURRENT SALE -->
      <section class="currentsale" v-if="(exhibitor != null && previousSaleNumber != saleNumber)">
        <h1 class="display__header--white">Current Sale: #{{exhibitor.saleNumber}}</h1>
        <p class="display__exhibitor-name">{{exhibitor.fullName}}</p>
        <p class="display__exhibitor-info">Species: {{exhibitor.species}}</p>
        <p class="display__exhibitor-info">Weight: {{exhibitor.checkInWeight}} lbs</p>
        <p class="display__exhibitor-info">Placing: {{exhibitor.placing}}</p>
      </section>
      <section class="currentsale" v-else>
        <h1 class="display__header--white">Current Sale:</h1>
        <p class="display__header--white"><em>Please wait for the next sale</em></p>
      </section>
      <!-- PREVIOUS SALE -->
      <section class="previoussale" v-if="previousExhibitor != null">
        <!-- EXHIBITOR -->
        <section>
          <h1 class="display__header">Previous Sale: #{{ previousExhibitor.saleNumber }}</h1>
          <p class="display__exhibitor-name">{{ previousExhibitor.fullName }}</p>
          <p class="display__exhibitor-info">Species: {{ previousExhibitor.species }}</p>
          <p class="display__exhibitor-info">Weight: {{ previousExhibitor.checkInWeight }}</p>
        </section>
        <!-- BUYER -->
        <section class="buyers">
          <p class="display__second-header">Buyers:</p>
          <section class="buyer" v-if="buyer !== null" v-for="buyer in buyers" :key="buyer._id">
            {{ buyer.name }}.
          </section>
          <section class="purchaseAmount" v-if="transaction.purchaseType === buyer" v-for="transaction in transactions" :key="transaction._id">
            Purchase Amount: ${{ transaction.purchaseAmount }}
          </section>
        </section>
        <!-- ADDONS -->
        <section class="addons">
          <p class="display__second-header">Addons:</p>
          <section class="addon" v-if="(transaction.purchaseType === addon) && transactions.length" v-for="transaction in transactions" :key="transaction._id">
            <section v-if="addOn.bidderNumber == transaction.bidderNumber" v-for="addOn in addOns" :key="addOn._id">
              {{ addOn.name }} - ${{ transaction.purchaseAmount }}
            </section>
          </section>
        </section>
      </section>
    </main>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data() {
      return {
        saleNumber: 0,
        exhibitor: [],
        previousExhibitor: [],
        buyers: [],
        addOns: [],
        transactions: [],
        previousSaleNumber: 0,
        displayID: 0,
        bidderNumbers: 0,
        showCurrentSale: false,
        showPreviousSale: false,
        buyer: "Buyer",
        addon: "Addon"
      }
    },
    computed: {
      ...mapState({
        // saleNumber: state => state.saleNumber,
        // transactions: state => state.transactions
      })
    },
    created: function() {
      setInterval(() => this.fetchSaleNumber(), 1000)
      this.fetchSaleNumber()
    },
    methods: {
      async fetchSaleNumber() {
        // retrieve data for comparison
        let uri = `http://${process.env.HOST_NAME}:8081/display`
        await this.axios.get(uri).then(response => {
          if (response.data.length >= 1) {
            this.displayID = response.data[0]._id
            this.saleNumber = response.data[0].saleNumber
            this.showCurrentSale = response.data[0].showCurrentSale
            this.showPreviousSale = response.data[0].showPreviousSale
          }
        })
        // checks flag, retrieves new sale number, then reloads pages in the display functions
        if (this.showCurrentSale === true) {
          this.displayCurrentSale()
        }
        if (this.showPreviousSale === true) {
          this.displayPreviousSale()
        }
        this.fetchData()
      },
      async fetchData() {
        // fetches all data
        this.fetchExhibitor()
        this.fetchPreviousExhibitor()
        this.fetchBuyers()
        this.fetchTransactions()
        this.fetchAddOns()
        // this.fetchAddOnBuyers()
      },
      async displayCurrentSale() {
        let uri = `http://${process.env.HOST_NAME}:8081/display/${this.displayID}`
        this.showCurrentSale = false
        let state = {
          saleNumber: this.saleNumber,
          previousSaleNumber: this.previousSaleNumber,
          showCurrentSale: this.showCurrentSale,
          showPreviousSale: this.showPreviousSale
        }
        await this.axios.put(uri, state).then(response => {})
      },
      async displayPreviousSale() {
        let uri = `http://${process.env.HOST_NAME}:8081/display/${this.displayID}`
        this.showPreviousSale = false
        let updatedCheck = {
          saleNumber: this.saleNumber,
          previousSaleNumber: this.previousSaleNumber,
          showCurrentSale: this.showCurrentSale,
          showPreviousSale: this.showPreviousSale
        }
        await this.axios.put(uri, updatedCheck).then(response => { })
        // window.location.reload()
        // Above line changed from previous code, can be removed.. probably
        this.buyers = []
        this.addOns = []
        this.fetchData()
      },
      async fetchExhibitor() {
        // fetches the current exhibitor by its sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber}`
        await this.axios.get(url).then(response => {
          this.exhibitor = response.data
        })
      },
      async fetchPreviousExhibitor() {
        // gets the previous sale number from the most recent transaction
        await this.axios.get(`http://${process.env.HOST_NAME}:8081/transaction`).then(response => {
          let index = response.data.length - 1
          while (response.data.length > 0) {
            if (response.data[index].purchaseType === "Buyer") {
              this.previousSaleNumber = response.data[index].saleNumber
              break
            } else index--
          }
        })
        // fetches the previous exhibitor by the previous sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.previousSaleNumber}`
        await this.axios.get(url).then(response => {
          this.previousExhibitor = response.data
        })
      },
      async fetchTransactions() {
        let url = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.previousSaleNumber}`
        await this.axios.get(url).then(response => {
          this.transactions = response.data
        })
      },
      async fetchBuyers() {
        await this.parseBidderNumber()
        for (let i = 0; i < this.bidderNumbers.length; i++) {
          let uri = `http://${process.env.HOST_NAME}:8081/buyer/bidderNumber/${this.bidderNumbers[i]}`
          await this.axios.get(uri).then(response => {
            this.buyers[i] = response.data
            if (this.buyers.length > this.bidderNumbers.length) this.buyers.length = this.bidderNumbers.length
          })
        }
      },
      async parseBidderNumber() {
        let index = 0
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Buyer") index = i
        }
        this.bidderNumbers = this.transactions[index].bidderNumber.split('-')
      },
      async fetchAddOns() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer`
        await this.axios.get(uri).then(response => {
          this.addOns = response.data
        })
      },
      ...mapActions(['setSaleNumber', 'setTransactions'])
    }
  }
</script>

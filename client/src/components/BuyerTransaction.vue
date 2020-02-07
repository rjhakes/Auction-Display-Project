<template>
  <main class="transaction">
    <router-link v-bind:to="{ name: 'Admin' }">
      <button class="transaction__top-button--yellow"><span class="button-arrow">&#8592;</span> Return to Dashboard</button>
    </router-link>
    <router-link to="/transaction/addon">
      <button class="transaction__top-button"><span class="button-arrow">&#8596;</span> Go to Addon Transaction Table</button>
    </router-link>
    <main class="transaction__form">
      <h1>Create Buyer Transaction</h1>
      <section class="form__section">
        <p class="input-field__label">Sale Number</p>
        <input v-validate="'required|numeric'" type="number" v-on:input="getExhibitorBySaleNum" name="saleNumber" v-model="saleNumber">
        <label class="errorLabel" for="saleNumber" >{{ errors.first('saleNumber') }}</label>
        <label class="input__name-label">Exhibitor Name: {{ exhibitorName }}</label>
        <button class="form__button" @click="displayCurrentExhibitor">Submit Current Sale</button>
      </section>
      <section class="form__section">
        <p class="input-field__label">Bidder Number</p>
        <input v-validate="'required|numeric'" type="number" v-on:input="getBuyerByBidderNum" name="bidderNumber" v-model="bidderNumber">
        <label class="errorLabel" for="saleNumber" >{{ errors.first('bidderNumber') }}</label>
        <label class="input__name-label">Buyer Name: {{ buyerName }}</label>
        <button class="form__button--second" @click="addNewBidder">Add Another Bidder</button>
      </section>
      <section class="form__section">
        <p class="input-field__label">Amount:</p>
        <label class="errorLabel" for="purchaseAmount" >{{ errors.first('purchaseAmount') }}</label>
        <input v-validate="'required|numeric'" type="number" name="purchaseAmount" v-model="purchaseAmount">
        <button class="form__button" name="addBtn" @click="addNewTransaction">Submit & Go To Next Sale</button>
      </section>
    </main>
  </main>
</template>

<script>
  export default {
    name: 'BuyerTransaction',
    data () {
      return {
        saleNumber: 0,
        previousSaleNumber: 0,
        bidderNumber: 0,
        purchaseAmount: 0,
        buyerName: "",
        exhibitorName: "",
        purchaseType: "Buyer",
        showCurrentSale: false,
        showPreviousSale: false,
        displayID: 0,
        bidders: []
      }
    },
    created: function () {
      this.fetchDisplay()
    },
    methods: {
      /*
        FUNCTIONALITY
        1) display the current exhibitor [x]
          - change sale number in display
          - check for data
          - reload page
        2) have an array of bidders if they want to add more [x]
          - store as string 
        3) add a new transaction [x]
          - add input validation for bidder field [ ]
      */
      async fetchDisplay() {
        let url = `http://${process.env.HOST_NAME}:8081/display`
        await this.axios.get(url).then(response => {
          if (response.data.length >= 1) this.displayID = response.data[0]._id
        })
      },
      async displayCurrentExhibitor() {
        // sets flag to display the current sale
        this.showCurrentSale = true
        // this.showCurrentSaleSection = true
        let state = {
          saleNumber: this.saleNumber,
          previousSaleNumber: this.previousSaleNumber,
          showCurrentSale: this.showCurrentSale,
          showPreviousSale: this.showPreviousSale
        }
        let uri = `http://${process.env.HOST_NAME}:8081/display/${this.displayID}`
        await this.axios.put(uri, state).then((response) => { })
      },
      async addNewBidder() {
        // pushes to array if there's more than on bidder number [x]
        // has a confirmation message that it's been added to the table [ ]
        this.bidders.push(this.bidderNumber)
        console.log(this.bidders)
        // resets input field
        this.bidderNumber = ""
      },
      async addNewTransaction() {
        // checks how many bidders there are, joins it if there's more than one
        if (this.bidders.length > 1) this.bidders = this.bidders.join('-')
        else this.bidders = this.bidderNumber.toString()

        let newTransaction = {
          saleNumber: this.saleNumber,
          bidderNumber: this.bidders,
          purchaseAmount: this.purchaseAmount,
          purchaseType: this.purchaseType
        }
        let uri = `http://${process.env.HOST_NAME}:8081/transaction/add`
        await this.axios.post(uri, newTransaction).then((response) => {
          console.log(response)
        })

        // sets flag to show previous sale
        this.showPreviousSale = true
        let state = {
          saleNumber: this.saleNumber,
          previousSaleNumber: this.previousSaleNumber,
          showCurrentSale: this.showCurrentSale,
          showPreviousSale: this.showPreviousSale
        }
        await this.axios.put(`http://${process.env.HOST_NAME}:8081/display/` + this.displayID, state).then(response => { })
        // empties array of bidders
        this.bidders = []
        this.saleNumber++
      },
      async getExhibitorBySaleNum () {
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
      async getBuyerByBidderNum () {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer/bidderNumber/${this.bidderNumber}`
        await this.axios.get(uri).then(response => {
          if (response.data == null) {
            this.buyerName = `Buyer with bidder number ${this.bidderNumber} does not exist.` 
          }
          else {
            this.buyerName = response.data.name
          }
        })
      }
    }
  }
</script>

<template>
  <div class="alternative_transaction">
    <router-link v-bind:to="{ name: 'Admin' }">
      <button class="transaction__top-button--yellow" tabindex=-1><span class="button-arrow">&#8592;</span> Return to Dashboard</button>
    </router-link>
    <main>
      <div class="grid-container">
        <div class="current_sale_form">
          <div class="green_border">
            <p class="input-field__label">Sale Number</p>
            <input v-validate="'required|numeric'" type="number" ref="saleNumber" v-on:input="getExhibitorBySaleNum" name="saleNumber" v-model="saleNumber" tabindex=1 autofocus>
            <label class="errorLabel" for="saleNumber">{{ errors.first('saleNumber') }}</label>
            <label class="input__name-label">Exhibitor Name: {{ exhibitorName }}</label>
            <button class="form__button--second" @click="displayCurrentExhibitor" tabindex=1>Submit To Current Sale</button>
          </div>
          <div class="green_border">
            <section class="form__section">
              <p class="input-field__label">Buyer Bidder Number</p>
              <input @focus="clearBidder" @blur="zeroBidder" v-validate="'required|numeric'" type="number" v-on:input="getBuyerByBidderNum" name="bidderNumber" v-model="bidderNumber" tabindex=2>
              <label class="errorLabel" for="saleNumber" >{{ errors.first('bidderNumber') }}</label>
              <label class="input__name-label">Buyer Name: {{ buyerName }}</label>
              <button class="form__button--second" @click="addNewBidder" tabindex=3>Add Bidder</button>
            </section>
          </div>
          <div class="green_border">
            <section class="form__section">
              <p class="input-field__label">Processor</p>
              <input @focus="clearProcessor" @blur="zeroProcessor" v-validate="'alpha_spaces'" type="text" v-on:input="getProcessor" name="processorName" v-model="processorName" tabindex=4>
              <label class="errorLabel" for="saleNumber" >{{ errors.first('processorName') }}</label>
              <label class="input__name-label">Processor Name: {{ processorName }}</label>
              <button class="form__button--second"  @click="addNewProcessor" tabindex=5>Submit Processor</button>
            </section>
          </div>
        </div>
        <div class="current_sale_view">
          <div class="current_exhibitor">
            <p>Current Sale:</p>
            <p v-if="exhibitor != null && previousSaleNumber != exhibitor.saleNumber">{{exhibitor.fullName}}</p>
            <p v-else>Waiting for New Exhibitor</p>
            <p v-if="exhibitor != null && previousSaleNumber != exhibitor.saleNumber">{{exhibitor.saleNumber}}</p>
            <p v-else>#</p>
          </div>
          <div class="current_buyers">
            <table class="inner_table">
              <thead>Buyers</thead>
              <tbody>
                <!--FIXME: doesn't display 'Unregistered Buyer' on first submission
                            doesn't display subsequent bidders after 'Unregistered Buyer'-->
                <tr v-if="buyers != null" v-for="b in bidders" :key="b">
                  <td>{{ buyers[b].name }}</td>
                  <td class="clickable" @click="deleteBidder(b)">Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="current_addons">
            <table class="inner_table">
              <thead>Processors</thead>
              <tbody v-if="exhibitor != null">
                <tr  v-for="p in processors" :key="p">
                  <td>{{ p }}</td>
                  <td class="clickable" @click="deleteProcessor(p)">Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="button_holder">
            <table>
              <tr>
                <td></td>
                <td><label class="errorLabel" for="purchaseAmount" >{{ errors.first('purchaseAmount') }}</label></td>
              </tr>
              <tr>
                <td>Purchase Amount:</td>
                <td><input  @focus="clearCurrentPurchase" @blur="zeroCurrentPurchase" v-validate="'required|numeric'" type="number" name="purchaseAmount" v-model="purchaseAmount" tabindex=6></td>
                <td><button class="submit_current_button" name="addBtn" @click="addNewBuyerTransaction" tabindex=7>Submit & Go To Next Sale</button></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="previous_sale_view">
          <div class="previous_exhibitor">
            <p>Previous Sale:</p>
            <p v-if="previousExhibitor != null">{{previousExhibitor.fullName}}</p>
            <p v-else>Waiting for transactions</p>
            <p v-if="previousExhibitor != null">{{previousExhibitor.saleNumber}}</p>
            <p v-else>#</p>
          </div>
          <div class="previous_buyers">
            <table class="inner_table">
              <thead>Buyers</thead>
              <tr v-if="buyers != null" v-for="pBuyer in previousBuyerNumbers" :key="pBuyer">
                <td>{{ buyers[pBuyer].name }}</td>
              </tr>
              <tr class="previous_table_tail">
                <td v-if="t.purchaseType == buyer" v-for="t in transactions2" :key="t._id">Purchase Amount: ${{t.purchaseAmount}}</td>
                <td v-else-if="t.purchaseType == buyer">Purchase Amount: none</td>
              </tr>
            </table>
          </div>
          <div class="previous_processors">
            <table class="inner_table">
              <thead>Processors</thead>
              <td v-for="t in transactions2" :key="t._id">{{t.processor}}</td>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'GuiTransaction',
    data () {
      return {
        saleNumber: 0, // Active number to submit or add to
        exhibitorName: "",
        previousSaleNumber: 0,
        bidderNumber: 0, // To submit new buyer
        buyerName: "",
        purchaseAmount: 0, // To submit to current exhibitor with bidders[]
        processorName: "",
        
        showCurrentSale: false,
        showPreviousSale: false,
        currentSaleCheck: false,
        previousSaleCheck: false,

        display: [],
        buyerNumbers: [], // Current display buyers

        bidders: [], // To submit to current exhibitor
        processors: [], // to submit to current exhibitor
        processors2: [],
        exhibitor: [], // Current display exhibitor with purchaseAmount

        previousExhibitor: [], // For previous exhibitor display
        previousBuyerNumbers: [], // Previous displaybuyers

        buyers: [], // Complete buyers list

        pList: [], // Current exhibitor processors list
        pList2: [], // Previous exhibitor processors list
        
        transactions: [], // Current exhibitor transactions list
        transactions2: [], // Previous exhibitor transactions list

        buyer: "Buyer"
      }
    },
    created: function () {
      this.fetchData().then(() => { this.saleNumber = this.display.saleNumber + 1 })
    },
    computed: {
      ...mapState({
        // saleNumber: state => state.saleNumber,
        // transactions: state => state.transactions
      })
    },
    methods: {
      async fetchData() {
        this.fetchPreviousExhibitor()
        await this.fetchBuyers()
        await this.fetchDisplay()
        await this.fetchExhibitor()
        this.fetchTransactions() // Then fetches addons and buyerNumbers
        this.fetchPreviousTransactions()
      },
      async fetchDisplay() {
        let url = `http://${process.env.HOST_NAME}:8081/display`
        await this.axios.get(url).then(response => {
          if (response.data.length >= 1) {
            this.display = response.data[0]
          }
        })
      },
      async fetchExhibitor() {
        // fetches the current exhibitor by its sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.display.saleNumber}`
        await this.axios.get(url).then(response => {
          this.exhibitor = response.data
        })
      },
      async fetchTransactions() {
        let url = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.display.saleNumber}`
        await this.axios.get(url).then(response => {
          this.transactions = response.data
        })
        .catch(() => console.log("Waiting for transaction to occur"))
      },
      async fetchPreviousExhibitor() {
        // gets the previous sale number from the most recent transaction
        await this.axios.get(`http://${process.env.HOST_NAME}:8081/transaction`)
        .then(response => {
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
      async fetchPreviousTransactions() {
        let url = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.previousSaleNumber}`
        await this.axios.get(url).then(response => {
          this.transactions2 = response.data
        })
        .catch(err => { console.log(err) })
        this.fetchPreviousBuyerNumbers()
        this.fetchPreviousProcessors()
      },
      async fetchPreviousBuyerNumbers() {
        let buyerIndex = -1
        for (let i = 0; i < this.transactions2.length; i++) {
          if (this.transactions2[i].purchaseType == "Buyer") buyerIndex = i
        }
        if (this.transactions2.length > 0 && buyerIndex >= 0) this.previousBuyerNumbers = this.transactions2[buyerIndex].bidderNumber.split('-').map(Number)
        else this.previousBuyerNumbers = []
      },
      async fetchBuyers() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer`
        this.axios.get(uri).then(response => {
          response.data.forEach((buyer) => { this.buyers[buyer.bidderNumber] = buyer })
        })
      },
      async fetchPreviousProcessors() {
          this.processors2 = []
          let col = 1
          for (let i = 0; i < this.transactions2.length; i++) {
            if (this.transactions2[i].purchaseType == "Buyer") {
              this.processors2.push({
                _id: this.transactions2[i]._id,
                name: this.buyers[this.transactions2[i].bidderNumber].name,
                purchaseAmount: this.transactions2[i].purchaseAmount,
                processorName: this.transactions2[i].processor,
                column: col
              })
          }
          }
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
            this.buyerName = 'Unregistered Buyer'   
          }
          else {
            this.buyerName = response.data.name
          }
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
        let uri = `http://${process.env.HOST_NAME}:8081/display/${this.display._id}`
        await this.axios.put(uri, state).then((response) => { })
        this.fetchData()
      },
      async addNewBuyerTransaction() {
        if (this.purchaseAmount == 0) {
          window.alert("Purchase amount cannot be 0")
        } else if (this.bidders.length == 0) {
          window.alert("Bidders cannot be empty")
        } else if (this.previousSaleNumber == this.exhibitor.saleNumber) {
          window.alert("Sumbit exhibitor to current sale")
        } else {
          // checks how many bidders there are, joins it if there's more than one
          if (this.bidders.length > 1) this.bidders = this.bidders.join('-')
          else this.bidders = this.bidders.toString()

          let newTransaction = {
            saleNumber: this.display.saleNumber,
            bidderNumber: this.bidders,
            purchaseAmount: this.purchaseAmount,
            purchaseType: "Buyer",
            processor: this.processors
          }
          let uri = `http://${process.env.HOST_NAME}:8081/transaction/add`

          await this.axios.post(uri, newTransaction).then((response) => {
              console.log(response)
              this.purchaseAmount = 0
             })
            .catch((err) => {
              window.alert(
                "Failed with:\n" +
                err +
                "\nsaleNumber: " + this.display.saleNumber +
                "\nbidderNumber: " + this.bidders +
                "\npurchaseAmount: " + this.purchaseAmount +
                "\nprocessorName: " + this.processorName)
            })

          // sets flag to show previous sale
          this.showPreviousSale = true
          let state = {
            saleNumber: this.saleNumber,
            previousSaleNumber: this.previousSaleNumber,
            showCurrentSale: this.showCurrentSale,
            showPreviousSale: this.showPreviousSale
          }
          await this.axios.put(`http://${process.env.HOST_NAME}:8081/display/` + this.display._id, state)
            .then(response => { console.log(response) })
            .then(() => {
              this.bidders = []
              //this.processors2 = this.processors
              this.processors = []
              this.saleNumber++
              this.fetchPreviousExhibitor()
              this.fetchData()
            })
        }
      },
      async addNewProcessor() {
        this.processors.push(this.processorName)
        console.log(this.processors)
        this.processorName = ''
      },
      async addNewBidder() {
        // pushes to array if there's more than on bidder number [x]
        // has a confirmation message that it's been added to the table [ ]
        if (this.bidders.indexOf(this.bidderNumber) > -1) {
          window.alert("Bidder already present!")
        } else if (this.bidderNumber == 0) {
          window.alert("Bidder number cannot be 0")
        } else {
          if (this.buyerName == 'Unregistered Buyer') {
            let newBuyer = {
              bidderNumber: this.bidderNumber,
              name: this.buyerName,
              contactName: '', 
              phone: '',
              email: '',
              logoFileName: ''
            }
            let uri = `http://${process.env.HOST_NAME}:8081/buyer/add`
            this.axios.post(uri, newBuyer).then((response) => {
            console.log(response)
            if (response.status == 200) {
              this.$validator.errors.clear()
              this.confirmAdd('success')
            } else {
              this.confirmAdd('fail')
            }
          })
          }
          this.bidders.push(this.bidderNumber)
          console.log(this.bidders)
        }
        // resets input field
        this.bidderNumber = "0"
      },
      async deleteProcessor(processorName) {
        this.processors.splice(this.processors.indexOf(processorName), 1)
      },
      clearProcessor() {
        this.processorName = this.processorName == 0 ? '' : this.processorName
      },
      zeroProcessor() {
        this.processorName = this.processorName == 0 ? '' : this.processorName
      },
      deleteBidder(bidderNumber) {
        this.bidders.splice(this.bidders.indexOf(bidderNumber), 1)
      },
      clearBidder() {
        this.bidderNumber = this.bidderNumber == 0 ? '' : this.bidderNumber
      },
      zeroBidder() {
        this.bidderNumber = this.bidderNumber == '' ? 0 : this.bidderNumber
      },
      clearCurrentPurchase() {
        this.purchaseAmount = this.purchaseAmount == 0 ? '' : this.purchaseAmount
      },
      zeroCurrentPurchase() {
        this.purchaseAmount = this.purchaseAmount == '' ? 0 : this.purchaseAmount
      },
      ...mapActions(['setSaleNumber', 'setTransactions'])
    }
  }
</script>

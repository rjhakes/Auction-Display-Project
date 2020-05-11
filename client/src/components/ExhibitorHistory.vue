<template>
    <main class="exhibitorHistory">
      <h1 class="history_display_header">Exhibitor History</h1>
      <div class="table_view">
      <table class ="exhibitor_history_table">
        <thead>
          <tr>
            <th class="table_c4">Sale #</th>
            <th class="table_c4">Exhibitor Name</th>
            <th class="table_c4">Buyers</th>
            <th class="table_c4">Purchase Amount</th>
            <th class="table_c4">Processors</th>
            <!--<th class="table_c4">Addons</th>-->
          </tr>
        </thead>
        <tbody>
          <tr class="exhibitor_table_rows">
            <td class="sale_number">{{this.saleNumber}}</td>
            <td v-if="exhibitor != null">{{exhibitor.fullName}}</td>

            <!-- Buyers -->
            <td>
              <table>
                <tbody>
                  <tr class="buyer_rows" v-for="b in buyerNumbers" :key="b">
                    <td>{{ buyers[b].name }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Purchase Ammount -->
            <td>
              <table>
                <tbody>
                  <tr class="purchaseAmount_rows" v-if="transactions[0] != null" v-for="t in transactions" :key="t._id">
                    <td>${{t.purchaseAmount}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Processors -->
            <td>
              <table>
                <tbody>
                  <tr class="processor_rows" v-if="transactions[0] != null" v-for="t in transactions" :key="t._id">
                    <td>{{t.processor}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

          <tr class ="table_tail">
          </tr>
        </tbody>
      </table>

      <!-- Second Exhibitor View -->
      <table class ="exhibitor_history_table">
        <thead>
          <tr>
            <th class="table_c4">Sale #</th>
            <th class="table_c4">Exhibitor Name</th>
            <th class="table_c4">Buyers</th>
            <th class="table_c4">Purchase Amount</th>
            <th class="table_c4">Processors</th>
            <!--<th class="table_c4">Addons</th>-->
          </tr>
        </thead>
        <tbody>
          <tr class="exhibitor_table_rows">
            <td class="sale_number">{{this.saleNumber2}}</td>
            <td>{{exhibitor2.fullName}}</td>

            <!-- Buyers -->
            <td>
              <table>
                <tbody>
                  <tr class="buyer_rows" v-for="b in buyerNumbers2" :key="b">
                    <td>{{ buyers[b].name }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Purchase Ammount -->
            <td>
              <table>
                <tbody>
                  <tr class="purchaseAmount_rows" v-if="transactions2[0] != null" v-for="t in transactions2" :key="t._id">
                    <td>${{t.purchaseAmount}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Processors -->
            <td>
              <table>
                <tbody>
                  <tr class="processor_rows" v-if="transactions2[0] != null" v-for="t in transactions2" :key="t._id">
                    <td>{{t.processor}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>

          <tr class ="table_tail">
          </tr>
        </tbody>
      </table>

      <!-- Third Exhibitor View -->
      <table class ="exhibitor_history_table">
        <thead>
          <tr>
            <th class="table_c4">Sale #</th>
            <th class="table_c4">Exhibitor Name</th>
            <th class="table_c4">Buyers</th>
            <th class="table_c4">Purchase Amount</th>
            <th class="table_c4">Processors</th>
            <!--<th class="table_c4">Addons</th>-->
          </tr>
        </thead>
        <tbody>
          <tr class="exhibitor_table_rows">
            <td class="sale_number">{{this.saleNumber3}}</td>
            <td>{{exhibitor3.fullName}}</td>

            <!-- Buyers -->
            <td>
              <table>
                <tbody>
                  <tr class="buyer_rows" v-for="b in buyerNumbers3" :key="b">
                    <td>{{ buyers[b].name }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Purchase Ammount -->
            <td>
              <table>
                <tbody>
                  <tr class="purchaseAmount_rows" v-if="transactions3[0] != null" v-for="t in transactions3" :key="t._id">
                    <td>${{t.purchaseAmount}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Processors -->
            <td>
              <table>
                <tbody>
                  <tr class="processor_rows" v-if="transactions3[0] != null" v-for="t in transactions3" :key="t._id">
                    <td>{{t.processor}}</td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>

          <tr class ="table_tail">
          </tr>
        </tbody>
      </table>
    </div>
    </main>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data() {
      return {
        exhibitorDisplaySpeed: 3000, // milliseconds
        saleNumber: -1,
        saleNumber2: -1,
        saleNumber3: -1,
        maxSaleNumber: 0,
        exhibitor: [],
        buyers: [],
        addons: [],
        transactions: [],
        buyerNumbers: [],
        exhibitor2: [],
        addons2: [],
        transactions2: [],
        buyerNumbers2: [],
        exhibitor3: [],
        transactions3: [],
        buyerNumbers3: [],
        buyer: "Buyer"
      }
    },
    created: function() {
      setInterval(() => this.fetchSaleNumber(), this.exhibitorDisplaySpeed)
      this.fetchSaleNumber()
    },
    computed: {
      ...mapState({
        // saleNumber: state => state.saleNumber,
        // transactions: state => state.transactions
      })
    },
    methods: {
      async fetchSaleNumber() {
        let uri = `http://${process.env.HOST_NAME}:8081/display`
        try {
          await this.axios.get(uri).then(response => {
            if (response.data.length >= 1) {
              if (this.maxSaleNumber < response.data[0].saleNumber) this.maxSaleNumber = response.data[0].saleNumber // Updates max sale number to loop through.
            }
          })
        } catch (err) {
          console.log("Waiting for display entry")
          // console.log(err)
        }
         
        if (this.saleNumber < this.maxSaleNumber - 2) {
          this.saleNumber++ 
          this.saleNumber2 = this.saleNumber + 1
          this.saleNumber3 = this.saleNumber2 + 1
        } else if (this.saleNumber == this.maxSaleNumber - 2) {
          this.saleNumber++
          this.saleNumber2 = this.saleNumber + 1
          this.saleNumber3 = 1
         } else if (this.saleNumber == this.maxSaleNumber - 1) {
          this.saleNumber++
          this.saleNumber2 = 1
          this.saleNumber3 = this.saleNumber2 + 1
         } else if (this.maxSaleNumber != 0) {
          this.saleNumber = 1
          this.saleNumber2 = this.saleNumber + 1
          this.saleNumber3 = this.saleNumber2 + 1
        }

        if (this.maxSaleNumber > 0) this.fetchData()
      },
      async fetchData() {
        this.fetchBuyers()
        this.fetchExhibitor()
        this.fetchTransactions()
      },
      async fetchBuyerNumbers() {
        let a = -1 // Buyer element of transactions
        let b = -1 // Buyer element of transactions2
        let c = -1 // Buyer element of transactions3
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Buyer") a = i
        }
        for (let i = 0; i < this.transactions2.length; i++) {
          if (this.transactions2[i].purchaseType == "Buyer") b = i
        }
        for (let i = 0; i < this.transactions3.length; i++) {
          if (this.transactions3[i].purchaseType == "Buyer") c = i
        }
        if (a > -1) this.buyerNumbers = this.transactions[a].bidderNumber.split('-').map(Number)
        else this.buyerNumbers = []
        if (b > -1) this.buyerNumbers2 = this.transactions2[b].bidderNumber.split('-').map(Number)
        else this.buyerNumbers2 = []
        if (c > -1) this.buyerNumbers3 = this.transactions3[c].bidderNumber.split('-').map(Number)
        else this.buyerNumbers3 = []
      },
      async fetchExhibitor() {
        this.exhibitor2 = []
        this.exhibitor3 = []
        // fetches the current exhibitor by its sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber}`
        let url2 = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber2}`
        let url3 = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber3}`
        await this.axios.get(url).then(response => {
          this.exhibitor = response.data
        })
        if ( this.maxSaleNumber > 2) { //this.saleNumber + 1 <= this.maxSaleNumber &&
          await this.axios.get(url2).then(response => {
            this.exhibitor2 = response.data
          })
        }
        if (this.maxSaleNumber > 3) { // this.saleNumber + 2 <= this.maxSaleNumber && 
        await this.axios.get(url3).then(response => {
          this.exhibitor3 = response.data
          })
        }
      },
      async fetchBuyers() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer`
        this.axios.get(uri).then(response => {
          response.data.forEach((buyer) => { this.buyers[buyer.bidderNumber] = buyer })
        })
      },
      async fetchTransactions() {
        let url = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.saleNumber}`
        let url2 = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.saleNumber2}`
        let url3 = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.saleNumber3}`
        this.transactions2 = []
        this.transactions3 = []
        try {
          await this.axios.get(url).then(response => {
            this.transactions = response.data
          })
          if (this.maxSaleNumber > 2) { // this.saleNumber + 1 <= this.maxSaleNumber && 
            await this.axios.get(url2).then(response => {
              this.transactions2 = response.data
            })
          }
          if (this.maxSaleNumber > 3) { // this.saleNumber + 2 <= this.maxSaleNumber && 
            await this.axios.get(url3).then(response => {
              this.transactions3 = response.data
            })
          } 
        } catch (err) {
          console.log("Waiting for transactions to occur")
        }
        this.fetchBuyerNumbers()
      },
      ...mapActions(['setSaleNumber', 'setTransactions'])
    }
  }

</script>


<css>
.exhibitorHistory{
  height:100vh; }

.table_view {
  height: 87%;  }

.history_display_header {
  font-size: 45px;
  color: #339966;
  text-align: center;
  text-transform: uppercase; }

.exhibitor_history_table {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  border: 1px solid #339966;
  color: #404040;
  height: 25%;
  width: 99%; }

.table_c1 {
  color: #339966;
  font-size: 25px;
  width: 5%; }

.sale_number {
  text-align: center; }

.table_tail,
.table_c2,
.table_c3,
.table_c4 {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  width: 25%;
  color: #339966;
  font-size: 25px; }

.exhibitor_table_rows {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  font-size: 40px;  }

.buyer_rows {
  margin: 50px 10px;
  padding: 10px 15px;
  text-align: left;
  font-size: 30px;  }

.purchaseAmount_rows {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  color: #339966;
  font-size: 35px;  }

.processor_rows {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  font-size: 20px;  }

</css>

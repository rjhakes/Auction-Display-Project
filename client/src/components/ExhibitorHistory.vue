<template>
    <main class="exhibitorHistory">
      <h1 class="history_display_header">Exhibitor History</h1>
      <div class="table_view">
      <table class ="exhibitor_history_table">
        <thead>
          <tr>
            <th class="table_c1">Sale #</th>
            <th class="table_c2">Exhibitor Name</th>
            <th class="table_c3">Buyers</th>
            <th class="table_c4">Addons</th>
            <th class="table_c4">Addons</th>
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

            <!-- Addons / Addon purchase -->
            <td>
              <table>
                <tbody>
                  <tr class="addon_rows" v-if="addon.column == 1" v-for="addon in addons" :key="addon._id">
                    <td>{{ addon.name }}</td>
                    <td>${{ addon.purchaseAmount }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Second Addons / Addon purchase column -->
            <td>
              <table>
                <tbody>
                  <tr class="addon_rows" v-if="addon.purchaseType != buyer && addon.column >= 2" v-for="addon in addons" :key="addon._id">
                    <td>{{ addon.name }}</td>
                    <td>${{ addon.purchaseAmount }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr class ="table_tail">
            <td></td>
            <td></td>
            <td v-if="transactions[0] != null && t.purchaseType == buyer" v-for="t in transactions" :key="t._id">Purchase Amount: ${{t.purchaseAmount}}</td>
          </tr>
        </tbody>
      </table>

      <!-- Second Exhibitor View -->
      <table class ="exhibitor_history_table">
        <thead>
          <tr>
            <th class="table_c1">Sale #</th>
            <th class="table_c2">Exhibitor Name</th>
            <th class="table_c3">Buyers</th>
            <th class="table_c4">Addons</th>
            <th class="table_c4">Addons</th>
          </tr>
        </thead>
        <tbody>
          <tr class="exhibitor_table_rows">
            <td class="sale_number">{{this.saleNumber + 1}}</td>
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

            <!-- Addons / Addon purchase -->
            <td>
              <table>
                <tbody>
                  <tr class="addon_rows" v-if="addon.column == 1" v-for="addon in addons2" :key="addon._id">
                    <td>{{ addon.name }}</td>
                    <td>${{ addon.purchaseAmount }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Second Addons / Addon purchase column -->
            <td>
              <table>
                <tbody>
                  <tr class="addon_rows" v-if="addon.purchaseType != buyer && addon.column >= 2" v-for="addon in addons2" :key="addon._id">
                    <td>{{ addon.name }}</td>
                    <td>${{ addon.purchaseAmount }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>

          <tr class ="table_tail">
            <td></td>
            <td></td>
            <td v-if="t.purchaseType == buyer" v-for="t in transactions2" :key="t._id">Purchase Amount: ${{t.purchaseAmount}}</td>
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
        exhibitorDisplaySpeed: 5000, // milliseconds
        saleNumber: -1,
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
          this.saleNumber = this.saleNumber + 2
        } else if (this.saleNumber == this.maxSaleNumber - 2) {
          this.saleNumber++
        } else if (this.maxSaleNumber != 0) {
          this.saleNumber = 1
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
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Buyer") a = i
        }
        for (let i = 0; i < this.transactions2.length; i++) {
          if (this.transactions2[i].purchaseType == "Buyer") b = i
        }
        if (a > -1) this.buyerNumbers = this.transactions[a].bidderNumber.split('-').map(Number)
        if (b > -1) this.buyerNumbers2 = this.transactions2[b].bidderNumber.split('-').map(Number)
        else this.buyerNumbers2 = []
      },
      async fetchExhibitor() {
        this.exhibitor2 = []
        // fetches the current exhibitor by its sale number
        let url = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber}`
        let url2 = `http://${process.env.HOST_NAME}:8081/exhibitor/saleNumber/${this.saleNumber + 1}`
        await this.axios.get(url).then(response => {
          this.exhibitor = response.data
        })
        if (this.saleNumber + 1 <= this.maxSaleNumber && this.maxSaleNumber > 2) {
          await this.axios.get(url2).then(response => {
            this.exhibitor2 = response.data
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
        let url2 = `http://${process.env.HOST_NAME}:8081/transaction/saleNumber/${this.saleNumber + 1}`
        this.transactions2 = []
        try {
          await this.axios.get(url).then(response => {
            this.transactions = response.data
          })
          if (this.saleNumber + 1 <= this.maxSaleNumber && this.maxSaleNumber > 2) {
            await this.axios.get(url2).then(response => {
              this.transactions2 = response.data
            })
          }
        } catch (err) {
          console.log("Waiting for transactions to occur")
        }
        this.fetchAddons()
        this.fetchBuyerNumbers()
      },
      async fetchAddons() {
        this.addons = []
        this.addons2 = []

        let col = 1
        for (let i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].purchaseType == "Addon") {
            col = Math.floor(i / 8 + 1)
            this.addons.push({
            name: this.buyers[this.transactions[i].bidderNumber].name,
            purchaseAmount: this.transactions[i].purchaseAmount,
            column: col
            })
          }
        }

        for (let i = 0; i < this.transactions2.length; i++) {
          if (this.transactions2[i].purchaseType == "Addon") {
            col = Math.floor(i / 8 + 1)
            this.addons2.push({
            name: this.buyers[this.transactions2[i].bidderNumber].name,
            purchaseAmount: this.transactions2[i].purchaseAmount,
            column: col
            })
          }
        }
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
  font-size: 50px;
  color: #339966;
  text-align: center;
  text-transform: uppercase; }

.exhibitor_history_table {
  text-align: left;
  margin: 50px 10px;
  padding: 10px 15px;
  border: 1px solid #339966;
  color: #404040;
  height: 30%;
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
  width: 25%;
  color: #339966;
  font-size: 25px; }

.exhibitor_table_rows {
  font-size: 40px;  }

.buyer_rows {
  font-size: 35px;  }

.addon_rows {
  font-size: 20px;  }

</css>

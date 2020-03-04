<template>
  <div id="manageTransactions">
    <div id="control">
      <h1>Transactions</h1>
      <router-link v-bind:to="{ name: 'NewTransaction' }">
        <button class="transactions__button">Add New Transaction</button>
      </router-link>
      <button class="transactions__button" @click=deleteAll()>Delete All Transactions</button>
      <section class="importExport">
        <button class="transactions__button right" @click=getCsvReport()>Export All Transactions</button>
        <button class="transactions__button right" onclick="document.getElementById('file').click();">Import Transactions</button>
      </section>
      <input type="file" style="display:none;" id="file" name="file" @change="loadCSV($event)">
    </div>
    <table class="manage__table">
      <thead>
        <tr>
          <td @click="sort('saleNumber')" class="clickable"><strong>Sale Number</strong></td>
          <td @click="sort('bidderNumber')" class="clickable"><strong>bidderNumber</strong></td>
          <td @click="sort('purchaseAmount')" class="clickable"><strong>Purchase Amount</strong></td>
          <td @click="sort('purchaseType')" class="clickable"><strong>Purchase Type</strong></td>
          <td><strong>Action</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr class="table__rows" v-for="transaction in sortedTransactions" :key="transaction.saleNumber">
          <td>{{ transaction.saleNumber }}</td>
          <td>{{ transaction.bidderNumber }}</td>
          <td>{{ transaction.purchaseAmount }}</td>
          <td>{{ transaction.purchaseType }}</td>
          <router-link class="clickable" v-bind:to="{ name: 'EditTransaction', params: { id: transaction._id } }"><strong>Edit</strong></router-link> |
          <a class="clickable" id="deleteBtn" @click="deleteTransaction(transaction._id)"><strong>Delete</strong></a>
        </tr>
      </tbody>
    </table>
    <div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'Transaction',
    data() {
      return {
        transactions: [],
        index: 0,
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders: {},
        sortKey: '',
        saleNumber: null,
        bidderNumber: null,
        purchaseAmount: null,
        purchaseType: null,
        currentSort: 'saleNumber',
        currentSortDir: 'asc'
      }
    },

    created: function() {
      this.fetchTransactions()
      this.sort('saleNumber')
    },

    computed: {
      sortedTransactions: function() {
        return this.transactions.slice().sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
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
      async deleteTransaction (id) {
        let uri = `http://${process.env.HOST_NAME}:8081/transaction/` + id
        await this.axios.delete(uri).then((response) => {
          console.log(response)
        })
        this.fetchTransactions()
        this.$router.push({ name: 'Manage' })
    },
    async deleteAll() {
      let uri = `http://${process.env.HOST_NAME}:8081/transaction/`
      var delCheck = confirm("Are you sure you want to delete ALL Transactions?")
      if (delCheck) {
        for (var i = 0; i < this.transactions.length; i++) {
          uri = `http://${process.env.HOST_NAME}:8081/transaction/` + this.transactions[i]._id
					this.axios.delete(uri).then((response) => {
						console.log(response)
					})
				}
				this.transactions = []
	      this.$router.push({ name: 'Manage' })
      }
    },
    async getCsvReport() {
      const jsonUrl = `http://${process.env.HOST_NAME}:8081/transaction/`
      const res = await fetch(jsonUrl)
      const json = await res.json()

      const data = json.map(row => ({
        saleNumber: row.saleNumber,
        bidderNumber: row.bidderNumber,
        purchaseAmount: row.purchaseAmount,
        purchaseType: row.purchaseType
      }))
      const csvData = this.objectToCsv(data)
      this.download(csvData)
    },
    objectToCsv (data) {
      const csvRows = []

      const headers = Object.keys(data[0])
      csvRows.push(headers.join(','))

      for (const row of data) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"')
          return `"${escaped}"`
        })
        csvRows.push(values.join(','))
      };

      return csvRows.join('\n')
    },
    download(data) {
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('hidden', '')
      a.setAttribute('href', url)
      a.setAttribute('download', 'transactionData.csv')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    csvJSON(csv) {
      var vm = this
      var lines = csv.split("\n")
      var result = []
      var headers = lines[0].split(",")
      vm.parse_header = lines[0].split(",")
      lines[0].split(",").forEach(function (key) {
        vm.sortOrders[key] = 1
      })

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return // Jump header line

        var obj = {}
        var currentline = line.split(",")

        headers.map(function(header, indexHeader) {
          obj[header] = currentline[indexHeader].replace(/"/g, '').replace(null, '')
        })

        vm.addTransaction(obj)
        result.push(obj)
      })
      result.pop() // remove the last item because undefined values
      return result // JavaScript object
    },

    //FIXME: ERROR CATCH IS WRITTEN, BUT NOT CATCHING?
    loadCSV(e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result
          vm.parse_csv = vm.csvJSON(csv)
        }
        reader.onerror = function(evt) {
          if (evt.target.error.name == "NotReadableError") {
            alert("Cannot read file !")
          }
        }
      } else {
        alert('FileReader are not supported in this browser.')
      }
    },
    async addTransaction (obj) {
      let newTransaction = {
        saleNumber: obj.saleNumber,
        bidderNumber: obj.bidderNumber,
        purchaseAmount: obj.purchaseAmount,
        purchaseType: obj.purchaseType
      }
      let uri = `http://${process.env.HOST_NAME}:8081/transaction/add`
      await this.axios.post(uri, newTransaction).then((response) => {
        console.log(response)
      })
      this.fetchTransactions()
      this.$router.push({ name: 'Manage' })
    },
    sort: function(s) {
      // if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = s
    }
  }
}
</script>

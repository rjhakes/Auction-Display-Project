<template>
  <div id="manageBuyers">
    <div id="control">
      <h1>Buyers</h1>
      <router-link v-bind:to="{ name: 'NewBuyer' }">
        <button class="manage__button">Add New Buyer</button>
      </router-link>
      <button class="manage__button" @click=deleteAll()>Delete All Buyers</button>
      <section class="importExport">
        <button class="manage__button right" @click=getCsvReport()>Export All Buyers</button>
        <button class="manage__button right" onclick="document.getElementById('file').click();">Import Buyers</button>
      </section>
      <input type="file" style="display:none;" id="file" name="file" @change="loadCSV($event)">
    </div>
    <table class="manage__table">
      <thead>
        <tr>
          <td @click="sort('bidderNumber')" class="clickable"><strong>Bidder Number</strong></td>
          <td @click="sort('name')" class="clickable"><strong>Name</strong></td>
          <td @click="sort('contactName')" class="clickable"><strong>Contact Name</strong></td>
          <td @click="sort('phone')" class="clickable"><strong>Phone</strong></td>
          <td @click="sort('email')" class="clickable"><strong>Email</strong></td>
          <td @click="sort('logoFileName')" class="clickable"><strong>Logo Filename</strong></td>
          <td><strong>Action</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr class="table__rows" v-for="buyer in sortedBuyers" :key="buyer.bidderNumber">
          <td>{{ buyer.bidderNumber }}</td>
          <td>{{ buyer.name }}</td>
          <td>{{ buyer.contactName }}</td>
          <td>{{ buyer.phone }}</td>
          <td>{{ buyer.email }}</td>
          <td>{{ buyer.logoFileName }}</td>
          <router-link class="clickable" v-bind:to="{ name: 'EditBuyer', params: { id: buyer._id } }"><strong>Edit</strong></router-link> |
          <a class="clickable" id="deleteBtn" @click="deleteBuyer(buyer._id)"><strong>Delete</strong></a>
        </tr>
      </tbody>
    </table>
    <div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'Buyer',
    data() {
      return {
        buyers: [],
        index: 0,
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders: {},
        sortKey: '',
        bidderNumber: null,
        name: null,
        contactName: null,
        phone: null,
        email: null,
        logoFileName: null,
        currentSort: 'name',
        currentSortDir: 'asc'
      }
    },

    created: function() {
      this.fetchBuyers()
      this.sort('bidderNumber')
    },

    computed: {
      sortedBuyers: function() {
        return this.buyers.slice().sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
        })
      }
    },

    methods: {
      fetchBuyers() {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer`
        this.axios.get(uri).then(response => {
          this.buyers = response.data
        })
      },
      async deleteBuyer (id) {
        let uri = `http://${process.env.HOST_NAME}:8081/buyer/` + id
        await this.axios.delete(uri).then((response) => {
          console.log(response)
        })
        this.fetchBuyers()
        this.$router.push({ name: 'Manage' })
    },
    async deleteAll() {
      let uri = `http://${process.env.HOST_NAME}:8081/buyer/`
      var delCheck = confirm("Are you sure you want to delete ALL BUYERS?")
      if (delCheck) {
        for (var i = 0; i < this.buyers.length; i++) {
          uri = `http://${process.env.HOST_NAME}:8081/buyer/` + this.buyers[i]._id
					this.axios.delete(uri).then((response) => {
						console.log(response)
					})
				}
				this.buyers = []
	      this.$router.push({ name: 'Manage' })
      }
    },
    async getCsvReport() {
      const jsonUrl = `http://${process.env.HOST_NAME}:8081/buyer/`
      const res = await fetch(jsonUrl)
      const json = await res.json()

      const data = json.map(row => ({
        bidderNumber: row.bidderNumber,
        name: row.name,
        contactName: row.contactName,
        phone: row.phone,
        email: row.email,
        logoFileName: row.logoFileName
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
      a.setAttribute('download', 'buyerData.csv')
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
        var currentline = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

        headers.map(function(header, indexHeader) {
          obj[header] = currentline[indexHeader].replace(/"/g, '').replace(null, '')
        })

        vm.addBuyer(obj)
        result.push(obj)
      })
      result.pop() // remove the last item because undefined values
      return result // JavaScript object
    },
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
    async addBuyer (obj) {
      let newBuyer = {
        bidderNumber: obj.bidderNumber,
        name: obj.name,
        contactName: obj.contactName,
        phone: obj.phone,
        email: obj.email,
        logoFileName: obj.logoFileName
      }
      let uri = `http://${process.env.HOST_NAME}:8081/buyer/add`
      await this.axios.post(uri, newBuyer).then((response) => {
        console.log(response)
      })
      this.fetchBuyers()
      // this.$router.push({ name: 'Manage' })
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

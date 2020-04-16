<template>
  <div id="manageProcessors">
    <div id="control">
      <h1>Processors</h1>
      <router-link v-bind:to="{ name: 'NewProcessor' }">
        <button class="buyers__button">Add New Processor</button>
      </router-link>
      <button class="buyers__button" @click=deleteAll()>Delete All Processors</button>
      <section class="importExport">
        <button class="buyers__button right" @click=getCsvReport()>Export All Processors</button>
        <button class="buyers__button right" onclick="document.getElementById('file').click();">Import Processors</button>
      </section>
      <input type="file" style="display:none;" id="file" name="file" @change="loadCSV($event)">
    </div>
    <table class="manage__table">
      <thead>
        <tr>
          <td @click="sort('processorName')" class="clickable"><strong>Processor Name</strong></td>
          <td><strong>Action</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr class="table__rows" v-for="processor in sortedProcessors" :key="processor.processorName">
          <td>{{ processor.processorName }}</td>
          <router-link class="clickable" v-bind:to="{ name: 'EditProcessor', params: { id: processor._id } }"><strong>Edit</strong></router-link> |
          <a class="clickable" id="deleteBtn" @click="deleteProcessor(processor._id)"><strong>Delete</strong></a>
        </tr>
      </tbody>
    </table>
    <div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'Processor',
    data() {
      return {
        processors: [],
        index: 0,
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders: {},
        sortKey: '',
        processorName: null,
        currentSort: 'name',
        currentSortDir: 'asc'
      }
    },

    created: function() {
      this.fetchProcessors()
      this.sort('processorName')
    },

    computed: {
      sortedProcessors: function() {
        return this.processors.slice().sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
        })
      }
    },

    methods: {
      fetchProcessors() {
        let uri = `http://${process.env.HOST_NAME}:8081/processor`
        this.axios.get(uri).then(response => {
          this.processors = response.data
        })
      },
      async deleteProcessor (id) {
        let uri = `http://${process.env.HOST_NAME}:8081/processor/` + id
        await this.axios.delete(uri).then((response) => {
          console.log(response)
        })
        this.fetchProcessors()
        this.$router.push({ name: 'Manage' })
    },
    async deleteAll() {
      let uri = `http://${process.env.HOST_NAME}:8081/processor/`
      var delCheck = confirm("Are you sure you want to delete ALL PROCESSORS?")
      if (delCheck) {
        for (var i = 0; i < this.processors.length; i++) {
          uri = `http://${process.env.HOST_NAME}:8081/processor/` + this.processors[i]._id
					this.axios.delete(uri).then((response) => {
						console.log(response)
					})
				}
				this.processors = []
	      this.$router.push({ name: 'Manage' })
      }
    },
    async getCsvReport() {
      const jsonUrl = `http://${process.env.HOST_NAME}:8081/processor/`
      const res = await fetch(jsonUrl)
      const json = await res.json()

      const data = json.map(row => ({
        processorName: row.processorName
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

        vm.addProcessor(obj)
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
    async addProcessor (obj) {
      let newProcessor = {
        processorName: obj.processorName,
      }
      let uri = `http://${process.env.HOST_NAME}:8081/processor/add`
      await this.axios.post(uri, newProcessor).then((response) => {
        console.log(response)
      })
      this.fetchProcessors()
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

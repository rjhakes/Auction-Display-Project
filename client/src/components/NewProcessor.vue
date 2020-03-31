<template>
  <main class="form">
    <h1>Add Processor</h1>
      <div v-if="this.isDataReady">
        <label v-if="duplicateProcessorName" class="errorLabel" for="processorName">Error: Duplicate Processor Name. Processor Name must be unique.</label>
        <label v-else class="errorLabel" for="processorName" >{{ errors.first('processorName') }}</label>
        <input v-validate="'required|alpha_spaces'" type=text name=processorName :placeholder="'Processor Name*'" v-model=processorName autocomplete="off">
        <div class="confirmLabelContainer"><label id="confirmLabel"></label></div>
        <button class="processors__button" @click=validate>Add</button>
        <router-link v-bind:to="{ name: 'Manage', params: {view: false, view2: false, view3: true} }">
          <button class="processors__button">Return to Manage</button>
        </router-link>
        <p>* Indicates required field.</p>
      </div>
  </main>
</template>

<!--<script>

export default {
  name: 'NewProcessor',
  data () {
    return {
      processorName: null,
      processors: [],
      isDataReady: false
    }
  },


  created () {
    this.fetchprocessors()
    // this.getNextAvailableprocessorName()
  },

  computed: {
    duplicateprocessorName () {
      return this.processors.some(processor => {
        if (this.processorName == processor.processorName) return true
      })
    },
    /* nextAvailableprocessorName () {
      var existingprocessorNames = []
      var processor

      this.fetchprocessors()
      if (this.processors.length == 0) return 1

      for (processor of this.processors) {
        existingprocessorNames.push(processor.processorName)
      }

      var max = parseInt(Math.max(...existingprocessorNames))
      return max + 1
    }*/ 
  },

  methods: {
    fetchprocessors() {
      let uri = `http://${process.env.HOST_NAME}:8081/processor`
      this.axios.get(uri).then(response => {
        this.processors = response.data
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateprocessorName) {
        this.confirmAdd()
        this.addprocessor()
        this.resetprocessor()
      }
    },
    async addprocessor () {
      let newprocessor = {
        processorName: this.processorName,
      }
      let uri = `http://${process.env.HOST_NAME}:8081/processor/add`
      this.axios.post(uri, newprocessor).then((response) => {
        console.log(response)
        if (response.status == 200) {
          this.$validator.errors.clear()
          this.confirmAdd('success')
        } else {
          this.confirmAdd('fail')
        }
      })
    },
    /* getNextAvailableprocessorName () {
      var existingprocessorNames = []
      var processor

      this.fetchprocessors()

      if (this.processors.length == 0) {
        this.isDataReady = true
        return 1
      }

      for (processor of this.processors) {
        existingprocessorNames.push(processor.processorName)
      }
      if (this.processorName != null) {
        existingprocessorNames.push(parseInt(this.processorName))
      }
      this.isDataReady = true

      var max = parseInt(Math.max(...existingprocessorNames))
      return max + 1
    }, */ 
    resetprocessor () {
      this.processorName = '' // this.getNextAvailableprocessorName()
    },
    /* addDashes()
    {
      this.phone.value = this.phone.value.replace(/\D/g, '')
      this.phone.value = this.phone.value.slice(0, 3) + "-" + this.phone.value.slice(3, 6) + "-" + this.phone.value.slice(6, 15)
    }, */
    confirmAdd(sts) {
      if (sts == 'success') {
        document.getElementById("confirmLabel").innerText = "Added successfully!"
      } else if (sts == 'fail') {
        document.getElementById("confirmLabel").innerText = "Processor not added"
      } else {
        document.getElementById("confirmLabel").innerText = ''
      }
    }
  }
}
</script>-->

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'NewProcessor',
  data () {
    return {
      processorName: '',
      processors: [],
      isDataReady: false
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created () {
    this.fetchprocessors()
    this.getNextAvailableProcessorName()
  },

  computed: {
    duplicateProcessorName () {
      return this.processors.some(processor => {
        if (this.processorName == processor.processorName) return true
      })
    },
    nextAvailableProcessorName () {
      var existingProcessorNames = []
      var processor

      this.fetchprocessors()
      if (this.processors.length == 0) return 1

      for (processor of this.processors) {
        existingProcessorNames.push(processor.processorName)
      }

      var max = parseInt(Math.max(...existingProcessorNames))
      return max + 1
    }
  },

  methods: {
    fetchprocessors() {
      let uri = `http://${process.env.HOST_NAME}:8081/processor`
      this.axios.get(uri).then(response => {
        this.processors = response.data
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateProcessorName) {
        // this.confirmAdd()
        this.addprocessor()
        this.resetprocessor()
      }
    },
    async addprocessor () {
      let newprocessor = {
        processor: this.processorName
      }
      let uri = `http://${process.env.HOST_NAME}:8081/processor/add`
      this.axios.post(uri, newprocessor).then((response) => {
        console.log(response)
        if (response.status == 200) {
          this.$validator.errors.clear()
          this.confirmAdd('success')
        } else {
          this.confirmAdd('fail')
        }
      })
    },
    getNextAvailableProcessorName () {
      var existingProcessorNames = []
      var processor

      this.fetchprocessors()

      if (this.processors.length == 0) {
        this.isDataReady = true
        return 1
      }

      for (processor of this.processors) {
        existingProcessorNames.push(processor.processorName)
      }
      if (this.processorName != null) {
        existingProcessorNames.push(parseInt(this.processorName))
      }
      this.isDataReady = true

      var max = parseInt(Math.max(...existingProcessorNames))
      return max + 1
    },
    resetprocessor () {
      this.processor = ''
    },
    confirmAdd(sts) {
      if (sts == 'success') {
        document.getElementById("confirmLabel").innerText = "Added successfully!"
      } else if (sts == 'fail') {
        document.getElementById("confirmLabel").innerText = "processor not added"
      } else {
        document.getElementById("confirmLabel").innerText = ''
      }
    }
  }
}
</script>


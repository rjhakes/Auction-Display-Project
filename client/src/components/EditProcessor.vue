<!--COMPONENT NOT USED; REMOVE FILE AND MENTION OF IT FROM OTHER FILES-->

<template>
  <div class="form">
    <h1>Edit Buyer: {{ name }}</h1>
      <div>
        <label v-if="duplicateProcessorName" class="errorLabel" for="processorName">Error: Duplicate Processor Name. Processor Name must be unique.</label>
        <label v-else class="errorLabel" for="processorName" >{{ errors.first('processorName') }}</label>
        <input v-validate="'required|alpha_spaces'" type=text name=processorName placeholder="Processor Name" v-model=processorName>
        <!--<label class="errorLabel" for="name" >{{ errors.first('name') }}</label>
        <input v-validate="'required'" type=text name=name placeholder="Name" v-model=name>
        <label class="errorLabel" for="contactName" >{{ errors.first('contactName') }}</label>
        <input v-validate="'required|alpha_spaces'" type=text name=contactName placeholder="Contact Name" v-model=contactName>
        <label class="errorLabel" for="phone" >{{ errors.first('phone') }}</label>
        <cleave v-validate="'required|digits:10'" v-model="phone" :options="options" name="phone" placeholder="Phone (555-555-5555)"></cleave>
        <label class="errorLabel" for="email" >{{ errors.first('email') }}</label>
        <input v-validate="'email'" data-vv-as="email" type=text name=email placeholder="Email" v-model=email>
        <label class="errorLabel" for="logoFileName" >{{ errors.first('logoFileName') }}</label>
        <input v-validate="''" type=text name=logoFileName placeholder="Logo Filename" v-model=logoFileName>-->
        <button class="manage__button" @click=validate>Update</button>
        <router-link v-bind:to="{ name: 'Manage', params: { view: false, view2: false, view3: true } }">
          <button class="manage__button">Cancel</button>
        </router-link>
      </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'EditProcessor',
  data () {
    return {
      processorName: '',
      processors: [],
      originalProcessorName: ''
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created: function() {
    this.fetchProcessors()
  },

  mounted () {
    this.getProcessor()
  },

  computed: {
    duplicateProcessorName () {
      return this.processors.some(processor => {
        if (this.processorName == processor.processorName && this.originalProcessorName != this.processorName) return true
      })
    }
  },

  methods: {
    fetchBuyers() {
      let uri = `http://${process.env.HOST_NAME}:8081/processor`
      this.axios.get(uri).then(response => {
        this.processors = response.data
      })
    },
    async getBuyer () {
      let uri = `http://${process.env.HOST_NAME}:8081/processor/` + this.$route.params.id
      await this.axios.get(uri).then(response => {
      this.processorName = response.data.processorName
      this.originalProcessorName = response.data.processorName
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateProcessorName) {
        this.updatePost()
      }
    },
    async updatePost () {
      let updatedProcessor = {
        id: this.$route.params.id,
        processorName: this.processorName,
      }
      let uri = `http://${process.env.HOST_NAME}:8081/processor/` + this.$route.params.id
      await this.axios.put(uri, updatedProcessor).then((response) => {
        console.log(response)
      })
      this.$router.push({ name: 'Manage', params: { view: false, view2: false, view3: true } })
    }
  }
}
</script>

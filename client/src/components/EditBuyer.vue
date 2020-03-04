<template>
  <div class="form">
    <h1>Edit Buyer: {{ name }}</h1>
      <div>
        <label v-if="duplicateBidderNumber" class="errorLabel" for="bidderNumber">Error: Duplicate Bidder Number. Bidder Number must be unique.</label>
        <label v-else class="errorLabel" for="bidderNumber" >{{ errors.first('bidderNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=bidderNumber placeholder="Bidder Number" v-model=bidderNumber>
        <label class="errorLabel" for="name" >{{ errors.first('name') }}</label>
        <input v-validate="'required'" type=text name=name placeholder="Name" v-model=name>
        <!--<label class="errorLabel" for="contactName" >{{ errors.first('contactName') }}</label>-->
        <input v-validate="'required|alpha_spaces'" type=text name=contactName placeholder="Contact Name" v-model=contactName>
        <label class="errorLabel" for="phone" >{{ errors.first('phone') }}</label>
        <cleave v-validate="'required|digits:10'" v-model="phone" :options="options" name="phone" placeholder="Phone (555-555-5555)"></cleave>
        <!--<label class="errorLabel" for="email" >{{ errors.first('email') }}</label>-->
        <input v-validate="'email'" data-vv-as="email" type=text name=email placeholder="Email" v-model=email>
        <!--<label class="errorLabel" for="logoFileName" >{{ errors.first('logoFileName') }}</label>-->
        <input v-validate="''" type=text name=logoFileName placeholder="Logo Filename" v-model=logoFileName>
        <button class="manage__button" @click=validate>Update</button>
        <router-link v-bind:to="{ name: 'Manage', params: { view: false } }">
          <button class="manage__button">Cancel</button>
        </router-link>
      </div>
  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'EditBuyer',
  data () {
    return {
      bidderNumber: '',
      name: '',
      contactName: '',
      phone: '',
      options: {
        phone: true,
        delimiter: '-',
        phoneRegionCode: 'US'
      },
      email: '',
      logoFileName: '',
      buyers: [],
      originalBidderNumber: ''
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created: function() {
    this.fetchBuyers()
  },

  mounted () {
    this.getBuyer()
  },

  computed: {
    duplicateBidderNumber () {
      return this.buyers.some(buyer => {
        if (this.bidderNumber == buyer.bidderNumber && this.originalBidderNumber != this.bidderNumber) return true
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
    async getBuyer () {
      let uri = `http://${process.env.HOST_NAME}:8081/buyer/` + this.$route.params.id
      await this.axios.get(uri).then(response => {
      this.bidderNumber = response.data.bidderNumber
      this.originalBidderNumber = response.data.bidderNumber
      this.name = response.data.name
      this.contactName = response.data.contactName
      this.phone = response.data.phone
      this.email = response.data.email
      this.logoFileName = response.data.logoFileName
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateBidderNumber) {
        this.updatePost()
      }
    },
    async updatePost () {
      let updatedBuyer = {
        id: this.$route.params.id,
        bidderNumber: this.bidderNumber,
        name: this.name,
        contactName: this.contactName,
        phone: this.phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
        email: this.email,
        logoFileName: this.logoFileName
      }
      let uri = `http://${process.env.HOST_NAME}:8081/buyer/` + this.$route.params.id
      await this.axios.put(uri, updatedBuyer).then((response) => {
        console.log(response)
      })
      this.$router.push({ name: 'Manage', params: { view: false } })
    }
  }
}
</script>

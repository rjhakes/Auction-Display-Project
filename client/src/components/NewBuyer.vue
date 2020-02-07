<template>
  <main class="form">
    <h1>Add Buyer</h1>
      <div v-if="this.isDataReady">
        <label v-if="duplicateBidderNumber" class="errorLabel" for="bidderNumber">Error: Duplicate Bidder Number. Bidder Number must be unique.</label>
        <label v-else class="errorLabel" for="bidderNumber" >{{ errors.first('bidderNumber') }}</label>
        <input v-validate="'required|numeric'" type=text name=bidderNumber :placeholder="'Bidder Number* (next available: ' + nextAvailableBidderNumber + ')'" v-model=bidderNumber autocomplete="off">
        <label class="errorLabel" for="name" >{{ errors.first('name') }}</label>
        <input v-validate="'required'" type=text name=name placeholder="Name*" v-model=name autocomplete="off">
        <label class="errorLabel" for="phone" >{{ errors.first('phone') }}</label>
        <cleave v-validate="'required|digits:10'" v-model="phone" :options="options" name="phone" placeholder="Phone* (555-555-5555)"></cleave>
        <label class="errorLabel" for="contactName" >{{ errors.first('contactName') }}</label>
        <input v-validate="'alpha_spaces'" type=text name=contactName placeholder="Contact Name" v-model=contactName autocomplete="off">
        <label class="errorLabel" for="email" >{{ errors.first('email') }}</label>
        <input v-validate="'email'" data-vv-as="email" type=text name=email placeholder="Email" v-model=email autocomplete="off">
        <label class="errorLabel" for="logoFileName" >{{ errors.first('logoFileName') }}</label>
        <input v-validate="''" type=text name=logoFileName placeholder="Logo Filename" v-model=logoFileName autocomplete="off">
        <div class="confirmLabelContainer"><label id="confirmLabel"></label></div>
        <button class="manage__button" @click=validate>Add</button>
        <router-link v-bind:to="{ name: 'Manage', params: {view: false} }">
          <button class="manage__button">Return to Manage</button>
        </router-link>
        <p>* Indicates required field.</p>
      </div>
  </main>
</template>

<script>
import Cleave from 'vue-cleave-component'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
export default {
  name: 'NewBuyer',
  data () {
    return {
      bidderNumber: null,
      name: null,
      contactName: null,
      phone: null,
      options: {
        phone: true,
        delimiter: '-',
        phoneRegionCode: 'US'
      },
      email: null,
      logoFileName: null,
      buyers: [],
      isDataReady: false
    }
  },

  components: {
    Cleave,
    CleavePhone
  },

  created () {
    this.fetchBuyers()
    this.getNextAvailableBidderNumber()
  },

  computed: {
    duplicateBidderNumber () {
      return this.buyers.some(buyer => {
        if (this.bidderNumber == buyer.bidderNumber) return true
      })
    },
    nextAvailableBidderNumber () {
      var existingBidderNumbers = []
      var buyer

      this.fetchBuyers()
      if (this.buyers.length == 0) return 1

      for (buyer of this.buyers) {
        existingBidderNumbers.push(buyer.bidderNumber)
      }

      var max = parseInt(Math.max(...existingBidderNumbers))
      return max + 1
    }
  },

  methods: {
    fetchBuyers() {
      let uri = `http://${process.env.HOST_NAME}:8081/buyer`
      this.axios.get(uri).then(response => {
        this.buyers = response.data
      })
    },
    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateBidderNumber) {
        this.confirmAdd()
        this.addBuyer()
        this.resetBuyer()
      }
    },
    async addBuyer () {
      let newBuyer = {
        bidderNumber: this.bidderNumber,
        name: this.name,
        contactName: this.contactName,
        phone: this.phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
        email: this.email,
        logoFileName: this.logoFileName
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
    },
    getNextAvailableBidderNumber () {
      var existingBidderNumbers = []
      var buyer

      this.fetchBuyers()

      if (this.buyers.length == 0) {
        this.isDataReady = true
        return 1
      }

      for (buyer of this.buyers) {
        existingBidderNumbers.push(buyer.bidderNumber)
      }
      if (this.bidderNumber != null) {
        existingBidderNumbers.push(parseInt(this.bidderNumber))
      }
      this.isDataReady = true

      var max = parseInt(Math.max(...existingBidderNumbers))
      return max + 1
    },
    resetBuyer () {
      this.bidderNumber = this.getNextAvailableBidderNumber()
      this.name = ''
      this.contactName = ''
      this.phone = ''
      this.email = ''
      this.logoFileName = ''
    },
    addDashes()
    {
      this.phone.value = this.phone.value.replace(/\D/g, '')
      this.phone.value = this.phone.value.slice(0, 3) + "-" + this.phone.value.slice(3, 6) + "-" + this.phone.value.slice(6, 15)
    },
    confirmAdd(sts) {
      if (sts == 'success') {
        document.getElementById("confirmLabel").innerText = "Added successfully!"
      } else if (sts == 'fail') {
        document.getElementById("confirmLabel").innerText = "Exhibitor not added"
      } else {
        document.getElementById("confirmLabel").innerText = ''
      }
    }
  }
}
</script>

<template>
  <main class="form">
    <h1>Add Exhibitor</h1>
    <div v-if="this.isDataReady">
      <label v-if="duplicateSaleNumber" class="errorLabel" for="saleNumber">Error: Duplicate Sale Number. Sale Number must be unique.</label>
      <label v-else class="errorLabel" for="saleNumber" >{{ errors.first('saleNumber') }}</label>
      <input v-validate="'required|numeric'" type="text" name="saleNumber" :placeholder="'Sale Number* (next available: ' + nextAvailableSaleNumber + ')'" v-model="saleNumber" autocomplete="off">
      <label class="errorLabel" for="fullName" >{{ errors.first('fullName') }}</label>
      <input v-validate="'required|alpha_spaces'" type="text" name="fullName" placeholder="Full Name*" v-model=fullName autocomplete="off">
      <label class="errorLabel" for="species" >{{ errors.first('species') }}</label>
      <input v-validate="'required|alpha_spaces'" type="text" name="species" placeholder="Species*" v-model="species" autocomplete="off">
      <label class="errorLabel" for="checkInWeight" >{{ errors.first('checkInWeight') }}</label>
      <input v-validate="'required|decimal'" type="text" name="checkInWeight" placeholder="Check-In Weight*" v-model=checkInWeight autocomplete="off">
      <label class="errorLabel" for="tag" >{{ errors.first('tag') }}</label>
      <input v-validate="''" type="text" name="tag" placeholder="Tag" v-model="tag" autocomplete="off">
      <label class="errorLabel" for="animalDescription" >{{ errors.first('animalDescription') }}</label>
      <input v-validate="''" type="text" name="animalDescription" placeholder="Animal Description" v-model="animalDescription" autocomplete="off">
      <label class="errorLabel" for="clubName" >{{ errors.first('clubName') }}</label>
      <input v-validate="''" type="text" name="clubName" placeholder="Club Name" v-model=clubName autocomplete="off">
      <label class="errorLabel" for="showClassName" >{{ errors.first('showClassName') }}</label>
      <input v-validate="'alpha_spaces'" type="text" name="showClassName" placeholder="Show Class Name" v-model="showClassName" autocomplete="off">
      <label class="errorLabel" for="placing" >{{ errors.first('placing') }}</label>
      <input v-validate="''" type="text" name="placing" placeholder="Placing" v-model=placing autocomplete="off">
      <label class="errorLabel" for="buyback" >{{ errors.first('buyback') }}</label>
      <input v-validate="'numeric'" type="text" name="buyback" placeholder="Buyback" v-model=buyback autocomplete="off">
      <div class="confirmLabelContainer"><label id="confirmLabel"></label></div>
      <button class="manage__button" @click=validate>Add</button>
      <router-link v-bind:to="{ name: 'Manage', params: {view: true } }">
        <button class="manage__button">Return to Manage</button>
      </router-link>
      <p>* Indicates required field.</p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NewExhibitor',
  data () {
    return {
      saleNumber: null,
      fullName: null,
      tag: null,
      species: null,
      animalDescription: null,
      checkInWeight: null,
      clubName: null,
      showClassName: null,
      placing: null,
      buyback: null,
      exhibitors: [],
      isDataReady: false
    }
  },

  created () {
      this.fetchExhibitors()
      this.getNextAvailableSaleNumber()
  },

  computed: {
    duplicateSaleNumber () {
      return this.exhibitors.some(exhibitor => {
        if (this.saleNumber == exhibitor.saleNumber) return true
      })
    },
    nextAvailableSaleNumber () {
      var existingSaleNumbers = []
      var exhibitor

      this.fetchExhibitors()
      if (this.exhibitors.length == 0) return 1

      for (exhibitor of this.exhibitors) {
        existingSaleNumbers.push(exhibitor.saleNumber)
      }

      var max = parseInt(Math.max(...existingSaleNumbers))
      return max + 1
    }
  },

  methods: {
    fetchExhibitors() {
      let uri = `http://${process.env.HOST_NAME}:8081/exhibitor`
      this.axios.get(uri).then(response => {
        this.exhibitors = response.data
        })
    },
    async validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateSaleNumber) {
        this.confirmAdd()
        await this.addExhibitor()
          .then(() => { this.resetExhibitor() })
          .catch(err => {
            let newExhibitor = {
              saleNumber: this.saleNumber,
              fullName: this.fullName,
              tag: this.tag,
              species: this.species,
              animalDescription: this.animalDescription,
              checkInWeight: this.checkInWeight,
              clubName: this.clubName,
              showClassName: this.showClassName,
              placing: this.placing,
              buyback: this.buyback
            }
            window.alert(err + "\n" + newExhibitor)
          })
      }
    },
    async addExhibitor () {
      let newExhibitor = {
        saleNumber: this.saleNumber,
        fullName: this.fullName,
        tag: this.tag,
        species: this.species,
        animalDescription: this.animalDescription,
        checkInWeight: this.checkInWeight,
        clubName: this.clubName,
        showClassName: this.showClassName,
        placing: this.placing,
        buyback: this.buyback
      }
      let uri = `http://${process.env.HOST_NAME}:8081/exhibitor/add`
      this.axios.post(uri, newExhibitor).then((response) => {
        console.log(response)
        if (response.status == 200) {
          this.$validator.errors.clear()
          this.confirmAdd('success')
        } else {
          this.confirmAdd('fail')
        }
      })
    },
    getNextAvailableSaleNumber () {
      var existingSaleNumbers = []
      var exhibitor

      this.fetchExhibitors()

      if (this.exhibitors.length == 0) {
        this.isDataReady = true
        return 1
      }

      for (exhibitor of this.exhibitors) {
        existingSaleNumbers.push(exhibitor.saleNumber)
      }
      if (this.saleNumber != null) {
        existingSaleNumbers.push(parseInt(this.saleNumber))
      }
      this.isDataReady = true

      var max = parseInt(Math.max(...existingSaleNumbers))
      return max + 1
    },
    resetExhibitor () {
      this.saleNumber = this.getNextAvailableSaleNumber()
      this.fullName = ''
      this.tag = ''
      this.species = ''
      this.animalDescription = ''
      this.checkInWeight = ''
      this.clubName = ''
      this.showClassName = ''
      this.placing = ''
      this.buyback = ''
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

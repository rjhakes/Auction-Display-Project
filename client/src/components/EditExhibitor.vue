<template>
  <div class="form">
    <h1>Edit Exhibitor: {{ fullName }}</h1>
    <div>
      <label v-if="duplicateSaleNumber" class="errorLabel" for="saleNumber">Error: Duplicate Sale Number. Sale Number must be unique.</label>
      <label v-else class="errorLabel" for="saleNumber" >{{ errors.first('saleNumber') }}</label>
      <input v-validate="'required|numeric'" type="text" name="saleNumber" placeholder="Sale Number" v-model="saleNumber">
      <label class="errorLabel" for="fullName" >{{ errors.first('fullName') }}</label> 
      <input v-validate="'required|alpha_spaces'" type="text" name="fullName" placeholder="Full Name" v-model=fullName>
      <label class="errorLabel" for="tag" >{{ errors.first('tag') }}</label>
      <input v-validate="'required'" type="text" name="tag" placeholder="Tag" v-model="tag">
      <label class="errorLabel" for="species" >{{ errors.first('species') }}</label>
      <input v-validate="'required|alpha'" type="text" name="species" placeholder="Species" v-model="species">
      <label class="errorLabel" for="checkInWeight" >{{ errors.first('checkInWeight') }}</label>
      <input v-validate="'required|decimal'" type="text" name="checkInWeight" placeholder="Check-In Weight" v-model=checkInWeight>
      <label class="errorLabel" for="animalDescription" >{{ errors.first('animalDescription') }}</label>
      <input v-validate="''" type="text" name="animalDescription" placeholder="Animal Description" v-model="animalDescription">
      <label class="errorLabel" for="clubName" >{{ errors.first('clubName') }}</label>
      <input v-validate="''" type="text" name="clubName" placeholder="Club Name" v-model=clubName>
      <label class="errorLabel" for="showClassName" >{{ errors.first('showClassName') }}</label>
      <input v-validate="'alpha_spaces'" type="text" name="showClassName" placeholder="Show Class Name" v-model="showClassName">
      <label class="errorLabel" for="placing" >{{ errors.first('placing') }}</label>
      <input v-validate="''" type="text" name="placing" placeholder="Placing" v-model=placing>
      <label class="errorLabel" for="buyback" >{{ errors.first('buyback') }}</label>
      <input v-validate="'numeric'" type="text" name="buyback" placeholder="Buyback" v-model=buyback>
      <button class="manage__button" @click=validate>Update</button>
      <router-link v-bind:to="{ name: 'Manage', params: { view: true } }">
        <button class="manage__button">Cancel</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditExhibitor',
  data () {
    return {
    saleNumber: '',
    fullName: '',
    tag: '',
    species: '',
    animalDescription: '',
    checkInWeight: '',
    clubName: '',
    showClassName: '',
    placing: '',
    buyback: '',
    exhibitors: [],
    originalSaleNum: ''
    }
  },

  created: function() {
    this.fetchExhibitors()
  },

  mounted () {
    this.getExhibitor()
  },

  computed: {
    duplicateSaleNumber () {
      return this.exhibitors.some(exhibitor => {
        if (this.saleNumber == exhibitor.saleNumber && this.originalSaleNum != this.saleNumber) return true
      })
    }
  },

  methods: {
    fetchExhibitors() {
      let uri = `http://${process.env.HOST_NAME}:8081/exhibitor`
      this.axios.get(uri).then(response => {
        this.exhibitors = response.data
        })
    },

    async getExhibitor () {
      let uri = `http://${process.env.HOST_NAME}:8081/exhibitor/` + this.$route.params.id
      await this.axios.get(uri).then(response => {
        this.saleNumber = response.data.saleNumber
        this.originalSaleNum = response.data.saleNumber
        this.fullName = response.data.fullName
        this.tag = response.data.tag
        this.species = response.data.species
        this.animalDescription = response.data.animalDescription
        this.checkInWeight = response.data.checkInWeight
        this.clubName = response.data.clubName
        this.showClassName = response.data.showClassName
        this.placing = response.data.placing
        this.buyback = response.data.buyback
      })
    },

    validate () {
      this.$validator.validateAll()
      if (!this.errors.any() && !this.duplicateSaleNumber) {
        this.updatePost()
      }
    },

    async updatePost () {
      let updatedExhibitor = {
        id: this.$route.params.id,
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
      let uri = `http://${process.env.HOST_NAME}:8081/exhibitor/` + this.$route.params.id
      await this.axios.put(uri, updatedExhibitor).then((response) => {
        console.log(response)
      })
      this.$router.push({ name: 'Manage', params: { view: true } })
    }
  }
}
</script>


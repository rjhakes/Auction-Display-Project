<template>
  <main class="manage">
    <nav>
      <h1>Manage Data</h1>
      <router-link v-bind:to="{ name: 'Admin' }">
        <button class="dashboard-button">Return to Dashboard</button>
      </router-link>
      <button class="exhibitors__button" @click='view=true'>View Exhibitors</button>
      <button class="buyers__button" @click='view=false'>View Buyers</button>
    </nav>
    <template v-if="view">
      <manageExhibitors></manageExhibitors>
    </template>
    <template v-else>
      <manageBuyers></manageBuyers>
    </template>
  </main>
</template>

<script>
import ManageExhibitors from './ManageExhibitors.vue'
import ManageBuyers from './ManageBuyers.vue'

export default {
  name: 'btn',
  data() {
    return {
      // view: true
      view: true,  // this.$route.params.view,
      //btnDisalbed: true
    }
  },
  methods: {
    toggleDisplayType() {
      this.$route.params.view = !this.$route.params.view
    }
  },
  components: {
    'manageExhibitors': ManageExhibitors,
    'manageBuyers': ManageBuyers
  }
}
</script>

<template>
  <main class="manage">
    <nav>
      <h1>Manage Data</h1>
      <router-link v-bind:to="{ name: 'Admin' }">
        <button class="dashboard-button">Return to Dashboard</button>
      </router-link>
      <button class="exhibitors__button" @click='view=true, view2=false, view3=false'>View Exhibitors</button>
      <button class="buyers__button" @click='view=false, view2=false, view3=false'>View Buyers</button>
      <button class="transactions__button" @click='view=false, view2=true, view3=false'>View Transactions</button>
    </nav>
    <template v-if="view2">
      <manageTransactions></manageTransactions>
    </template>
    <template v-else-if="view">
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
import ManageTransactions from './ManageTransactions.vue'

export default {
  name: 'Manage',
  data() {
    return {
      // view: true
      view: true,  // this.$route.params.view,
      view2: false,
      view3: false
      //btnDisalbed: true
    }
  },
  methods: {
    //toggleDisplayType() {
      //this.$route.params.view = !this.$route.params.view
    //}
  },
  components: {
    'manageExhibitors': ManageExhibitors,
    'manageBuyers': ManageBuyers,
    'manageTransactions': ManageTransactions,
  }
}
</script>

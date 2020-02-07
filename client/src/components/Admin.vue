<template>
 <main class="admin">
  <img class="logo" src="../assets/4H_Logo.png">
  <img class='logo' src='../assets/FFA_Logo.png'>
  <h1>Admin Dashboard</h1>
  <router-link v-bind:to="{ name: 'Manage', params: { view: true } }"><button class="admin-button">Manage Data</button></router-link>
  <router-link to="/display"><button class="admin-button">Current/Previous Sale Display</button></router-link>
  <router-link to="/exhibitor/history"><button class="admin-button">Exhibitor History Display</button></router-link>
  <router-link to="/transaction/gui"><button class="admin-button">GUI Transaction</button></router-link>
  <router-link to="/transaction/addon"><button class="admin-button">Addon Transaction Table</button></router-link>
  <router-link to="/admin" class-active="active" v-on:click.native="logout()" replace><button class="admin-button-logout">Logout</button></router-link>
  <router-view />
 </main>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {}
  },
  methods: {
    logout() {
      var retVal = confirm("Are you sure you want to logout?")
      if (retVal) {
        this.$store.commit('IS_AUTHENTICATED', false)
        this.$router.replace({ name: 'Login' })
      } else {
        this.$store.commit('IS_AUTHENTICATED', true)
      }
    }
  }
}
</script>

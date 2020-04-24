<template>
  <div id='app'>
    <div id='nav'>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      users: []
    }
  },

  created: function() {
      this.fetchUsers()
  },

  mounted() {
    if (!this.$store.state.isAuthenticated) {
      this.$router.replace({ name: 'Admin' })
    }
  },

  methods: {
    fetchUsers() {
        let uri = `http://${process.env.HOST_NAME}:8081/user`
        this.axios.get(uri).then(response => {
          this.users = response.data
        })
    },
    getUserByName(name) {
      // users is array of objects, this mapping searches for index of object with matching username
      var index = this.users.map(function(e) { return e.username.toLowerCase() }).indexOf(name.toLowerCase())
      return this.users[index]
    }
  }
}
</script>

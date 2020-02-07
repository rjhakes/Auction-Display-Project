<template>
  <main class="login">
    <img class='logo' src='../assets/4H_Logo.png'>
    <img class='logo' src='../assets/FFA_Logo.png'>
    <h1>Admin Login</h1>
    <form>
      <div class="login-input">
        <input type="text" name="username" v-model="input.username" placeholder="Username" @keyup.enter="login()">
      </div>
      <input type="password" name="password" v-model="input.password" placeholder="Password" @keyup.enter="login()">
      <button class="form__button" type="button" name="login" v-on:click="login()">Login</button>
      <p class='errorMsg' id="hidden"></p>
    </form>
  </main>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    }
  },
  beforeCreate() {
    this.$store.commit('IS_AUTHENTICATED', false)
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        var user = this.$parent.getUserByName(this.input.username)
        if (typeof user !== "undefined" && this.input.username.toLowerCase() == user.username.toLowerCase() && this.input.password == user.password) {
          this.$store.commit('IS_AUTHENTICATED', true)
          this.$router.replace({ name: "Admin" })
        } else {
          console.log("Username or password is incorrect")
          document.getElementById("hidden").innerHTML = "Username or password is incorrect"
        }
      } else {
        console.log("Username and password are required")
        document.getElementById("hidden").innerHTML = "Username and password are required"
      }
    }
  }
}
</script>

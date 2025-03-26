
<template>
<v-app>
  <v-app-bar>
    <v-toolbar-title>Home Panel</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="loggedIn" @click="logout" color="primary" variant="outlined" class="mr-4">Logout</v-btn>
  </v-app-bar>
  <v-main>
    <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="700" class="pt-4">
      <v-card-title>Hello</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" class="mb-2" dense>{{ error }}</v-alert>
        <v-form @submit.prevent="login">
          <v-text-field 
              label="Password" 
              v-model="password" 
              type="password" 
              outlined 
              dense
              class="mb-3"
          ></v-text-field>
          <v-btn color="primary" block class="mb-2" type="submit">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  </v-main>
</v-app>
</template>

<script>

import { useStore } from "@/stores/api"

export default {
  setup() {
    const store = useStore()
    store.init()
    return { store }
  },
  data() {
    return {
      password: ""
    }
  },
  computed: {
    loggedIn() { return this.store.authorized },
    error() { return this.store.apiError }
  },
  methods: {
    async login() {
      //TODO validate password
      await this.store.login(this.password)
      this.password = ""
    },
    async logout() {
      await this.store.logout()
    }
  },
  watch: {
    loggedIn(to) {
      if (to) this.store.update()
    }
  }
}

</script>

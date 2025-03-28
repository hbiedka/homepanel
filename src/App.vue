
<template>
<v-app>
  <v-app-bar>
    <v-toolbar-title>Home Panel</v-toolbar-title>
    <v-spacer></v-spacer>
    <p v-if="username" class="mr-4">Hello, {{ username }}</p>
    <v-btn v-if="loggedIn" @click="logout" color="primary" variant="outlined" class="mr-4" size="small">Logout</v-btn>
  </v-app-bar>
  <v-main>
    <v-container class="fill-height d-flex justify-center align-center" max-width="1200">
      <v-row v-if="loggedIn">
        <v-col cols="12" md="6" lg="4">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" size="small">mdi-lightbulb</v-icon>          
              <p style="font-size:smaller;">
                Exterior lights
              </p>
              <v-spacer></v-spacer>
              <p style="background-color: #1B5E20; border-radius: 5px; font-size:smaller;" class="px-2 py-0">ON</p>
            </v-card-title>
            <v-card-text class="mt-2">
              <v-btn elevated color="primary" class="ma-2">Turn on for 10 min</v-btn>
              <v-btn elevated class="ma-2">Turn off</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" size="small">mdi-server</v-icon>
              <p style="font-size:smaller;">
                Server room
              </p>
              <v-spacer></v-spacer>
              <v-switch inset hide-details></v-switch>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" size="small">mdi-thermometer</v-icon>
              <p style="font-size:smaller">Temp. downstairs</p>
              <v-spacer></v-spacer>
              22.3 °C
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-card v-else width="700" class="pt-4">
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
    error() { return this.store.apiError },
    username() { return this.loggedIn && this.store?.data?.user }
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

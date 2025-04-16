
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
          <MultiButtonWidget
            stateEndpoint="extLight" 
            icon="mdi-lightbulb"
            :buttons="exteriorLightButtons"
          >Exterior light</MultiButtonWidget>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <OnOffWidget 
            stateEndpoint="server" 
            commandOn="server-on" 
            commandOff="server-off"
            icon="mdi-server"
          >
            Server
          </OnOffWidget>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TemperatureWidget name="temperature/sensor_2" class="mb-2">Temp. downstairs</TemperatureWidget>
          <TemperatureWidget name="temperature/sensor_1" class="mb-2">Temp. upstairs</TemperatureWidget>
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
import { TemperatureWidget, OnOffWidget, MultiButtonWidget } from "@/components"

export default {
  components: {
    TemperatureWidget,
    OnOffWidget,
    MultiButtonWidget
  },
  setup() {
    const store = useStore()
    store.init()
    return { store }
  },
  data() {
    return {
      password: "",
      exteriorLightButtons: `[
          { "label": "Turn on for 10 min", "command": "ext-light-on", "primary": true },
          { "label": "Turn off", "command": "ext-light-off" }
      ]`
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

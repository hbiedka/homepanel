
<template>
<v-app>
  <v-main>
    <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="700" class="pt-4">
      <v-card-title>Hello</v-card-title>
      <v-card-text>
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
  methods: {
    async login() {
      //TODO validate password
      await this.store.login(this.password)
    }
  }
}

</script>

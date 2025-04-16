<template>
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" size="small">{{ icon }}</v-icon>          
              <p style="font-size:smaller;">
                <slot></slot>
              </p>
              <v-spacer></v-spacer>
                  <p v-if="state" style="background-color: #1B5E20; border-radius: 5px; font-size:smaller;" class="px-2 py-0">ON</p>
                  <p v-else style="background-color: #424242; border-radius: 5px; font-size:smaller;" class="px-2 py-0">OFF</p>
            </v-card-title>
            <v-card-text class="mt-2">
              <v-btn v-for="(button, index) in buttonObjects" :key="index" :color="button.primary ? 'primary' : 'grey'" @click="store.sendCommand(button.command)" class="ma-2">
                {{ button.label }}
              </v-btn>
            </v-card-text>
          </v-card>

</template>

<script>

import { useStore } from "@/stores/api"

export default {
    setup() {
        const store = useStore()
        return { store }
    },
    data() {
        return {
            swtichState: false,
            switchIndeterminate: false,
            indeterminateTimeout: null
        }
    },
    props: {
        icon: {
            type: String,
            default: "mdi-lightbulb"
        },
        buttons: {
            type: String,
            default: "[]"
        },
        stateEndpoint: String,
    },
    computed: {
        state() {
            const path = this.stateEndpoint.split('/')
            let value = this.store?.data
            for (const key of path) {
                value = value?.[key]
            }
            return value
        },
        buttonObjects() {
            try {
                return JSON.parse(this.buttons)
            } catch (e) {
                console.error("Error parsing buttons prop:", e)
                return []
            }
        },
    },
    methods: {
        async sendCommand(command) {
            try {
                await this.store.sendCommand(command)
            } catch (e) {
                console.error("Error sending command:", e)
            }
        },
    },
}

</script>
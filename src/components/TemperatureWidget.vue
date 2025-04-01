<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" size="small">mdi-thermometer</v-icon>
            <p style="font-size:smaller">
                <slot></slot>
            </p>
            <v-spacer></v-spacer>
            {{ temperature }} °C
        </v-card-title>
    </v-card> 
</template>

<script>

import { useStore } from "@/stores/api"

export default {
    setup() {
        const store = useStore()
        return { store }
    },
    props: {
        name: String
    },
    computed: {
        temperature() {
            const path = this.name.split('/')
            let value = this.store?.data
            for (const key of path) {
                value = value?.[key]
            }
            return (value || value === 0) ? `${Math.round(value*10)/10}` : "?"
        }
    }
}

</script>
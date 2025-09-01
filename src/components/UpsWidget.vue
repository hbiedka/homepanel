<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" size="small">mdi-car-battery</v-icon>
            <p style="font-size:smaller">
                <slot></slot>
            </p>
            <v-spacer></v-spacer>
            <!-- {{ upsBatterySoc }} % -->
                <p style="border-radius: 5px; font-size:smaller;" :style="stateColor" class="px-2 py-0">
                    {{ stateStr }}
                </p>
        </v-card-title>
        <v-card-text class="mt-2">
            <p class="d-flex mb-1">
                SoC
                <v-spacer></v-spacer>
                <b>{{ batterySoc }} %</b>
            </p>
            <p class="d-flex mb-1">
                Load
                <v-spacer></v-spacer>
                <b>{{ load }} %</b>
            </p>
            <p class="d-flex mb-1">
                Battery voltage
                <v-spacer></v-spacer>
                <b>{{ batteryVoltage }} V</b>
            </p>
            <p class="d-flex mb-1">
                Input voltage / freq.
                <v-spacer></v-spacer>
                <b>{{ inVoltage }} V / {{ inFreq }} Hz</b>
            </p>
            <p class="d-flex mb-1">
                Output voltage
                <v-spacer></v-spacer>
                <b>{{ outVoltage }} V</b>
            </p>
            
        </v-card-text>
    </v-card> 
</template>

<script>

import { useStore } from "@/stores/api"
import { toValue } from "vue"

export default {
    setup() {
        const store = useStore()
        return { store }
    },
    props: {
        name: String
    },
    computed: {
        ups() {
            const path = this.name.split('/')
            let value = this.store?.data
            for (const key of path) {
                value = value?.[key]
            }
            return value
        },
        state() {
            return this.ups?.ups?.status?.value || "?"
        },
        stateStr() {
            const s = this.state
            if (s === "OL") return "Online"
            if (s === "OB") return "On battery"

            return s
        },
        stateColor() {
            return `background-color: ${this.state == "OL" ? "#1B5E20" : "#D32F2F"};`
        },
        batterySoc() {
            return this.ups?.battery?.charge?.value || "?"
        },
        batteryVoltage() {
            return this.ups?.battery?.voltage?.value || "?"
        },
        load() {
            return this.ups?.ups?.load?.value || "?"
        },
        inVoltage() {
            return this.ups?.input?.voltage?.value || "?"
        },
        outVoltage() {
            return this.ups?.output?.voltage?.value || "?"
        },
        inFreq() {
            return this.ups?.input?.frequency?.value || "?"
        },

    }
}

</script>
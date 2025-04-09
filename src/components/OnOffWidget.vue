<template>
    <v-card>
    <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" size="small">{{ icon }}</v-icon>
        <p style="font-size:smaller;">
            <slot></slot>
        </p>
        <v-spacer></v-spacer>
        <v-switch 
            v-model="swtichState" 
            :loading="switchIndeterminate" 
            inset 
            hide-details
            @update:model-value="stateChanged"
        ></v-switch>
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
        stateEndpoint: String,
        commandOn: String,
        commandOff: String,
    },
    computed: {
        state() {
            const path = this.stateEndpoint.split('/')
            let value = this.store?.data
            for (const key of path) {
                value = value?.[key]
            }
            return value
        }
    },
    methods: {
        stateChanged() {
            //ignore changes until not confirmed from server
            if (this.switchIndeterminate) return
            
            const to = this.swtichState
            
            console.log(`state switched ${to}`)
            //drop indeterminate state
            
            if (to !== true && to !== false ) {
                console.error(`indetermined state of switch: ${to}`)
                return
            }

            //send command
            this.store.sendCommand(to ? this.commandOn : this.commandOff)
            this.switchIndeterminate = true

            this.indeterminateTimeout = setTimeout(this.cancelStateChange,10000);

        },
        cancelStateChange() {
            //if there is no update from server
            if (this.switchIndeterminate) {
                this.switchIndeterminate = false
                this.switchState = this.state
            }
        }

    },
    watch: {
        state(to) {
            if (to !== true && to !== false ) {
                //indeterminate state
                this.switchIndeterminate = true
            } else {
                this.swtichState = to
                this.switchIndeterminate = false
            }
        },
    }

}

</script>
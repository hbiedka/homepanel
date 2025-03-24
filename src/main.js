import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
  components,
  directives,
})


const app = createApp(App)

app.use(createPinia())
app.use(vuetify)

app.mount('#app')

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { queryClient } from './lib/query-client'
import router from './router'
import './style.css'
// vue-sonner v2 tidak lagi menyuntikkan CSS sendiri; tanpa ini toast ada di DOM tapi tidak terlihat.
import 'vue-sonner/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin, { queryClient })
app.use(router)

app.mount('#app')

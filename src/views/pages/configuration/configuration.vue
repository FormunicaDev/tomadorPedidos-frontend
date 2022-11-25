<template>
  <v-card id="account-setting-card">
    <!-- tabs -->
    <v-tabs
      v-model="tab"
      show-arrows
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.icon"
      >
        <v-icon
          size="20"
          class="me-3"
        >
          {{ tab.icon }}
        </v-icon>
        <span>{{ tab.title }}</span>
      </v-tab>
    </v-tabs>

    <!-- tabs item -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <configEmail></configEmail>
      </v-tab-item>

      <v-tab-item>
        <configListEmail></configListEmail>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import {
  mdiAccountOutline, mdiLockOpenOutline, mdiInformationOutline, mdiEmailCheck, mdiMail,
} from '@mdi/js'
import { ref } from '@vue/composition-api'
import validateLogin from '@/services/validateLogin'

// demos
import configEmail from './configEmail.vue'
import configListEmail from './configListEmail.vue'

export default {
  components: {
    configEmail,
    configListEmail,
  },
  setup() {
    const tab = ref('')

    // tabs
    const tabs = [
      { title: 'Configurar Correo de la aplicación', icon: mdiEmailCheck },
      { title: 'Lista de Correos', icon: mdiMail },
    ]

    // account settings data
    const accountSettingData = {
      account: {
        avatarImg: require('@/assets/images/avatars/1.png'),
        username: '.',
        name: '.',
        email: 'usuario@formunica.com',
        role: 'Admin',
        status: 'Activo',
        company: 'Formunica S.A',
      },
      information: {
        bio: 'Aplicación propiedad de Formunica S.A Cualquier consulta dirigirse a Gerencia de IT',
        email: 'controladorver@formunica.com',
      },
    }

    return {
      tab,
      tabs,
      accountSettingData,
      icons: {
        mdiAccountOutline,
        mdiLockOpenOutline,
        mdiInformationOutline,
        mdiEmailCheck,
        mdiMail,
      },
    }
  },
  created() {
    this.comprobarLogin()
  },
  methods: {
    comprobarLogin() {
      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
  },
}
</script>

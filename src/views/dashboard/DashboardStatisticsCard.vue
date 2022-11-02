<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Total de Pedidos Ingresados</span>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        class="me-n3 mt-n2"
      >
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="resolveStatisticsIconVariation (statisticsData.title).color"
            rounded
            class="elevation-1"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ resolveStatisticsIconVariation (statisticsData.title).icon }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              {{ statisticsData.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ statisticsData.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiAccountOutline, mdiCurrencyUsd, mdiTrendingUp, mdiDotsVertical, mdiLabelOutline } from '@mdi/js'
import axios from 'axios'

export default {
  setup() {
    const resolveStatisticsIconVariation = data => {
      if (data === 'Pedidos Ingresados') return { icon: mdiTrendingUp, color: 'primary' }

      return { icon: mdiAccountOutline, color: 'success' }
    }

    return {
      resolveStatisticsIconVariation,

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiCurrencyUsd,
      },
    }
  },
  data: () => ({
    statisticsData: [],
  }),
  created() {
    this.getStatistics()
  },
  methods: {
    getStatistics() {
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknHonduras')}`
      const usuario = sessionStorage.getItem('user')

      axios.get(`/estadistica?usuario=${usuario}`).then(response => {
        this.statisticsData = response.data
        console.log(this.statisticsData)
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

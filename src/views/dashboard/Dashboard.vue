<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <dashboard-user></dashboard-user>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <dashboard-statistics-card></dashboard-statistics-card>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiPoll, mdiCurrencyUsd } from '@mdi/js'
import validateLogin from '@/services/validateLogin'

// demos
import DashboardUser from './DashboardUser.vue'
import DashboardStatisticsCard from './DashboardStatisticsCard.vue'

export default {
  components: {
    DashboardUser,
    DashboardStatisticsCard,
  },
  setup() {
    const totalProfit = {
      statTitle: 'Total Profit',
      icon: mdiPoll,
      color: 'success',
      subtitle: 'Weekly Project',
      statistics: '$25.6k',
      change: '+42%',
    }

    const totalSales = {
      statTitle: 'Refunds',
      icon: mdiCurrencyUsd,
      color: 'secondary',
      subtitle: 'Past Month',
      statistics: '$78',
      change: '-15%',
    }

    // vertical card options

    return {
      totalProfit,
      totalSales,
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

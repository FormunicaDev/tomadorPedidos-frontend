<template>
  <v-card>
    <v-card-text>
      <v-card-title>
        Configuración de Correo Electronico
      </v-card-title>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="dataConfig"
          sort-by="email"
          class="elevation-1"
        >
          <template v-slot:[`item.status`]="{item}">
            <v-chip
              small
              :color="getColor(item.status)"
              dark
              class="font-weight-medium"
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{item}">
            <v-icon
              medium
              @click="deleteItem(item)"
            >
              {{ icons.mdiDelete }}
            </v-icon>
          </template>
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Configuración</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    size="45px"
                    @click="getConfig()"
                  >
                    {{ icons.mdiRefreshCircle }}
                  </v-icon>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Nuevo
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5"> Registrar Nueva Configuración</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                        sm="2"
                      >
                        <v-text-field
                          v-model="configData.email"
                          label="E-Mail"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        md="3"
                        sm="2"
                      >
                        <v-text-field
                          v-model="configData.password"
                          label="Contraseña"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      @click="postConfig()"
                    >
                      Guardar
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="green"
                      ></v-progress-circular>
                    </v-btn>
                    <v-btn
                      color="secondary"
                      @click="close"
                    >
                      Cerrar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="dialogDelete"
                max-width="600px"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    ¿Seguro que desea eliminar esta configuración?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeDelete"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="error"
                      @click="deleteItemConfirm"
                    >
                      OK
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
        </v-data-table>
        <v-snackbar
          v-model="snackbar"
        >
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="indigo"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
        <!-- alert -->
        <v-col cols="12">
          <v-alert
            color="info"
            text
            class="mb-0"
          >
            <div class="d-flex align-start">
              <v-icon color="info">
                {{ icons.mdiAlertOutline }}
              </v-icon>

              <div class="ms-3">
                <p class="text-base font-weight-medium mb-1">
                  Esta configuración sirve para establecer el correo desde el cual la aplicación enviara los email de notificación.
                </p>
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mdiAlertOutline, mdiRefreshCircle, mdiDelete } from '@mdi/js'

export default {
  setup() {
    return {
      icons: {
        mdiAlertOutline,
        mdiRefreshCircle,
        mdiDelete,
      },
    }
  },
  data: () => ({
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdConfig',
      },
      { text: 'Email', value: 'email' },
      { text: 'Contraseña', value: 'password' },
      { text: 'Fecha de Registro', value: 'FechaRegistro' },
      { text: 'Estado', value: 'status' },
      { text: 'Acciones', value: 'actions' },
    ],
    dataConfig: [],
    totalRegistro: 0,
    configData: {
      email: '',
      password: '',
      usuario: '',
    },
    text: '',
    snackbar: false,
    loading: false,
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    IdConfig: 0,
  }),
  created() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknHonduras')}`
      axios.get('/config').then(response => {
        this.dataConfig = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    postConfig() {
      if (this.configData.email === '' || this.configData.password === '') {
        this.snackbar = true
        this.text = 'Correo y Contraseña son campos obligaotirios'
      } else {
        const user = sessionStorage.getItem('user')
        const { password } = this.configData
        const pass = btoa(password)
        this.configData.usuario = user
        this.configData.password = pass
        this.loading = true

        axios.post('/config', this.configData).then(response => {
          this.snackbar = true
          this.text = response.data.mensaje
          this.loading = false
          this.dialog = false
          this.getConfig()
        }).catch(error => {
          this.text = error
          this.snackbar = true
          this.loading = false
        })
      }
    },
    deleteItem(item) {
      this.IdConfig = item.IdConfig
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteConfig()
    },
    deleteConfig() {
      const user = sessionStorage.getItem('user')
      axios.delete(`/config?usuario=${user}&IdConfig=${this.IdConfig}`).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialogDelete = false
        this.getConfig()
      }).catch(error => {
        console.log(error)
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    getColor(estado) {
      if (estado === 'Activo') return '#00838e'
      if (estado === 'Inactivo') return '#c00000'

      return '#102027'
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
  },
}
</script>

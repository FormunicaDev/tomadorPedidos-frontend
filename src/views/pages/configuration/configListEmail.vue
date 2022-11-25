<template>
  <v-card>
    <v-card-text>
      <v-card-title>
        Lista de Correo Electronicos
      </v-card-title>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="dataEmail"
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
              v-if="item.status === 'Activo'"
              medium
              @click="deleteItem(item)"
            >
              {{ icons.mdiDelete }}
            </v-icon>
            <v-icon
              v-if="item.status !== 'Activo'"
              medium
              @click="ActivateItem(item)"
            >
              {{ icons.mdiAccountReactivate }}
            </v-icon>
          </template>
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>E-Mail</v-toolbar-title>
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
                    @click="getListEmail()"
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
                    <span class="text-h5"> Registrar Nuevo Correo</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                        sm="2"
                      >
                        <v-text-field
                          v-model="emailData.email"
                          label="E-Mail"
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
                      @click="postEmail()"
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
                    ¿Seguro que desea eliminar este correo?
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
              <v-dialog
                v-model="dialogUpdate"
                max-width="600px"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    ¿Seguro que desea reactivar este correo?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeUpdate"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="info"
                      @click="activeItemConfirm"
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
                  Los correos activos que esten registrados recibiran notificación cuando se realice un pedido.
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
import {
  mdiAlertOutline, mdiRefreshCircle, mdiDelete, mdiAccountReactivate,
} from '@mdi/js'

export default {
  setup() {
    return {
      icons: {
        mdiAlertOutline,
        mdiRefreshCircle,
        mdiDelete,
        mdiAccountReactivate,
      },
    }
  },
  data: () => ({
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdEmail',
      },
      { text: 'Email', value: 'Email' },
      { text: 'Fecha de Registro', value: 'FechaRegistro' },
      { text: 'Estado', value: 'status' },
      { text: 'Acciones', value: 'actions' },
    ],
    dataEmail: [],
    totalRegistro: 0,
    emailData: {
      email: '',
      usuario: '',
    },
    text: '',
    snackbar: false,
    loading: false,
    dialog: false,
    dialogDelete: false,
    dialogUpdate: false,
    editedIndex: -1,
    IdEmail: 0,
  }),
  created() {
    this.getListEmail()
  },
  methods: {
    async getListEmail() {
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknHonduras')}`
      axios.get('/listaemail').then(response => {
        if (response.data.statusCode === 200) {
          this.dataEmail = response.data.items
        } else {
          this.snackbar = true
          this.text = response.data.mensaje
        }
      }).catch(error => {
        console.log(error)
      })
    },
    postEmail() {
      if (this.emailData.email === '') {
        this.snackbar = true
        this.text = 'El Correo es campo obligatirio'
      } else {
        const user = sessionStorage.getItem('user')
        this.emailData.usuario = user
        this.loading = true

        axios.post('/listaemail', this.emailData).then(response => {
          this.snackbar = true
          this.text = response.data.mensaje
          this.loading = false
          this.dialog = false
          this.getListEmail()
        }).catch(error => {
          this.text = error
          this.snackbar = true
          this.loading = false
        })
      }
    },
    deleteItem(item) {
      this.IdEmail = item.IdEmail
      this.dialogDelete = true
    },

    ActivateItem(item) {
      this.IdEmail = item.IdEmail
      this.dialogUpdate = true
    },

    deleteItemConfirm() {
      this.deleteConfig()
    },
    activeItemConfirm() {
      this.activeEmail()
    },
    deleteConfig() {
      axios.delete(`/listaemail?IdEmail=${this.IdEmail}`).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialogDelete = false
        this.getListEmail()
      }).catch(error => {
        console.log(error)
      })
    },
    activeEmail() {
      axios.put(`/listaemail?IdEmail=${this.IdEmail}`).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialogUpdate = false
        this.getListEmail()
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
    closeUpdate() {
      this.dialogUpdate = false
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

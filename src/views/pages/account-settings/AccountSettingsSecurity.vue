<template>
  <v-card
    flat
    class="mt-5"
  >
    <v-form>
      <div class="px-3">
        <v-card-text class="pt-5">
          <v-row>
            <v-col
              cols="12"
              sm="8"
              md="6"
            >
              <!-- new password -->
              <v-text-field
                v-model="pass.contraseña"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :append-icon="isNewPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="Nueva Contraseña"
                outlined
                dense
                hint="Make sure it's at least 8 characters."
                persistent-hint
                @click:append="isNewPasswordVisible = !isNewPasswordVisible"
              ></v-text-field>

              <!-- confirm password -->
              <v-text-field
                v-model="pass.contraseña2"
                :type="isCPasswordVisible ? 'text' : 'password'"
                :append-icon="isCPasswordVisible ? icons.mdiEyeOffOutline:icons.mdiEyeOutline"
                label="Repetir Contraseña"
                outlined
                dense
                class="mt-3"
                @keyup="validarClave()"
                @click:append="isCPasswordVisible = !isCPasswordVisible"
              ></v-text-field>

              <v-alert
                v-if="alert"
                color="warning"
                text
                class="mb-0"
              >
                <div class="d-flex align-start">
                  <v-icon color="warning">
                    {{ icons.mdiAlertOutline }}
                  </v-icon>

                  <div class="ms-3">
                    <p class="text-base font-weight-medium mb-1">
                      {{ text }}
                    </p>
                  </div>
                </div>
              </v-alert>
            </v-col>

            <v-col
              cols="12"
              sm="4"
              md="6"
              class="d-none d-sm-flex justify-center position-relative"
            >
              <v-img
                contain
                max-width="170"
                src="@/assets/images/3d-characters/pose-m-1.png"
                class="security-character"
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
      </div>

      <!-- divider -->
      <v-divider></v-divider>

      <div class="pa-3">
        <v-card-title class="flex-nowrap">
          <v-icon class="text--primary me-3">
            {{ icons.mdiKeyOutline }}
          </v-icon>
          <span class="text-break">Puede actualizar su contraseña si así lo desea</span>
        </v-card-title>

        <v-card-text class="two-factor-auth text-center mx-auto">
          <v-avatar
            color="primary"
            class="primary mb-4"
            rounded
          >
            <v-icon
              size="25"
              color="white"
            >
              {{ icons.mdiLockOpenOutline }}
            </v-icon>
          </v-avatar>
        </v-card-text>

        <!-- action buttons -->
        <template>
          <v-row justify="center">
            <v-dialog
              v-model="dialog"
              persistent
              max-width="290"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  class="me-3 mt-3"
                  v-on="on"
                >
                  Guardar Cambios
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5">
                  ¿Seguro que desea actualizar su contraseña?
                </v-card-title>
                <v-card-text>Asegurese de recordar/guardar su clave antes de realizar el cambio.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="error"
                    @click="dialog = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="info"
                    @click="updatePassword()"
                  >
                    Aceptar
                    <v-progress-circular
                      v-if="loading"
                      indeterminate
                      color="green"
                    ></v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </div>
    </v-form>
    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="info"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiKeyOutline, mdiLockOpenOutline, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import axios from 'axios'

export default {
  setup() {
    const isCurrentPasswordVisible = ref(false)
    const isNewPasswordVisible = ref(false)
    const isCPasswordVisible = ref(false)

    return {
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      isCPasswordVisible,
      icons: {
        mdiKeyOutline,
        mdiLockOpenOutline,
        mdiEyeOffOutline,
        mdiEyeOutline,
      },
    }
  },
  data: () => ({
    pass: {
      contraseña: '',
      contraseña2: '',
    },
    text: '',
    snackbar: false,
    dialog: false,
    alert: false,
    loading: false,
  }),
  methods: {
    updatePassword() {
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknHonduras')}`
      this.loading = true
      const usuario = sessionStorage.getItem('user')
      axios.put(`/usuario?usuario=${usuario}`, this.pass).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialog = false
        this.loading = false
        this.pass.contraseña = ''
        this.pass.contraseña2 = ''
      }).catch(error => {
        console.log(error)
      })
    },
    validarClave() {
      const pass = this.pass.contraseña
      const pass2 = this.pass.contraseña2

      if (pass !== pass2) {
        this.text = 'Las contraseñas no coinciden'
        this.alert = true
      } else {
        this.alert = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.two-factor-auth {
  max-width: 25rem;
}
.security-character {
  position: absolute;
  bottom: -0.5rem;
}
</style>

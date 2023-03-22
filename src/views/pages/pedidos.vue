<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-scroll-x-transition>
      <v-data-table
        :headers="headers"
        :items="dataPedidos"
        :search="search"
        hide-default-footer
      >
        <template v-slot:[`item.Estado`]="{item}">
          <v-chip
            small
            :color="getColor(item.Estado)"
            dark
            class="font-weight-medium"
          >
            {{ item.Estado }}
          </v-chip>
        </template>
        <template v-slot:[`item.usuarioAs`]="{item}">
          <v-chip
            small
            :color="getColor(item.usuarioAs)"
            dark
            class="font-weight-medium"
          >
            {{ item.usuarioAs }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{item}">
          <v-icon
            medium
            @click="getDetallePedido(item.IdPedido)"
          >
            {{ icons.mdiClipboardList }}
          </v-icon>
          <v-icon
            medium
            @click="deleteItem(item.IdPedido)"
          >
            {{ icons.mdiDelete }}
          </v-icon>
        </template>
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Pedidos</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <h4>Total de Registros: {{ totalRegistro }}</h4>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="1000"
              class="rounded-xl"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  size="45px"
                  @click="getPedidos()"
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
                  @click="nuevo()"
                >
                  Nuevo
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form class="multi-col-validation">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="5"
                          md="3"
                        >
                          <v-text-field
                            v-model="vendedor"
                            label="Vendedor"
                            outlined
                            dense
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-autocomplete
                            v-model="pedidoData.cliente"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Cliente*"
                            :items="dataClientes"
                            :item-text="concatCliente"
                            item-value="CLIENTE"
                            @input="findCliente()"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-autocomplete
                            v-model="pedidoData.tipoVenta"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Tipo Venta*"
                            :items="dataTipoVenta"
                            item-text="TipoVenta"
                            item-value="IdTipoVenta"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-autocomplete
                            v-model="pedidoData.formaPago"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Forma de Pago*"
                            :items="dataFormaPago"
                            item-text="FormaPago"
                            item-value="IdFormaPago"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          md="12"
                          sm="4"
                        >
                          <v-textarea
                            v-model="direccion"
                            name="input-7-1"
                            label="Direccion del Cliente"
                            auto-grow
                            outlined
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-autocomplete
                            v-model="pedidoData.banco"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Bancos*"
                            :items="dataBancos"
                            item-text="Banco"
                            item-value="IdBanco"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="5"
                          md="4"
                        >
                          <v-autocomplete
                            v-model="detalle.codArticulo"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Productos"
                            :items="dataProductos"
                            :item-text="concatProducto"
                            item-value="cod_prod"
                            @input="getArticuloByCode()"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="detalle.cantidad"
                            label="Cantidad*"
                            outlined
                            dense
                            type="number"
                            min="0"
                            @keyup="calcularTotal()"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="detalle.precioArticulo"
                            label="P. Lempiras"
                            outlined
                            dense
                            type="number"
                            min="0"
                            @keyup="calcularTotal()"
                            @click="calcularTotal()"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="detalle.porcDescuento"
                            label="Descuento"
                            outlined
                            dense
                            type="number"
                            min="0"
                            @keyup="calcularDescuento()"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="detalle.totalLempira"
                            label="Total Lempiras"
                            outlined
                            disabled
                            dense
                            type="number"
                            min="0"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="totalDescuento"
                            label="Total con Descuento"
                            outlined
                            disabled
                            dense
                            type="number"
                            min="0"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="detalle.totalDesc"
                            label="Total Descuento"
                            outlined
                            disabled
                            dense
                            type="number"
                            min="0"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            label="Cheque #"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="2"
                        >
                          <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="date"
                                label="Fecha Cheque"
                                outlined
                                dense
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="secondary"
                                @click="menu = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                        >
                          <v-btn
                            color="secondary"
                            @click="addProduct()"
                          >
                            Agregar Producto
                          </v-btn>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-data-table
                            :headers="headersProd"
                            :items="dataItem"
                            sort-by="calories"
                            class="elevation-1"
                          >
                          </v-data-table>
                        </v-col>
                        <v-col cols="12">
                          <v-alert
                            color="#2196F3"
                            text
                            class="mb-0"
                          >
                            <div class="d-flex align-start">
                              <v-icon color="#1E88E5">
                                {{ icons.mdiInformation }}
                              </v-icon>

                              <div class="ms-3">
                                <p class="text-base font-weight-medium mb-1">
                                  Entiendo que FORMUNICA factura y envia producto de CONTADO al recibir el pago del
                                  mismo en cuentas bancarias FORMUNICA. Por ende, si solicito un pedido de CONTADO
                                  conociento esta politica, pero el cliente no paga en el mismo día que solicito el pedido
                                  o en el mismo día de entrega del pedido,soy responsable de este pago, y se me deducira de
                                  planilla en la siguiente quincena.
                                </p>
                                <span class="text-sm">¿Acepta los terminos?</span>
                                <v-row>
                                  <v-switch
                                    v-model="switch1"
                                    inset
                                    color="info"
                                    :label="`Estado: ${switch1==true?'Aceptado':'Declinado'}`"
                                  ></v-switch>
                                </v-row>
                              </div>
                            </div>
                          </v-alert>
                        </v-col>
                        <v-col
                          cols="12"
                          md="12"
                          sm="4"
                        >
                          <v-textarea
                            v-model="pedidoData.comentarios"
                            name="input-7-1"
                            label="Comentarios"
                            auto-grow
                            outlined
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    v-if="!editedVisible"
                    color="primary"
                    :disabled="!switch1"
                    @click="postPedido()"
                  >
                    Guardar
                    <v-progress-circular
                      v-if="loading"
                      indeterminate
                      color="green"
                    ></v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="loading"
              hide-overlay
              persistent
              width="300"
            >
              <v-card
                color="primary"
                dark
              >
                <v-card-text>
                  Guardando y enviando notificaión por correo, por favor espere...
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDetail"
              max-width="1000"
              class="rounded-xl"
            >
              <v-card>
                <v-card-tittle>
                  <span class="text-h5">Detalles del Pedido</span>
                </v-card-tittle>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-data-table
                          :headers="headersDetalle"
                          :items="dataDetallePedido"
                          class="elevation-3"
                        >
                          <template v-slot:[`item.actDetail`]="{item}">
                            <v-icon
                              medium
                              @click="deleteDetalleItem(item.IdDetallePedido)"
                            >
                              {{ icons.mdiDelete }}
                            </v-icon>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              max-width="600px"
            >
              <v-card class="rounded-xl">
                <v-card-title class="text-h5">
                  ¿Seguro que desea anular este Pedido?
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
                    @click="deleteItemConfirm()"
                  >
                    OK
                    <v-spacer v-if="loadDelete"></v-spacer>
                    <v-progress-circular
                      v-if="loadDelete"
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDeleteDetalle"
              max-width="600px"
            >
              <v-card class="rounded-xl">
                <v-card-title class="text-h5">
                  ¿Seguro que desea eliminar este producto?
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
                    @click="deleteDetalleItemConfirm()"
                  >
                    OK
                    <v-spacer v-if="loadDelete"></v-spacer>
                    <v-progress-circular
                      v-if="loadDelete"
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
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
      </v-data-table>
    </v-scroll-x-transition>
    <v-snackbar
      v-model="snackbar"
      :vertical="vertical"
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
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="totalPagina"
        circle
        @input="getPedidoPagination()"
      ></v-pagination>
    </div>
  </v-card>
</template>

<script>
import axios from 'axios'
import {
  mdiCloudUploadOutline, mdiDelete, mdiPencil, mdiPlus,
  mdiRefreshCircle, mdiLockPlus, mdiPlusCircle, mdiAccount, mdiInformation, mdiDetails, mdiClipboardList,
} from '@mdi/js'
import validateLogin from '@/services/validateLogin'

export default {
  components: {
  },
  setup() {
    return {
      icons: {
        mdiCloudUploadOutline,
        mdiDelete,
        mdiPencil,
        mdiPlus,
        mdiRefreshCircle,
        mdiLockPlus,
        mdiPlusCircle,
        mdiAccount,
        mdiInformation,
        mdiDetails,
        mdiClipboardList,
      },
    }
  },
  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString(),
    modal: false,
    menu: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdPedido',
      },
      { text: 'Codigo', value: 'Codigo' },
      { text: 'Fecha', value: 'FechaEmision' },
      { text: 'Vendedor', value: 'codVendedor' },
      { text: 'Cliente', value: 'codCliente' },
      { text: 'Total', value: 'Total' },
      { text: 'Descuento', value: 'TotalDescuento' },
      { text: 'Total Neto', value: 'TotalNeto' },
      { text: 'Estado', value: 'Estado' },
      { text: 'Usuario', value: 'usuarioAs' },
      { text: 'Acciones', value: 'actions' },
    ],
    headersDetalle: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdDetallePedido',
      },
      { text: 'Producto', value: 'DESCRIPCION' },
      { text: 'Precio', value: 'Precio' },
      { text: 'Cantidad', value: 'Cantidad' },
      { text: 'Descuento', value: 'Descuento' },
      { text: 'Acciones', value: 'actDetail' },
    ],
    headersProd: [
      {
        text: '#Item',
        align: 'start',
        sortable: false,
        value: 'item',
      },
      { text: 'Cod.Producto', value: 'codArticulo' },
      { text: 'Producto', value: 'nom_prod' },
      { text: 'Cantidad', value: 'cantidad' },
      { text: 'Precio', value: 'precioArticulo' },
      { text: 'Subtotal', value: 'subtotal' },
      { text: 'Descuento', value: 'totalDesc' },
      { text: 'Total', value: 'totalConDescuento' },
      { text: '', value: 'actionsProd' },
    ],
    editedIndex: -1,
    dataPedidos: [],
    dataDetallePedido: [],
    dataClientes: [],
    dataBancos: [],
    dataFormaPago: [],
    dataTipoVenta: [],
    dataVendedor: [],
    dataProductos: [],
    dataItem: [],
    switch1: false,
    search: '',
    searchSystem: '',
    dialog: false,
    dialogDelete: false,
    dialogDeleteDetalle: false,
    dialogDetail: false,
    overlay: true,
    snackbar: false,
    loading: false,
    vertical: true,
    disabled: false,
    editedVisible: false,
    loadDelete: false,
    text: '',
    page: 1,
    pageDetalle: 1,
    cantidadRegistros: 10,
    cantidadRegistrosDetalle: 10,
    totalPagina: 0,
    totalRegistro: 0,
    totalRegistroDetalle: 0,
    direccion: '',
    detalle: {
      codArticulo: '',
      cantidad: null,
      porcDescuento: null,
      totalLempira: 0,
      totalDesc: 0,
      precioArticulo: 0,
    },
    pedidoData: {
      codigo: 0,
      vendedor: '',
      cliente: '',
      tipoVenta: 0,
      banco: 5,
      totalDescuento: 0,
      total: 0,
      totalNeto: 0,
      comentarios: '',
      cheque: 0,
      fechaCheque: '',
      UsuarioRegistro: '',
      formaPago: 4,
      direccion: '',
      detallePedido: [],
    },
    vendedor: '',
    IdPedido: 0,
    IdDetallePedido: 0,
    totalDescuento: 0,

  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Pedido' : 'Actualizar Datos Del Pedido'
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.close()
    },
  },
  created() {
    this.getPedidos()
    this.comprobarLogin()
  },
  methods: {
    comprobarLogin() {
      this.pedidoData.vendedor = sessionStorage.getItem('cod_vend')
      this.vendedor = `${sessionStorage.getItem('user')} - ${sessionStorage.getItem('cod_vend')}`
      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
    async getPedidos() {
      this.overlay = false
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknHonduras')}`
      let user = ''
      const role = sessionStorage.getItem('roleFormunica')
      console.log(role)

      if (role !== '110') {
        user = sessionStorage.getItem('user')
      } else {
        user = ''
      }
      await axios.get(`/pedidos?cantidad=${this.cantidadRegistros}&page=${this.page}&user=${user}`).then(response => {
        if (response.data.statusCode === 200) {
          this.dataPedidos = response.data.data
          this.totalRegistro = response.data.paginacion.totalRegistros
          this.totalPagina = response.data.paginacion.totalPaginas
          this.overlay = false
        } else if (response.data.statusCode === 404) {
          this.dataPedidos = []
          this.totalRegistro = 0
          this.snackbar = true
          this.text = response.data.mensaje
          this.overlay = false
        }
      }).catch(error => {
        console.log(error)
        this.overlay = false
        this.text = error.response.data
        this.snackbar = true
      })
    },
    async getVendedores() {
      await axios.get('/vendedor').then(response => {
        this.dataVendedor = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    async getClientes() {
      await axios.get('/clientes').then(response => {
        this.dataClientes = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    async getTipoVenta() {
      await axios.get('/tipoventa').then(response => {
        this.dataTipoVenta = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    async getFormaPago() {
      await axios.get('/formapago').then(response => {
        this.dataFormaPago = response.data.data
        this.pedidoData.formaPago = response.data.data[3].IdFormaPago
      }).catch(error => {
        console.log(error)
      })
    },
    async getBancos() {
      await axios.get('/banco').then(response => {
        this.dataBancos = response.data.data
        this.pedidoData.banco = response.data.data[4].IdBanco
        console.log(response.data.data[4].IdBanco)
      }).catch(error => {
        console.log(error)
      })
    },
    async getProductos() {
      await axios.get('/producto').then(response => {
        this.dataProductos = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    async getArticuloByCode() {
      await axios.get(`/articulo/${this.detalle.codArticulo}`).then(response => {
        this.detalle.precioArticulo = response.data.data[0].PRECIO_BASE_LOCAL
      }).catch(error => {
        console.log(error)
      })
    },
    async findCliente() {
      axios.get(`/clientes/${this.pedidoData.cliente}`).then(response => {
        if (response.data.data[0].DIRECCION === '' || response.data.data[0].DIRECCION === null) {
          this.direccion = 'Dirección no disponible'
        } else {
          this.direccion = response.data.data[0].DIRECCION
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getPedidoPagination() {
      this.overlay = true
      const role = sessionStorage.getItem('roleFormunica')
      let user = ''
      if (role !== '110') {
        user = sessionStorage.getItem('user')
      } else {
        user = ''
      }
      axios.get(`/pedidos?cantidad=${this.cantidadRegistros}&page=${this.page}&user=${user}`).then(response => {
        if (response.data.statusCode === 200) {
          this.dataPedidos = response.data.data
          this.totalRegistro = response.data.paginacion.totalRegistros
          this.totalPagina = response.data.paginacion.totalPaginas
          this.overlay = false
          window.scrollTo(0, 0)
        } else if (response.data.statusCode === 404) {
          this.dataPedidos = []
          this.totalRegistro = 0
          this.snackbar = true
          this.text = response.data.mensaje
          this.overlay = false
        }
      }).catch(error => {
        console.log(error)
        this.overlay = false
        this.text = error.response.data
        this.snackbar = true
      })
    },
    async postPedido() {
      this.pedidoData.detallePedido = this.dataItem
      this.pedidoData.fechaCheque = this.date
      this.pedidoData.UsuarioRegistro = sessionStorage.getItem('user')
      this.loading = true
      this.switch1 = false

      this.pedidoData.direccion = this.direccion
      this.pedidoData.comentarios = this.pedidoData.comentarios === '' ? `N/A - ${this.direccion}` : `${this.pedidoData.comentarios} - ${this.direccion}`

      if (this.pedidoData.cliente === '' || this.pedidoData.tipoVenta === 0) {
        this.snackbar = true
        this.text = 'Favor complete todos los campos que sean obligatorios'
        this.loading = false
      } else if (this.dataItem === null || this.dataItem === []) {
        this.snackbar = true
        this.text = 'Favor agregue al menos un producto'
        this.loading = false
      } else if (this.pedidoData.vendedor === null || this.pedidoData.vendedor === '') {
        this.snackbar = true
        this.text = 'No tiene un codigo de vendedor asignado'
        this.loading = false
      } else {
        await axios.post('/pedidos', this.pedidoData).then(response => {
          this.snackbar = true
          this.text = response.data.mensaje
          this.loading = false
          this.getPedidos()
          this.limpiarCampos()
        }).catch(error => {
          this.snackbar = true
          this.text = error
          this.loading = false
        })
      }
    },
    async getDetallePedido(IdPedido) {
      this.overlay = false
      this.dialogDetail = true
      this.IdPedido = IdPedido
      await axios.get(`/detallepedido?IdPedido=${IdPedido}&cantidad=${this.cantidadRegistrosDetalle}&page=${this.pageDetalle}`).then(response => {
        if (response.data.statusCode === 200) {
          this.dataDetallePedido = response.data.items
          this.totalRegistroDetalle = response.data.paginacion.totalRegistros
          this.overlay = false
        } else if (response.data.statusCode === 404) {
          this.dataDetallePedido = []
          this.snackbar = true
          this.text = response.data.mensaje
          this.overlay = false
        }
      }).catch(error => {
        this.snackbar = true
        this.text = error.response.data
        this.overlay = false
      })
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    deleteItem(IdPedido) {
      this.dialogDelete = true
      this.IdPedido = IdPedido
    },
    deleteDetalleItem(IdDetallePedido) {
      this.dialogDeleteDetalle = true
      this.IdDetallePedido = IdDetallePedido
    },
    deleteItemConfirm() {
      this.loadDelete = true
      this.anularPedido()
    },
    deleteDetalleItemConfirm() {
      this.loadDelete = true
      this.anularDetallePedido()
    },
    closeDelete() {
      this.dialogDelete = false
      this.dialogDeleteDetalle = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    getColor(estado) {
      if (estado === 'Iniciado') return '#00838e'
      if (estado === 'Procesado') return '#005b9f'
      if (estado === 'Anulado') return '#990000'

      return '#102027'
    },
    nuevo() {
      this.editedVisible = false
      this.getVendedores()
      this.getClientes()
      this.getTipoVenta()
      this.getBancos()
      this.getProductos()
      this.getFormaPago()
      this.limpiarCampos()
    },
    concatCliente(item) {
      return `${item.NOMBRE} - ${item.CLIENTE}`
    },
    concatVendedor(item) {
      return `${item.nombres} ${item.apellidos} - ${item.cod_vend}`
    },
    concatProducto(item) {
      return `${item.nom_prod} - ${item.cod_prod}`
    },
    calcularTotal() {
      // eslint-disable-next-line prefer-destructuring
      const cantidad = this.detalle.cantidad
      const precio = this.detalle.precioArticulo
      let total = 0

      total = cantidad * precio
      this.detalle.totalLempira = total
    },
    calcularDescuento() {
      // eslint-disable-next-line no-unused-vars
      let subTotal = 0
      // eslint-disable-next-line prefer-destructuring
      const cantidad = this.detalle.cantidad
      const precio = this.detalle.precioArticulo
      // eslint-disable-next-line prefer-destructuring
      const porcDescuento = this.detalle.porcDescuento
      let totalDescuento = 0

      subTotal = cantidad * precio

      // totalDescuento = (subTotal * porcDescuento) / 100
      totalDescuento = cantidad * porcDescuento

      this.detalle.totalDesc = totalDescuento
      this.totalDescuento = subTotal - totalDescuento

      // this.detalle.totalLempira = subTotal - totalDescuento
    },
    addProduct() {
      const productName = this.dataProductos.find(e => e.cod_prod === this.detalle.codArticulo)

      // console.log(productName.nom_prod)

      const data = {
        codArticulo: this.detalle.codArticulo,
        nom_prod: productName.nom_prod,
        cantidad: this.detalle.cantidad,
        porcDescuento: this.detalle.porcDescuento,
        totalLempira: this.detalle.totalLempira,
        totalDesc: this.detalle.totalDesc,
        precioArticulo: this.detalle.precioArticulo,
        totalConDescuento: this.detalle.totalLempira - this.detalle.totalDesc,
        subtotal: this.detalle.totalLempira,
      }
      this.pedidoData.total += this.detalle.totalLempira
      this.pedidoData.totalDescuento += this.detalle.totalDesc

      this.pedidoData.totalNeto = this.pedidoData.total - this.pedidoData.totalDescuento

      // console.log(this.pedidoData)

      this.detalle.cantidad = null
      this.detalle.porcDescuento = null
      this.detalle.totalDesc = 0
      this.detalle.precioArticulo = 0
      this.detalle.totalLempira = 0
      this.totalDescuento = 0

      this.dataItem.push(data)
    },
    anularPedido() {
      console.log(this.IdPedido)
      axios.delete(`/pedidos/${this.IdPedido}`).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.loadDelete = false
        this.getPedidos()
        this.dialogDelete = false
      }).catch(error => {
        console.log(error)
        this.loadDelete = false
      })
    },
    anularDetallePedido() {
      axios.get(`/detallepedido/${this.IdDetallePedido}`).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialogDeleteDetalle = false
        this.getDetallePedido(this.IdPedido)
        this.loadDelete = false
      }).catch(error => {
        this.snackbar = true
        this.loadDelete = false
        this.text = error
      })
    },

    limpiarCampos() {
      this.pedidoData.cliente = ''
      this.pedidoData.tipoVenta = 0
      this.pedidoData.totalDescuento = 0
      this.pedidoData.totalNeto = 0
      this.pedidoData.comentarios = ''
      this.pedidoData.cheque = 0
      this.pedidoData.fechaCheque = ''
      this.pedidoData.detallePedido = []
      this.dataItem = []
      this.detalle.codArticulo = ''
      this.direccion = ''
    },
  },
}
</script>

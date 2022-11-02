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
        <template v-slot:[`item.actions`]="{item}">
          <v-icon
            medium
            @click="getDetallePedido(item.IdPedido)"
          >
            {{ icons.mdiClipboardList }}
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
                          sm="3"
                          md="2"
                        >
                          <v-text-field
                            v-model="pedidoData.codigo"
                            label="Codigo*"
                            outlined
                            dense
                            :disabled="editedVisible ? '' : disabled"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="5"
                          md="3"
                        >
                          <v-autocomplete
                            v-model="pedidoData.vendedor"
                            small-chips
                            clearable
                            outlined
                            dense
                            label="Vendedor*"
                            :items="dataVendedor"
                            :item-text="concatVendedor"
                            item-value="cod_vend"
                          ></v-autocomplete>
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
                            item-value="cod_cte"
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
                            label="% Descuento"
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
                          md="2"
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
                            <template v-slot:[`item.actionsProd`]="{ item }">
                              <v-icon
                                small
                                @click="deleteItem(item)"
                              >
                                {{ icons.mdiDelete }}
                              </v-icon>
                            </template>
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
                          <v-toolbar flat>
                            <v-toolbar-title>Detalles</v-toolbar-title>
                            <v-divider
                              class="mx-4"
                              inset
                              vertical
                            ></v-divider>
                            <h4>Total de Registros: {{ totalRegistroDetalle }}</h4>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
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
      { text: 'Acciones', value: 'actions' },
    ],
    headersDetalle: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdDetallePedido',
      },
      { text: 'Producto', value: 'CodProducto' },
      { text: 'Precio', value: 'Precio' },
      { text: 'Cantidad', value: 'Cantidad' },
      { text: 'Descuento', value: 'Descuento' },
    ],
    headersProd: [
      {
        text: '#Item',
        align: 'start',
        sortable: false,
        value: 'item',
      },
      { text: 'Producto', value: 'codArticulo' },
      { text: 'Cantidad', value: 'cantidad' },
      { text: 'Precio', value: 'precioArticulo' },
      { text: 'Descuento', value: 'totalDesc' },
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
    dialogDetail: false,
    overlay: true,
    snackbar: false,
    loading: false,
    vertical: true,
    disabled: false,
    editedVisible: false,
    text: '',
    page: 1,
    pageDetalle: 1,
    cantidadRegistros: 10,
    cantidadRegistrosDetalle: 10,
    totalPagina: 0,
    totalRegistro: 0,
    totalRegistroDetalle: 0,
    detalle: {
      codArticulo: '',
      cantidad: 0,
      porcDescuento: 0,
      totalLempira: 0,
      totalDesc: 0,
      precioArticulo: 0,
    },
    pedidoData: {
      codigo: 0,
      vendedor: '',
      cliente: '',
      tipoVenta: 0,
      banco: 0,
      totalDescuento: 0,
      total: 0,
      totalNeto: 0,
      comentarios: '',
      cheque: 0,
      fechaCheque: '',
      UsuarioRegistro: '',
      detallePedido: [],
    },

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
      }).catch(error => {
        console.log(error)
      })
    },
    async getBancos() {
      await axios.get('/banco').then(response => {
        this.dataBancos = response.data.data
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

      if (this.pedidoData.codigo === 0 || this.pedidoData.vendedor === 0 || this.pedidoData.cliente === 0) {
        this.snackbar = true
        this.text = 'Favor complete todos los campos que sean obligatorios'
      } else {
        await axios.post('/pedidos', this.pedidoData).then(response => {
          this.snackbar = true
          this.text = response.data.mensaje
          this.loading = false
          this.getPedidos()
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
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    getColor(estado) {
      if (estado === 'Activo') return '#00838e'
      if (estado === 'Inactivo') return '#005b9f'

      return '#102027'
    },
    nuevo() {
      this.editedVisible = false
      this.getVendedores()
      this.getClientes()
      this.getTipoVenta()
      this.getBancos()
      this.getProductos()
    },
    concatCliente(item) {
      return `${item.nombres} - ${item.cod_cte}`
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
      let subTotal = 0
      // eslint-disable-next-line prefer-destructuring
      const cantidad = this.detalle.cantidad
      const precio = this.detalle.precioArticulo
      // eslint-disable-next-line prefer-destructuring
      const porcDescuento = this.detalle.porcDescuento
      let totalDescuento = 0

      subTotal = cantidad * precio
      totalDescuento = (subTotal * porcDescuento) / 100

      this.detalle.totalDesc = totalDescuento

      // this.detalle.totalLempira = subTotal - totalDescuento
    },
    addProduct() {
      const data = {
        codArticulo: this.detalle.codArticulo,
        cantidad: this.detalle.cantidad,
        porcDescuento: this.detalle.porcDescuento,
        totalLempira: this.detalle.totalLempira,
        totalDesc: this.detalle.totalDesc,
        precioArticulo: this.detalle.precioArticulo,
      }
      this.pedidoData.total += this.detalle.totalLempira
      this.pedidoData.totalDescuento += this.detalle.totalDesc

      this.pedidoData.totalNeto = this.pedidoData.total - this.pedidoData.totalDescuento

      console.log(this.pedidoData)

      this.detalle.cantidad = 0
      this.detalle.porcDescuento = 0
      this.detalle.totalDesc = 0
      this.detalle.precioArticulo = 0
      this.detalle.totalLempira = 0

      this.dataItem.push(data)
    },
  },
}
</script>

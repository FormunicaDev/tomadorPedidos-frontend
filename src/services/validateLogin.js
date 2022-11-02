// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'
import axios from 'axios'

export default {
  validateToken() {
    if (sessionStorage.getItem('tknHonduras') !== null) {
      const token = sessionStorage.getItem('tknHonduras')
      const decode = jwt_decode(token)
      const date = new Date(decode.exp)
      const usuario = sessionStorage.getItem('user')

      if (date > Date.now()) {
        sessionStorage.removeItem('tknHonduras')
        sessionStorage.removeItem('user')
        this.$router.push('/')

        return false
      }

      // eslint-disable-next-line consistent-return
      axios.get(`/login=user=${usuario}`).then(response => {
        if (response.data.error === 'Invalido') {
          sessionStorage.removeItem('tknHonduras')
          sessionStorage.removeItem('user')
          this.$router.push('/')

          return false
        }
      }).catch(error => {
        console.log(error)
      })

      return true
    }

    return false
  },
}

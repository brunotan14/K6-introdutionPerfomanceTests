import http from 'k6/http'
import { check, sleep } from 'k6'

export default function () {
   const url = "http://localhost:8080/login/" // url da api mockada

   const payload = JSON.stringify({ username: 'username', password: 'password' }) //payload da requisicao, oq vai ser enviado para a api

   const params = { //parametros da requisicao, oq vai ser enviado para a api, nao é necessario ter todos os parametros, apenas o Content-Type
    headers: {
      'Content-Type': 'application/json'
    }

   }
   const res = http.post(url,payload, params)

   check(res, {
    "Login realizado com sucesso": (r) => r.status === 200,
    "Validar mensagem de sucesso": (r) => r.json("mensagem") === "Login realizado com sucesso"
   })
   sleep(1)
}
import http from 'k6/http'
import { check, sleep } from 'k6'

export default function () {
   const url = "http://localhost:8080/login/" // url da api mockada

   const payload = JSON.stringify({ username: 'user1', password: 'password' }) //payload da requisicao, oq vai ser enviado para a api

   const params = { //parametros da requisicao, oq vai ser enviado para a api, nao é necessario ter todos os parametros, apenas o Content-Type
    headers: {
      'Content-Type': 'application/json'
    }
   }

   const response = http.post(url, payload, params) //faz a requisicao para a api
   
   // verifica se a resposta é 500 e se a mensgaem de erro esta correta
   check(response, { 
    'Login nao realizado': (r) => r.status === 500,  // funciona como uma step do cypress
    'error message': (r) => r.json("mensagem") === 'Erro interno ao processar login' 
   })
   // espera 1 segundo antes de fazer a proxima requisicao
   sleep(1)
}


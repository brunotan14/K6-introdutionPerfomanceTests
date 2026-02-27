import http from 'k6/http'
import {check, sleep} from 'k6'

export const options = {
    stages: [
        {duration: "30s", target: 20 },
        {duration: "30s", target: 50 },
        {duration: "30s", target: 100 },
        {duration: "30s", target: 200 },
        {duration: "30s", target: 0 }
    ]
}

const ceps = ['58042019','65243109','78936120',]

export default function () {
    const cep = ceps[Math.floor(Math.random() * ceps.length)] // cada VU vai testar um cep diferente gerado aleatoriamente

    const url = `http://localhost:8080/ws/${cep}/json/` // url da api mockada

    const res = http.get(url) // faz a requisicao para a api

    check(res, {
        "Status 200": (r) => r.status === 200, // verifica se a resposta é 200
        'Response time': (r) => r.timings.duration < 1000, // verifica se o tempo de resposta é menor que 1 segundo
        'Validar dados do CEP': (r) => {
           const body = JSON.parse(r.body)
           const cepSemHifen = body.cep.replace('-', '')
           return cepSemHifen === cep
        }
    })
}
import http from 'k6/http'
import { check, sleep } from 'k6'

export default function(){
    const url ="http://localhost:8080/ws/99999999/json/"

    const res = http.get(url)

    check(res, {
        "Status 400": (r) => r.status === 400,
        "Response time": (r) => r.timings.duration < 1000,
    })
    sleep(1)
}
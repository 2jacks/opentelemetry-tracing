// "use strict";
import './tracing.js'
import express from 'express'
const app = express()

import { tracer } from './tracing.js'

const PORT = process.env.PORT || '3000'

app.get('/', (req, res) => {
  const activeSpan = tracer.startSpan('abba')
  activeSpan.addEvent('Hello API Called', { randomIndex: 1 })
  sleep(500).then(() => {
    res.end('Hello World')
    activeSpan.end()
  })
})

app.get('/date', (req, res) => {
  res.json({ today: new Date() })
})

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`)
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const express = require('express')
const dotenv =require('dotenv')
const path=require('path')
const cors = require ('cors');
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
// const port = 8000
const filename = __filename;
var __dirname = path.dirname(filename)
dotenv.config({ path: path.join(__dirname, '.env') })
app.use(cors())


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.APP_PORT, () => console.log(`Example app listening on port ${process.env.APP_PORT}!`))

app.get('/users', db.getUsers)
app.post('/signUp',db.signUp)
app.post('/signIn',db.signIn)
app.post('/addSlot',db.addSlot)
app.post('/viewSlots',db.viewSlots)
app.post('/viewAvailableSlots',db.viewAvailableSlots)
app.patch('/reserveSlot',db.reserveSlot)
app.patch('/getReservations',db.getReservations)
app.patch('/updateReservation',db.updateReservation)
app.patch('/cancelReservation',db.cancelReservation)
app.get('/getDoctors',db.getDoctors)






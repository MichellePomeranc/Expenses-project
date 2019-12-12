const express = require('express')
const app = express()
const api = require('./routes/api')

const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const Expense = require("./model/expense.js")
const expensesDB = require('../expenses.json')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true })

app.use('/', api)

// for (let expense of expensesDB) {
//     let newExpense = new Expense(expense)
//     newExpense.save()
// }

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})
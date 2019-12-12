const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../model/expense')

router.get('/expenses', function (req, res) {
    Expense.find({}).sort({ date: -1 }).exec(function (err, expenses) {
        res.send(expenses)
    })
})

router.post("/new", function (req, res) {
    let exp = {
        name: req.body.name,
        amount: req.body.amount,
        date: (req.params.date) ? moment(req.params.date).format("LLLL") : moment(new Date()).format("LLLL"),
        group: req.body.group
    }
    const newExpense = new Expense(exp)
    newExpense.save().then(function () {
        console.log(`You spent ${newExpense.amount} shekels in ${newExpense.name} on ${newExpense.date}`);
    })
    res.end()
})

router.put('/update', function (req, res) {
    let group1 = req.body.group1
    let group2 = req.body.group2
    Expense.findOneAndUpdate(
        { group: group1 },
        { group: group2 },
        { new: true },
        function (err, res) {
            console.log(`changed ${res.name} from group ${group1} to ${group2}`)
            res.send(`changed ${res.name} from group ${group1} to ${group2}`)
        })
})

router.get('/expenses/:group', function (req, res) {
    let group = req.params.group
    Expense.find({ group: group }, function (err, expenses) {
        console.log(expenses)
    })
    Expense.aggregate([
        { $match: { group: group } },
        {
            $group: {
                _id: group,
                total: { $sum: "$amount" }
            }
        }
    ],
        function (err, res) {
            console.log("You spent " + res[0].total + " in " + group);
        })
})


// NOT WORKING
// router.get('/expenses', function (req, res) {
//     let d1 = moment(req.query.d1).format("YYYY-MM-DD")
//     let d2 =moment(req.query.d2).format("YYYY-MM-DD")
//     Expense.find({
//         date: {
//             $gte: d1,
//             $lt: d2
//             }
//         })
//         .exec(function (err, data) {
//             res.send(data);
//         })    
// })



module.exports = router

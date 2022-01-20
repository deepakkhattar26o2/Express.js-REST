const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const products = require('./api/routes/products')
const orders = require('./api/routes/orders')
const user = require('./api/routes/user')
// app.use((req, res, next)=>
// {
//     res.status(200).json({
//         message: 'It Works ig!!'
//     })
// }) 

mongoose.connect('mongodb://localhost/DMEN')

app.use(morgan('dev'))

app.use(bodyParser.json())

app.use( (req, res, next) => 
{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Authorization')
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', products)

app.use('/orders', orders)

app.use('/user', user)

app.use((req, res, next) =>{
    const error = new Error('Not Found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status||500)
    res.json({
        error:{
            message: error.message,
            status: `${error.status}`
        }
    })
})

module.exports = app;
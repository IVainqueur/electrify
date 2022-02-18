const bodyParser = require('body-parser')
const express = require('express')
const app =  express()
const mongo = require('mongoose')


//Middleware
app.use(express.static('public'))
app.use(bodyParser.json())
require('dotenv').config()



//Connecting to the database
mongo.connect(process.env.MONGO_CREDENTIALS, { useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
    if(err) return console.log(err)
    console.log('#ConnectedToDB')
})


//Important functions

async function newToken(){
    let tokenCode = ''
    for(let i= 1; i <= 8; i++){
        tokenCode += Math.floor(Math.random()*9)
    }
    let result = await require('./models/ml-token').findOne({code: tokenCode})
    console.log(result)
    if(result == null){
        return tokenCode
    }else{
        return newToken()
    }
}

app.get('/', (req, res)=>{
    res.sendFile(__dirname +"/public/index.html")
})
app.get('/check', (req, res)=>{
    res.sendFile(__dirname +"/public/check.html")
})
app.get('/validate', (req, res)=>{
    res.sendFile(__dirname +"/public/validate.html")
})

app.post('/buy', async (req, res)=>{
    console.log(req.body)
    /// Some calculation before
    //! GENERATE A RANDOM CODE
    let tokenCode = await newToken()
    //! CALCULATE THE TIME
    let now = new Date(Date.now())
    now = Date.now() - (now.getMilliseconds() + now.getSeconds()*1000 + now.getMinutes()*60*1000 + now.getHours()*60*60*1000)
    let expiryDate = now + ((req.body.amount/100)*24*60*60*1000)
    const tokenToSave = require('./models/ml-token')({
        code: tokenCode,
        userCode: req.body.number,
        price: req.body.amount,
        expiryDate: expiryDate
    })
    tokenToSave.save((err, doc)=>{
        if(err) return res.send({code: "#Error"})
        res.send({
            code: "#Success",
            toShow: {
                code: tokenCode,
                expiryDate
            }
        })
    })
    
})

app.post('/check', (req, res)=>{
    require('./models/ml-token').find({userCode: req.body.number}, (err, doc)=>{
        if(err) return res.send({code: "#Error"})
        if(doc.length == 0) return res.send({code: "#NoSuchAccount"})
        res.send({code: "#success", toShow: doc})
    })
})
app.post('/validate', (req, res)=>{
    require('./models/ml-token').findOne({code: req.body.number}, (err, doc)=>{
        if(err) return res.send({code: "#Error"})
        if(doc == null) return res.send({code: "#NoSuchToken"})
        res.send({code: "#success", toShow: doc})
    })
})

app.listen(process.env.PORT, (err)=>{
    if(err) return console.log("Something went wrong.")
    console.log("#ServerUP")
})

module.exports = app
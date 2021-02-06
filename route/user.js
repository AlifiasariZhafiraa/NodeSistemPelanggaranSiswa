const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const db = require("../config") //import konfigurasi database
const md5 = require("md5") //mengubah password menjadi format md5 
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post("/register", (req, res) => {
    let data = {
        email: req.body.email,
        username: req.body.username,
        password: md5(req.body.password)
    }

    let sql = "insert into user set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {message: error.message}
        }
        else {
            response = {message: "registrasi berhasil"}
        }
        res.json(response)
    })
})

app.post("/login", (req, res) =>{
    let data = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from user where username = ? and password = ?"

    db.query(sql, data, (error, result) => {
        if (error) throw error

        if (result.length > 0) {
            //user ada
            let payload = JSON.stringify(result[0].id_user)
            let token = jwt.sign(payload, SECRET_KEY)
            res.json({
                logged: true,
                data: result,
                token: token
            })
        }
        else {
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

module.exports = app
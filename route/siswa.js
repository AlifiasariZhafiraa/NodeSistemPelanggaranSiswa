const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /siswa --> end point untuk mengakses data siswa
app.get("/", (req,res) => {
    let sql = "SELECT s.id_siswa, s.nis, s.nama_siswa, s.kelas, s.jurusan, s.poin, " +
    "j.nama_jurusan, j.kepanjangan " +
    "FROM siswa s JOIN jurusan j ON s.jurusan = j.id_jurusan"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                siswa: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })    
})

app.get("/jurusan", (req,res) => {
    let sql = "SELECT * from jurusan"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                jurusan: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /siswa --> end point untuk pencarian data siswa
app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from siswa where id_siswa like '%"+find+"%' or nis like '%"+find+"%' or nama_siswa like '%"+find+"%' or kelas like '%"+find+"%' or jurusan like '%"+find+"%' or poin like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                siswa: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

// POST: /siswa/save --> end point untuk insert data siswa
app.post("/save", (req,res) => {
    let data = {
        id_siswa: req.body.id_siswa,
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        jurusan: req.body.jurusan,
        poin: req.body.poin
    }
    let message = ""

    let sql = "insert into siswa set ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row inserted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// POST: /siswa/update --> end point untuk update data siswa
app.post("/update", (req,res) => {
    let data = [{
        id_siswa: req.body.id_siswa,
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        jurusan: req.body.jurusan,
        poin: req.body.poin
    }, req.body.id_siswa]
    let message = ""

    let sql = "update siswa set ? where id_siswa = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row updated"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// DELETE: /siswa/:id_siswa --> end point untuk hapus data siswa
app.delete("/:id_siswa", (req,res) => {
    let data = {
        id_siswa : req.params.id_siswa
    }
    let message = ""
    let sql = "delete from siswa where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row deleted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

module.exports = app
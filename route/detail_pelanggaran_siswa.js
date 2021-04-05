const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /detail_pelanggaran_siswa/:id_pelanggaran_siswa --> end-point untuk menampilkan detail pelanggaran
app.get("/:id_pelanggaran_siswa", (req,res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query
    let sql = "select * from detail_pelanggaran_siswa dps join pelanggaran p "+
    "on p.id_pelanggaran = dps.id_pelanggaran where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})

// POST: /detail_pelanggaran_siswa --> end point untuk menambahkan detail_pelanggaran
app.post("/", (req,res) => {
    let data = {
        id_pelanggaran_siswa: req.body.id_pelanggaran_siswa,
        id_pelanggaran: req.body.id_pelanggaran
    }
    let message = ""

    let sql = "insert into detail_pelanggaran_siswa set ?"
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

// end-point untuk menghapus data detail_pelanggaran_siswa
app.delete("/:id_pelanggaran_siswa/:id_pelanggaran", (req, res) => {
    let data = [
        req.params.id_pelanggaran_siswa,
        req.params.id_pelanggaran
    ]

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where id_pelanggaran_siswa = ? and id_pelanggaran = ?"

    db.query(sql, data, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            res.json({message: "Data has been deleted"})
        }
    })
})

module.exports = app
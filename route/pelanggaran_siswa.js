const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
//inisialisasi library moment untuk menyimpan format date-time
const moment = require("moment")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /pelanggaran_siswa --> end-point menampilkan data pelanggaran siswa
app.get("/", (req,res) => {
    // create sql query
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa, p.waktu, s.nis, s.nama_siswa, p.id_user, u.username " +
     "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
     "join user u on p.id_user = u.id_user"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// POST: /pelanggaran_siswa/save --> end-point menambahkan data pelanggaran siswa 
app.post("/save", (req,res) => {
    // prepare data to pelanggaran_siswa
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss') // get current time
    }

    // parse to JSON
    let pelanggaran = JSON.parse(req.body.pelanggaran)
    // create query insert to pelanggaran_siswa
    let sql = "insert into pelanggaran_siswa set ?"
// run query
db.query(sql, data, (error, result) => {
    let response = null
    if (error) {
        res.json({message: error.message})
    } else {
        // get last inserted id_pelanggaran
        let lastID = result.insertId
        // prepare data to detail_pelanggaran
        let data = []
        for (let index = 0; index < pelanggaran.length; index++) {
            data.push([
                lastID, pelanggaran[index].id_pelanggaran
            ])                
        }
        // create query insert detail_pelanggaran
        let sql = "insert into detail_pelanggaran_siswa values ?"
        db.query(sql, [data], (error, result) => {
            if (error) {
                res.json({message: error.message})
            } else {
                res.json({message: "Data has been inserted"})
            }
        })
    }
})
})

// end-point untuk menghapus data pelanggaran_siswa
app.delete("/:id_pelanggaran_siswa", (req, res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
            // create sql query delete pelanggaran_siswa
            let sql = "delete from pelanggaran_siswa where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message})
                } else {
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })
})

module.exports = app
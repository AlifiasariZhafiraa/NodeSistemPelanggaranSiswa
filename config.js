//import library mysql
const mysql = require("mysql")

//inisialisasi database yang digunakan
const db = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "moklet_rest_api"
})

//lakukan koneksi database
db.connect(err => {
    if (err) console.log(err.message)
    else console.log("koneksi berhasil")
})

//export konfigurasi database
module.exports = db
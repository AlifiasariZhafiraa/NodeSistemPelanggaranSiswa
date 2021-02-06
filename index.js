//inisialisasi library
const express = require("express")
const app = express()

//import fungsi authorization auth
const auth = require("./auth")

//import route user
const user = require("./route/user")
app.use("/", user)

//import route pegawai
const pegawai = require("./route/pegawai")
app.use("/pegawai", auth, pegawai)

//membuat web server dengan port
app.listen(2910, () => {
    console.log("Server run on port 2910");
})

require("dotenv").config({path: __dirname + `/../../.env`});
import exec = require("./Executor")

var timeStamp = new Date().toISOString()
console.log("===start.....", timeStamp)
exec.run(console, timeStamp)
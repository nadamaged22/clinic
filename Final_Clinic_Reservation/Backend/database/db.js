const Pool = require("pg").Pool;
const pool = new Pool({
    user:'postgres',
    host:"db",
    database:'postgres',
    password:'nnn123nnn',
});
pool.on("connect", () => {
    console.log("Connected to DB Successfully!");
});
module.exports=pool
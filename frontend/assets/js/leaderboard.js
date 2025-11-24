const { writeDB, readDB } = require("./hardware/setup/db/db"); 

    let leaderboardText = document.getElementById("leaderboardText")
function main(){
let data = readDB()

for(score in data.score){
    console.log(score)
    leaderboardText.innerText += score
}}

module.exports = main
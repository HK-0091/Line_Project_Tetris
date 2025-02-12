let express = require('express');
let app = express();
let mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "c17st01",
    password: "Cc0VDRloLUXo07L9",
    database: "c17st01" 
});

app.locals.pretty = true;
app.set('view engine','pug');
app.set('views','./src/pug');
app.use(express.static('./public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));

app.get('/',(req,res)=>{
    con.connect((err)=>{
        if(err) throw err;
        console.log("CONNECT!");
        res.render('tetrisResult');
    })
});
app.post('/userDB',(req,res)=>{
        let userName = req.body.userName;
        let sql = `SELECT bestScore FROM gameUser WHERE id = '${userName}'`;
        con.query(sql,(err, result)=>{
            if(err) throw err;
            if(result[0]){
                let resultScore = result[0].bestScore;
                res.json({"userNameValue" : userName, "bestScoreValue" : resultScore});
            } else {
                let sql = `INSERT INTO gameUser VALUES('${userName}',0 ,0)`
                con.query(sql,(err, result)=>{
                    if(err) throw err;
                    sql = `SELECT bestScore FROM gameUser WHERE id = '${userName}'`;
                    con.query(sql,(err, result)=>{
                        if(err) throw err;
                        let resultScore = result[0].bestScore;
                        res.json({"userNameValue" : userName, "bestScoreValue" : resultScore});
                    });
                });
            }
        });
})
app.post('/score',(req, res)=>{
    let inputScore = req.body.inputScore;
    let userName = req.body.userName;
    let sql = `UPDATE gameUser SET score = ${inputScore} WHERE id = '${userName}'`;
    con.query(sql, (err, result)=>{
        if(err) throw err;
        let sql = `UPDATE gameUser SET bestScore = ${inputScore} WHERE id = '${userName}' AND bestScore <= score`;
        con.query(sql,(err, result)=>{
            if(err) throw err;
            let sql = `SELECT *, RANK() OVER(ORDER BY bestScore DESC)as rank FROM gameUser LIMIT 50`;
            con.query(sql,(err,result)=>{
                if(err) throw err;
                let idArray = [];
                let bestScoreArray = [];
                let scoreArray = [];
                let rankArray = [];
                let objectLength = Object.keys(result[0]).length;
                for(let i=0; i<result.length; i++){
                    idArray.push(result[i]['id']);
                    bestScoreArray.push(result[i]['bestScore']);
                    scoreArray.push(result[i]['score']);
                    rankArray.push(result[i]['rank']);
                }
                res.json({"idArray" : idArray, "bestScoreArray" : bestScoreArray, "scoreArray" : scoreArray, "rankArray" : rankArray});
            })
        })
    })
})
app.listen(4152,()=>{
    console.log('4152 PORT START!');
});
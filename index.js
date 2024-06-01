const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
let mysql = require('mysql');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
require('dotenv').config();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ruhulsDB',
});

connection.connect(
    (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('successfully connected');
        }
    }
);

app.use(
    cors({
        origin: [
            "http://127.0.0.1:5500/",
        ],
        credentials: true,
    })
);

app.get('/allusers', function (req, res) {

    var sql = 'select * from users';
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(res)
        res.send(result)
    })

})

app.get('/currentuser', function (req, res) {

    var sql = 'select * from currentuser';
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(res)
        res.send(result)
    })

})


app.get('/allusers/:email', function (req, res) {
    const email = req.params.email;
    // connection.connect((error)=>{
    //     if(error){
    //         console.log(error)
    //     }
    var sql = `select * from users where email='${email}'`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(res)
        res.send(result)
    })

    // })
});

//delete from  users table
app.delete('/deleteuser/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from users where id='${id}'`
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(res)
        res.send(result)
    })
})
//delete from current user table
app.delete('/deletecurrentuser', (req, res) => {
    const id = req.params.id;
    var sql = `delete from currentuser`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(result)
        res.send(result)
    })
})


// DB
app.post('/addcurrentuser', function (req, res) {
    console.log("here-----");

    const user = {
        email: req.body.email
    };

    console.log("user", user);

    var sql = `delete from currentuser`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(result)
        res.send(result)
    })

    connection.query(`INSERT INTO currentuser(email) VALUES ('${user.email}');`,
        function (err, result) {
            if (err) {
                console.log("err", err);
                res.json({
                    error: err.sqlMessage,
                })
            } else {
                console.log("result", result);
                // res.json({
                //     result: result,

                // })
            }
        }
    );
})

app.post('/updatedata/:id', (req, res) => {
    const paramId = req.params.id;
    const user = {
        fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
        image: req.body.image
    };
    console.log(user)
    const sql = `update users set fName="${user.fname}", lName="${user.lname}", birthDate="${user.dob}", gender="${user.gender}", password="${user.password}", image="${user.image}" where id=${paramId}`
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
        res.send(result)
    })
})

app.post('/adduser', function (req, res) {
    console.log("here-----");

    const user = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
        image: req.body.image
    };

    console.log("user", user);

    connection.query(`INSERT INTO users (fName, lName, gender, birthDate, email, password,image) VALUES ('${user.fname}', '${user.lname}', '${user.gender}', '${user.dob}','${user.email}', '${user.password}', '${user.image}');`,
        function (err, result) {
            if (err) {
                console.log("err", err);
                res.json({
                    error: err.sqlMessage,
                })
            } else {
                console.log("result", result);
                res.json({
                    result: result,

                })
            }
        }
    );
})


app.get('/', (req, res) => {
    res.send(`and the server is running on port ${port}`)
})

app.listen(port, () => {
    console.log(`and the server is running on port ${port}`)
})
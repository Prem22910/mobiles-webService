let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client} = require("pg");
let client = new Client({
  host : "db.oxqhyjwrehowfuwnehuo.supabase.co",
  user : "postgres",
  password : "mishra.empapp22",
  database : "postgres",
  port : 5432,
  ssl : {rejectUnauthorized : false},
});

client.connect(function(res,error) {
  console.log(`Connected!!!`);
});

app.get("/svr/employees",function(req,res,next) {
  console.log("Inside /employees Get API");
  const query = `SELECT * FROM employees;`;
  client.query(query,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});

app.get("/svr/employee/:empCode",function(req,res,next) {
  console.log("Inside /employee/:empCode Get API");
  let code = [+req.params.empCode];
  console.log(code);
  const sql = `SELECT * FROM employees WHERE empcode=$1`;
  client.query(sql,code,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});

app.get("/svr/employees/department/:dept",function(req,res,next) {
  console.log("Inside /employees/department/:dept Get API");
  let dept = [req.params.dept];
  const sql = `SELECT * FROM employees WHERE department=$1`;
  client.query(sql,dept,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});

app.get("/svr/employees/designation/:desg",function(req,res,next) {
  console.log("Inside /employees/designation/:desg Get API");
  let desg = [req.params.desg];
  const sql = `SELECT * FROM employees WHERE designation=$1`;
  client.query(sql,desg,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});

app.get("/svr/employees/gender/:gender",function(req,res,next) {
  console.log("Inside /employees/gender/:gender Get API");
  let gender = [req.params.gender];
  const sql = `SELECT * FROM employees WHERE gender=$1`;
  client.query(sql,gender,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});

app.post("/svr/employee",function(req,res,next) {
  console.log("Inside Post of /employee");
  let values = Object.values(req.body);
  console.log(values);
  const sql1 = `INSERT INTO employees (empcode,name,department,designation,salary,gender) VALUES ($1,$2,$3,$4,$5,$6);`;
  console.log(sql1);
  client.query(sql1,values,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      let id = [req.body.empCode];
      console.log(id);
      const sql2 = `SELECT * FROM employees WHERE empcode=$1;`;
      client.query(sql2,id,function(err,result) {
        if(err) {
          res.status(400).send(err);
        }else {
          res.send(result.rows);
        }
        return;
      });
    }
  });
});

app.put("/svr/employee/:empCode",function(req,res,next) {
  console.log("Inside Put of /employee/:empCode");
  let code = +req.params.empCode;
  let values = Object.values(req.body);
  console.log(values);
  let arr = [values[1],values[2],values[3],values[4],values[5],code];
  console.log(arr);
  const sql1 = `UPDATE employees SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empcode=$6;`;
  client.query(sql1,arr,function(err,result) {
    if(err) {
      res.status(400).send(err);
      return;
    }else {
      const sql2 = `SELECT * FROM employees WHERE empcode=$1`;
      client.query(sql2,[code],function(err,result) {
        if(err) {
          res.status(400).send(err);
        }else {
          res.send(result.rows);
        }
        return;
      });
    }
  });
});

app.delete("/svr/employees/:empCode",function(req,res,next) {
  console.log("Inside /employees/:empCode Delete API");
  let code = [+req.params.empCode];
  const sql = `DELETE FROM employees WHERE empcode=$1`;
  client.query(sql,code,function(err,result) {
    if(err) {
      res.status(400).send(err);
    }else {
      res.send(result.rows);
    }
    return;
  });
});
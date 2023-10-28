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
  host : "db.fdruvvcuubrbhtypfxcy.supabase.co",
  user : "postgres",
  password : "mishra.mobileapp22",
  database : "postgres",
  port : 5432,
  ssl : {rejectUnauthorized : false},
});

client.connect(function(res,error) {
  console.log(`Connected!!!`);
});

app.get("/svr/mobiles",function(req,res,next) {
  console.log("Inside /mobiles Get API");
  let query = req.query;
  console.log(query);
  let filters = {};
  if(query.brand) filters.brand = query.brand.split(',');
  if(query.ram) filters.ram = query.ram.split(',');
  if(query.rom) filters.rom = query.rom.split(',');
  console.log(filters);
  let sql = `SELECT * FROM mobData;`;
  client.query(sql,function(err,result) {
    if(err) res.status(400).send(err);
    else {
      // return res.send(result);
      let arr1 = result.rows.filter((mob) => {
        if (filters.brand) {
          if(filters.brand.length > 1) {
            let check = filters.brand.find((b1) => mob.brand === b1);
            return check;
          }else {
            return mob.brand === filters.brand[0];
          }
        }else {
          return mob;
        }
      });
      let arr2 = arr1.filter((mob) => {
        if (filters.ram) {
          if(filters.ram.length > 1) {
            let check = filters.ram.find((b1) => mob.ram === b1);
            return check;
          }else {
            return mob.ram === filters.ram[0];
          }
        }else {
          return mob;
        }
      });
      let arr3 = arr2.filter((mob) => {
        if (filters.rom) {
          if(filters.rom.length > 1) {
            let check = filters.rom.find((b1) => mob.rom === b1);
            return check;
          }else {
            return mob.rom === filters.rom[0];
          }
        }else {
          return mob;
        }
      });
      res.send(arr3);
    }
  });
});

app.get("/svr/mobile/:id",function(req,res,next) {
  console.log("Inside /mobile/:id Get API");
  let id = [+req.params.id];
  let sql = `SELECT * FROM mobData WHERE id=$1;`;
  client.query(sql,id,function(err,result) {
    if(err) res.status(400).send(err);
    else res.send(result.rows);
  });
});

app.post("/svr/mobile",function(req,res,next) {
  console.log("Inside Post of /mobile");
  let params = Object.values(req.body);
  let sql1 = `INSERT INTO mobData(name,price,brand,ram,rom,os) VALUES($1,$2,$3,$4,$5,$6);`;
  client.query(sql1,params,function(err,result) {
    if(err) res.status(400).send(err);
    else {
      let id = [params[0]];
      console.log(id);
      let sql2 = `SELECT * FROM mobData WHERE name=$1;`;
      client.query(sql2,id,function(err,result) {
        if(err) res.status(400).send(err);
        else res.send(result.rows);
      });
    }
  });
});

app.put("/svr/mobile/:id",function(req,res,next) {
  console.log("Inside Put of /mobile/:id");
  let id = +req.params.id;
  let values = Object.values(req.body);
  console.log(values);
  let arr = [values[1],values[2],values[3],values[4],values[5],values[6],id];
  let sql1 = `UPDATE mobData SET name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 WHERE id=$7;`;
  client.query(sql1,arr,function(err,result) {
    if(err) res.status(400).send(err);
    else {
      let sql2 = `SELECT * FROM mobData WHERE id=$1;`;
      client.query(sql2,[id],function(err,result) {
        if(err) res.status(400).send(err);
        else res.send(result.rows);
      });
    }
  });
});

app.delete("/svr/mobile/:id",function(req,res,next) {
  console.log("Inside /mobile/:id Delete API");
  let id = [+req.params.id];
  let sql = `DELETE FROM mobData WHERE id=$1;`;
  client.query(sql,id,function(err,result) {
    if(err) res.status(400).send(err);
    else {
      res.send(result.rows);
    }
  });
});

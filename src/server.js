require('dotenv').config();
var express = require('express')
var app = express()
app.use(express.json());
const bodyParser = require('body-parser')
app.listen(3000);
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const cors = require('cors');
app.use(cors())
app.get("/",(req,res)=>
{
    res.send('welcome')
}
)
const value = require('./mongoose')
const login = require('./data');
const { request } = require('http');
app.use(express.json())
app.post("/login",async (req,res)=>
{
    console.log(req.body.phoneNumber);
    console.log(req.body.password);

  try{
        const er = "Incorrect password"
        const accessToken="";
        const values = await value.findOne({phone:req.body.phoneNumber})
     //   const logval = await login.findOne({phone:req.body.phoneNumber})
        if(values)
        {
            console.log(values.pass);
            console.log(req.body.phoneNumber);
            console.log(req.body.password);
            const oneuser = {values};
            console.log("PPP");
            console.log(await bcrypt.compare(req.body.password,values.pass))
            if(await bcrypt.compare(req.body.password,values.pass)==true)
            { //const token = process.env.JWT_KEY
            // accessToken = jwt.sign(oneuser,token)
           // console.log("accessToken");
            const user = {values};
           const token = process.env.JWT_KEY
           console.log(token);
           const  accessToken = jwt.sign(oneuser,token)
            //  res.json(accessToken)
            // res.send(accessToken)
            res.json({accessToken:values.name,phone:values.phone})
            }
            else
            {res.json({accessToken:""})}
            
        }
        else
        //console.log("user  not exists");
        res.json({accessToken:"User not exists"});

    }
    catch(err)
    {
        (res.send(err))
    }
}
)
app.post("/usercheck",async (req,res)=>
{
    console.log(req.body.phoneNumber);
    try{
       var t;
       const values = await value.findOne({phone:req.body.phoneNumber})
       if(values)
       res.json({t:"1"});
       else
       res.json({t:"0"});


    }
    catch(err)
    {
        res.send(err)
    }

})
app.post("/register",async (req,res)=>
{
        
    try{
        // const oneuser = values
        // const token = process.env.JWT_KEY
     //   console.log(token)
      //  const accessToken = jwt.sign({oneuser},token)
 console.log("PPPP")
     const salt = await bcrypt.genSalt(10)
     const new_pass = await bcrypt.hash(req.body.password,salt)
    //  const bearerHeader = req.headers["authorization"];
    //    bearerHeader.value = "Bearer"+" "+{accessToken}
     //console.log(new_pass)
     var pin_inside = Math.floor(Math.random()*899999+100000);
     const values = new value ({
        name:req.body.name,
        mail:req.body.mail,
        phone:req.body.phoneNumber,
        pass:new_pass,
        pin : pin_inside,

    })    
    await values.save()
    
//   res.json({accessToken:accessToken})
   //res.json({pin_inside:pin_inside})
   res.json({pin:pin_inside});
     //res.json(accessToken)
     //res.send(accessToken)
     //res.send("ded")
    }
    catch(err)
    {
        res.send(err)
    }
}
)
app.get("/balcheck",async (req,res)=>
{
    console.log(req.query.params)
    var num = "+"+req.query.params.trim()
   // console.log(req.body)
    //console.log("PPFFSDfsf")
    console.log(num)
  //  const values = await value.findOne({phone:req.body.phoneNumber})
    const balval = await value.findOne({phone:num})
    if(balval)
     {console.log(balval.balance)
        const balance='';
        res.json({balance:balval.balance})}
     else
     res.send("ij")
     //res.send("ded")
})

app.post("/pinchange",async(req,res)=>
{
    const data = await value.findOne({phone:req.body.phoneNumber})
  //  console.log(data.pin)
    if(data.pin === req.body.oldpin)
    {
        console.log("opsodsp")
        await value.updateOne({phone:req.body.phoneNumber},{$set:{pin:req.body.newpin}})
        res.send({status:"1"})
    }
    else
    res.send({status:"0"})
})

app.post("/passchange",async(req,res)=>
{
    const data = await value.findOne({phone:req.body.phoneNumber})
    if(await bcrypt.compare(req.body.password,data.pass)==true)
    {
        const salt = await bcrypt.genSalt(10)
        const new_pass = await bcrypt.hash(req.body.password,salt)
        await value.updateOne({phone:req.body.phoneNumber},{$set:{pass:new_pass}})
        res.send({status:"1"})
    }
    else
    res.send({status:"0"})
})

app.post("/moneytranscheck",async(req,res)=>
{
    console.log(req.body.receiverphoneNumber)
    console.log(req.body.senderphoneNumber)
    const receiverdata = await value.findOne({phone:req.body.receiverphoneNumber})
    const senderdata = await value.findOne({phone:req.body.senderphoneNumber})
    var money
    if(receiverdata && senderdata)
    {
         if(senderdata.pin==req.body.pin)
         {
             res.send({money:"0"})
             console.log("pin is correct")
         }
         else
         {
             console.log("pin is incorrect")
             res.send({money:"1"})
         }
    }
    else
    {
        res.send({money:"-1"})
        console.log("receiver not exists")
    }

})

app.post("/moneytranssuc",async(req,res)=>
{
    const receiverdata = await value.findOne({phone:req.body.receiverphoneNumber})
    const senderdata = await value.findOne({phone:req.body.senderphoneNumber})
    const mon = req.body.amount
    const v = parseInt(receiverdata.balance)+parseInt(mon)
    const u = senderdata.balance-mon
    var action
    if(receiverdata && senderdata)
    {
       await value.updateOne({phone:req.body.receiverphoneNumber},{$set:{balance:v}})
       await  value.updateOne({phone:req.body.senderphoneNumber},{$set:{balance:u}})
        res.send({action:"1"})

    }
    else
    {
        res.send({action:"0"})
    }

})

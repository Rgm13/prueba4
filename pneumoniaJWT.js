const express=require("express");
const jwt= require("jsonwebtoken");

const app=express();



app.get("/api", (req, res)=>{
    res.json({
        mensaje:"Nodejs and JWT"
    });
});

app.post("/api/login", (req, res)=>{
    const user= {
        id:1,
        nombre: "Laura",
        email:"laura@email.com"
    }
    const pneumonia_stats=[
        {
            country: "france",
            year: 2019,
            ages_zero_fifty: 2,
            ages_fifty_seventy: 8,
            ages_seventy: 230
        },
        {
            country: "argentina",
            year: 2019,
            ages_zero_fifty: 21,
            ages_fifty_seventy: 71,
            ages_seventy: 835
        }
    
    ]

    jwt.sign({user, pneumonia_stats}, 'secretkey', {expiresIn:'50000s'},(err, token)=>{
        res.json({
            token
        })

    });
});

app.post("/api/posts", verifyToken, (req, res)=>{
    jwt.verify(req.token, 'secretkey', (error, authData, pneumonia_stats)=>{
        if(error){
            res.sendStatus(403);
        }else{
            res.json({
                mensaje:"Post fue creado",
                authData,
                pneumonia_stats
            });
        }
    });
});

//Authorization: bearer<token>
function verifyToken(req, res, next){
    const bearerHeader= req.headers['authorization'];
    if(typeof bearerHeader!=='undefined'){
        const bearerToken =bearerHeader.split(" ")[1];
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }


}

app.listen(3000, function(){
    console.log("nodejs app running...");
});
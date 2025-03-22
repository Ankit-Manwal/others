const express = require("express");

const  app= express();

// console.dir(app);

let port=3000;
app.listen(port, ()=>{
    console.log("app listening to port ", port);
    
});


// differnt routes
app.get("/" ,(req, res)=>{
        res.send("you contacted root") 
});

app.get("/apple" ,(req, res)=>{
    res.send("you contacted   apple") 
});

app.get("/orange" ,(req, res)=>{
    res.send("you contacted orange") 
});


//else route- wrong one
app.get("*" ,(req, res)=>{
    res.send("you contacted wrong") 
}); 



//     //listen every request
// app.use((req, res)=>{
//     console.log("request receieved");  
//     res.send("hhbhh")
// });
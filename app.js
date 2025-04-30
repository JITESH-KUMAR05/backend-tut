const express = require('express');
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use((req,res,next) => {
    console.log("This is middleware function");
    let a = 10;
    let b  = 20;
    let c = a+b;
    console.log("the sum of a and b is : " + c);
    return next();
})

app.get('/', (req,res) =>{
    console.log("Running successfully");
    res.render("index");
})

app.get('/about',(req,res) =>{
    res.send('About page');
})

app.get('/contact',(req,res) =>{
    res.send("Contact page");
})
app.listen(3000);
const express = require('express');
const app = express();
require('./db');
require('./auth');

const router = require('./router');
const mongoose = require('mongoose');
const job = mongoose.model('Job');
const user = mongoose.model('User');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname,'public');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});
app.use(express.static(publicPath));



app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/',router);

app.get('/', (req,res) =>{
    if (!req.user) {
        console.log('User not logged in!');
        res.redirect('/login');
    } 
    else{
    res.redirect('/home');    
    }
    });

app.get('/home', (req,res) =>{
    if (req.user){
        user.findOne({username:req.user.username},(err,data)=>{
            console.log(data);
            res.render('home', {Jobs: data.jobs});        
    
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.post('/home',(req,res)=>{
    user.findOne({username:req.user.username},(err,data)=>{
        data.jobs.push(
            new job({
            "company": req.body.company,
            "position": req.body.position,
            "status": req.body.status,
            "date": req.body.date,
            "link": req.body.link}
        ));

    
    data.save((err) =>
    {
        res.redirect('/home');
    });
    });
});
app.get('/todo', (req, res) => {
    if (req.user){
        user.findOne({username:req.user.username},(err,data)=>{
            const todo = data.jobs.filter(item=> item.status === 'Todo');
            res.render('todo',{Jobs:todo});
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/todo',(req,res)=>{
    user.findOne({username:req.user.username},(err,data)=>{
        data.jobs.push(
            new job({
            "company": req.body.company,
            "position": req.body.position,
            "status": req.body.status,
            "date": req.body.date,
            "link": req.body.link}
        ));

    
    data.save((err) =>
    {
        res.redirect('/todo');
    });
    });
});
app.post('/todo/update', (req, res)=>{
    if(req.body.toUpdate){
        user.findOne({username:req.user.username},(err,data)=>{
            if (Array.isArray(req.body.toUpdate)){
                req.body.toUpdate.map((toUpd)=> {
                    const jobToUpd = data.jobs.filter(item => String(item._id) === toUpd)[0];
                    data.jobs.push(
                        new job({
                        "company": jobToUpd.company,
                        "position": jobToUpd.position,
                        "status": 'Applied',
                        "date": jobToUpd.date,
                        "link": jobToUpd.link}
                    ));

                    data.jobs = data.jobs.filter(item => String(item._id) !== toUpd);
                                      
                });
            }

            else{
                const jobToUpd = data.jobs.filter(item => String(item._id) === req.body.toUpdate)[0];
                data.jobs.push(
                    new job({
                    "company": jobToUpd.company,
                    "position": jobToUpd.position,
                    "status": 'Applied',
                    "date": jobToUpd.date,
                    "link": jobToUpd.link}
                ));
                    data.jobs = data.jobs.filter(item => String(item._id) !== req.body.toUpdate);

            }
        console.log(data.jobs);
        data.save((err) =>
        {
            res.redirect('/todo');
        });
    });
    }
    else{
        res.redirect('/todo');
    }
});

app.get('/applied', (req, res) => {
    if (req.user){
        user.findOne({username:req.user.username},(err,data)=>{
            const applied = data.jobs.filter(item=> item.status === 'Applied');
            res.render('applied',{Jobs:applied});
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/applied',(req,res)=>{
    user.findOne({username:req.user.username},(err,data)=>{
        data.jobs.push(
            new job({
            "company": req.body.company,
            "position": req.body.position,
            "status": req.body.status,
            "date": req.body.date,
            "link": req.body.link}
        ));

    
    data.save((err) =>
    {
        res.redirect('/applied');
    });
    });
});

app.post('/applied/delete', (req, res)=>{
    if(req.body.toDelete){
        user.findOne({username:req.user.username},(err,data)=>{
            if (Array.isArray(req.body.toDelete)){
                req.body.toDelete.forEach((toDel)=> {
                    console.log(toDel);
                    data.jobs = data.jobs.filter(item => String(item._id) !== toDel);                    
                });
            }

            else{
                console.log(req.body.toDelete);
                data.jobs = data.jobs.filter(item => String(item._id) !== req.body.toDelete);
            }
        console.log(data.jobs);
        
        data.save((err)=>{
            res.redirect('/applied');
        });    
    });
    }
    else{
        res.redirect('/applied');
    }
});




app.post('/delete', (req, res)=>{
    if(req.body.toDelete){
        user.findOne({username:req.user.username},(err,data)=>{
            if (Array.isArray(req.body.toDelete)){
                req.body.toDelete.forEach((toDel)=> {
                    console.log(toDel);
                    data.jobs = data.jobs.filter(item => String(item._id) !== toDel);                    
                });
            }

            else{
                console.log(req.body.toDelete);
                data.jobs = data.jobs.filter(item => String(item._id) !== req.body.toDelete);
            }
        console.log(data.jobs);
        
        data.save((err)=>{
            res.redirect('/home');
        });    
    });
    }
    else{
        res.redirect('/home');
    }
});

    


app.listen(process.env.PORT || 3000);    
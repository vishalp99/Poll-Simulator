const express = require("express");
const path = require('path');
const hbs  = require('hbs');

let candidates = [];
let votes = new Set();
let totalcandidate = 0;
const app = express();

// PORT
const PORT = process.env.PORT || 4000;

app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get('/',function(req,res){
  res.render('index');
});

app.get('/addCandidates',function(req,res){
  res.render('addCandidates',{cans: candidates});
});

app.post('/add',function(req,res){
    candidates.push({name:req.body.name, votes:0});
    totalcandidate++;
    res.redirect('addCandidates');
});

app.get('/vote',function(req,res){
  res.render('vote',{cans: candidates, msg:""});  
});

app.post('/votecount', function(req,res){
    if(votes.has(req.body.id)){
        res.render('vote',{cans: candidates, msg: "Sorry ! you can vote only once"});
    }
    else {
        votes.add(req.body.id);
        for(let i = 0; i< totalcandidate; i++){
            if(candidates[i].name == req.body.vote){
                candidates[i].votes++;
            }
        }
        res.render('vote',{cans: candidates, msg: "Thank you for voting"});
        
    }
});

app.get('/pollresult',function(req,res){
if(candidates.length == 0){
    res.redirect("/");
}
 let max=0,maxv1=0,maxv2=0,runner=0;

 for(let i=0;i<totalcandidate;i++){
     if(candidates[i].votes > maxv1){
         maxv2 = maxv1;
         runner = max;
         maxv1 = candidates[i].votes;
         max = i;
     } else if(candidates[i].votes > maxv2 && candidates[i].votes < maxv1){
        maxv2 = candidates[i].votes;
        runner = i;
     }
 }
 let result = [];
 result.push({name: candidates[max].name, votes: candidates[max].votes});
 result.push({name: candidates[runner].name, votes: candidates[runner].votes});
 res.render('pollresult',{ress: result});
});

app.get('/votingsummary', function(req,res){
   res.render('votingsummary',{cans: candidates});
});

(async function runServer(){
    //connecting to the node server
    await app.listen(PORT);
    console.log(`Server Started at PORT ${PORT}`);
})();
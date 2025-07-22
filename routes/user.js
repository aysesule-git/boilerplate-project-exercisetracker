const express = require("express");
const router = express.Router();
const {User, Exercise} = require("../models/schemas")


router.post("/", function(req, res){
    const usernameF = req.body.username;
    let currUser = new User({username: usernameF});
    currUser.save(function(err, data){
        if(err){
            console.log("so we couldnt save that user", err);
            return;
        }else{
            console.log("thank you kanye very cool");
            res.json({username: usernameF, _id: data._id});
        }
    })
    
});


router.get("/", function(req, res){
    //connect to db and get all the users
    //use find with empty param {} i'm very smart
    return User.find({}, function(err, data){
        if(err){
            console.log("where's the crowd");
            return;
        }else{
            console.log("a million likes or something");
            return res.json(data);;
        }
    });
});


router.post("/:_id/exercises", function(req, res){
    //create an exercise if no date its current date
    let currUser;
    findUser(req.params._id, (err, data) => {
        console.log("called by exercises findUser")
        if(err){
            return res.json({error: "errrrrrrr!"});
        }else{
            currUser = data.username;

            let currDate;
            if(!req.body.date){
                currDate = new Date();
            }else{
                currDate =  new Date(req.body.date);
            //console.log(currDate.toDateString(), "did it work");
            }

            const exerc = new Exercise({
                userID: req.params._id,
                description: req.body.description,
                duration: req.body.duration,
                date: currDate
            });

            exerc.save(function(err, data){
                if(err){
                    console.log("aint no way you did all that");
                    return res.json({blüdhaven: "exploded"});
                    
                }else if(data){
                    console.log("write it down write it down");
                    console.log(currUser);
                    return res.json({
                        _id: req.params._id,
                        username: currUser,
                        date: currDate.toDateString(),
                        duration: Number(req.body.duration),
                        description: req.body.description,
                    });
            
                }
            });
        }
    })

});

router.get("/:_id/logs", function(req, res){
    findUser(req.params._id, function(err, data){

        if(err){

            return res.json({"error": "couldnt find em for som reason"})

        }else{
            const currUser = data.username;
            let filter = {userID: req.params._id}
            let dateFilter = {};
            
            if(req.query.from){

                dateFilter.$gte = new Date(req.query.from);
                if(req.query.to) dateFilter.$lt = new Date(req.query.to);
                filter.date = dateFilter;

            };
            //console.log(filter);
            let query = Exercise.find(filter).sort("date");

            if(req.query.limit){
                query = query.limit(Number(req.query.limit));
                console.log("limit exists");
            }

            query.exec(function(err, data){
                if(err){
                   return res.json({"error": "something's wrong i can feel it"});
                }else{
                    //console.log(data);
                    let count = data.length;
                    let formatted = data.map((item) => {
                        return {
                            description: item.description,
                            duration: item.duration,
                            date: item.date.toDateString()
                        }
                    })
                    return res.json({
                        username: currUser,
                        count: count,
                        _id: req.params._id,
                        log: formatted
                    });
                }
            })
        }
    });
    
});

const findUser = (id, done) =>{
    return User.findOne({_id: id}, function(err, data){
        if(err){
            console.log("gym system downnn");
            return done(err);
        }else if(!data){
            console.log("no one here with that id");
            return done(new Error("No such user"));
        }else{
            console.log("ladies and gentlemen we got him")
            return done(null, data);
        }
        
    });
}



module.exports = router;
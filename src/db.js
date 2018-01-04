const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Job = new mongoose.Schema({
    company: String,
    position: String,
    status: String,
    date: String,
    link: String
});

const UserSchema = new mongoose.Schema({
    userID: String,
    jobs: [Job],
});
UserSchema.plugin(passportLocalMongoose);


mongoose.model('Job', Job);

mongoose.model('User', UserSchema);

let dbconf;
// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);
   
    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
   } else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/finalProject';
   }

   mongoose.connect( dbconf );
///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

var express = require('express');
var router = express.Router();
import ReadDataFiles = require('../helper_class/ReadDataFiles');
import Parking = require('../class/Parking');
import AccountManager = require('../helper_class/AccountManager');
import Geocoder = require('../helper_class/Geocoder');

class Router {

    constructor() {
        //Initialize AccountManager and create an admin
        var adminname:string = 'aname';
        var adminpwd:string = 'apassword';
        var accmgr = new AccountManager;
        accmgr.createAdmin('aname','apassword');
        
        /* GET home page. */
        router.get('/', function(req, res){
            var db = req.db;
            var collection = db.get('parkingcollection');

            collection.find({'type':'Bike'},{},function(berr,Bikes){
                collection.find({'type':'Motorcycle'},{},function(merr,Motorcycles){
                    collection.find({'type':'Disability'},{},function(derr,Disabilities){
                        res.render('index', {"Bikes":Bikes,"Motorcycles":Motorcycles,"Disabilities":Disabilities});
                    });
                });
            });
        });

        /* POST Update Database */
        router.post('/updatedatabase', function(req, res) {
            var permission:boolean = accmgr.authenticate('admin');
            if (!permission){
                res.send('You Need to Have Administrator Permission');
            }
            var db = req.db;
            var collection = db.get('parkingcollection');
            //read in data from csv files to database
            new ReadDataFiles(collection);
            res.redirect('/');
        });
        
        /* POST Update LatLng */
        router.post('/updatelatlng', function(req, res) {
            var permission:boolean = accmgr.authenticate('admin');
            if (!permission){
                res.send('You Need to Have Administrator Permission');
            }
            var db = req.db;
            var collection = db.get('parkingcollection');
            //convert all addresses in db to lat lng
            new Geocoder(collection);
            res.redirect('/');
        });
        
        /* GET Hello World page. */
        router.get('/helloworld', function(req, res) {
            res.render('helloworld', { title: 'Hello, World!' });
        });

        /* GET Login page. */
        router.get('/loginpage', function(req, res){
            res.render('loginpage', { title: 'Please Log in to Process' });
        });
        
        /* Validate Log In Information. */
        router.post('/userlogin', function(req, res){
            var myUsername = req.body.username;
            var myPassword = req.body.password;
            var db = req.db
            var collection = db.get('usercollection');
            
            collection.find({username:myUsername,password:myPassword},{},function(err,acc){

                if(myUsername==adminname && myPassword==adminpwd){
                    accmgr.login(myUsername,myPassword);
                    res.redirect('/');
                }
                
                else if(acc==null||acc==''){
                    console.log('username or password is incorrect');
                    res.send('The Username or Password Given is Incorrect or Not Found');
                }else{
                    console.log('account identity varified');
                    accmgr.login(myUsername,myPassword);
                    res.redirect('/profilepage');
                }   
            });
        });
        
        /* Get Profile Page */
        router.get('/profilepage',function(req,res){

            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({'username':accmgr.getUsername()},{},function(e,docs){
                //if user try to access this page without logging in, send err
                if (docs[0]==null){
                    res.send('This page is not available, Please log in');
                }else{
                    //cipher password before passing it to front end
                    var user=docs[0];
                    var password:string = '';
                    var plength:number = (''+docs[0].password).length;
                    for(var i=0;i<plength;i++){
                        password=password.concat('*');
                    }
                    user.password=password;
                    res.render('profilepage', {
                        "user" : user 
                    });
                    }
            });
            
        });
        
        /* Post User Information Update */
        router.post('/updateuser',function(req,res){

            var newname:string = req.body.username;
            var newpwd:string = req.body.password;
            var pwdconfirmation:string = req.body.pwdconfirmation;
            var db = req.db;
            var collection = db.get('usercollection');
            //if a new name is found
            if (newname!=''){
                collection.find({'username':newname},{},function(e,docs){
                    //if username taken, send err
                    if (docs[0]!=null){
                        res.send('This name is taken, please try another name');
                    }else{
                        collection.update({'username':accmgr.getUsername()},
                            {$set:{'username':newname}}
                        )
                        accmgr.setUsername(newname);
                    }
                });
            }
            //if a new password is found
            if (newpwd!=''){
                if (newpwd==pwdconfirmation){
                    collection.update({'username':accmgr.getUsername()},
                                {$set:{'password':newpwd}}
                    )
                    accmgr.setPassword(newpwd);
                    res.redirect('/profilepage');
                }else{
                    res.send('New Password Cannot be Confirmed, Please make Sure it is Properly Entered');
                }
            }
            //if no new name or password is found, redirect back to profile page
            res.redirect('profilepage');
            
        });
        
        /* GET Logout page. */
        router.get('/logoutpage', function(req, res){
            accmgr.logout();
            res.render('logoutpage');
        });
        /* GET New UserAccount Page*/
        router.get('/newaccountpage', function(req, res){
            res.render('newaccountpage', { title: 'Yay Free Membership!' });
        });
        
        /* Set Up New Account */
        router.post('/addaccount', function(req, res){
            var myUsername = req.body.username;
            var myPassword = req.body.password;
            var db = req.db
            var collection=db.get('usercollection');
            
            collection.findOne({username:myUsername,password:myPassword},{},function(e,acc){
                if(acc==null || acc==''){
                    console.log('username not taken');
                    accmgr.createAccount(myUsername,myPassword,collection);
                    res.redirect('/');
                }else{
                    console.log('username has already been taken');
                    res.send('Initialization Failure: username has been taken or is not available');
                }
            });
        });
        
        /* GET Userlist page. */
        router.get('/userlist', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({},{},function(e,docs){
                res.render('userlist', {
                    "userlist" : docs
                });
            });
        });


        /* GET Parking List page. */
        router.get('/parkinglist', function(req, res) {
            // extracting the "db" object we passed to our http request
            var db = req.db;
            var collection = db.get('parkingcollection');
            // do a find and return the results as the variable "docs"
            collection.find({},{},function(e,docs){
                res.render('parkinglist', {
                    "parkinglist" : docs 
                });
            });
        });
        
        //Get Edit Parking Page
        router.get('/editparkingpage', function(req, res) {
            var permission:boolean = accmgr.authenticate('admin');
            if (!permission){
                res.send('You Need to Have Administrator Permission to Modify Parking Information');
            }
            res.render('editparkingpage', { title: 'Add, Modify, or Delete Parking Lot' });
            res.redirect("editparkingpage");
        });
    
        /* POST to Edit Parking Lot Service */
        router.post('/editparking', function(req, res) {
            var db = req.db;
            var collection = db.get('parkingcollection');
            
            var action = req.body.actiontype;
            var newType = req.body.type;
            var newAddress = req.body.address;
            var newSpace = req.body.space;

            switch(action){
                case 'add':
                    collection.insert({
                    "type" : newType,
                    "address" : newAddress,
                    "space" : newSpace
                }, function (err, doc) {
                    if (err) {res.send("There was a problem adding the information to the database.");}
                    else {
                        console.log('Parking Lot Add Successful');
                        res.redirect("parkinglist");
                    }
                });
                break;
                
                case 'update':
                    collection.update({type:newType,address:newAddress},{
                        $set: {"space":newSpace}
                    });
                    res.redirect("parkinglist");
                    console.log('Parking Lot updated Successful');
                break;
                
                case 'delete':
                    collection.remove({type:newType,address:newAddress,space:newSpace});
                    collection.find({type:newType,address:newAddress,space:newSpace},{},function(err,doc){
                        if (err||doc==''){
                            console.log('Parking Lot Remove Successful');
                            res.redirect("parkinglist");
                        }
                        else{
                            res.send("There was a problem removing the information to the database.");
                            console.log('the item is:'+ doc+'length');
                        }
                    });
                break;
                
                default:
                    res.send("There was a problem with editparking HTTP call.");
            }
        });

        /* GET New Parking page. */
        router.get('/newparking', function(req, res) {
            var permission:boolean = accmgr.authenticate('user');
            if (!permission){
                res.send('Please Log In as A User to Upload Parking Information');
            }else
            res.render('newparking', { title: 'Add a  New Parking Lot' });
            res.redirect("newparking");
        });
        
        /* POST to Add Parking Lot Service */
        router.post('/addparking', function(req, res) {
            //var parking:Parking = new Parking(a, a, 1);

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var type = req.body.type;
            var address = req.body.address;
            var space = req.body.space;

            // Set our collection
            var collection = db.get('parkingcollection');

            // Submit to the DB
            collection.insert({
                "type" : type,
                "address" : address,
                "space" : space
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    res.redirect("parkinglist");
                }
            });
        });

         module.exports = router;
        console.log('new Router is created');
    }

}
var router_obj = new Router();
module.exports = router;


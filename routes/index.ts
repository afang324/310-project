///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

var express = require('express');
var router = express.Router();
import ReadDataFiles = require('../helper_class/ReadDataFiles');
import Parking = require('../class/Parking');
import Geocoder = require('../helper_class/Geocoder');

class Router {

    constructor() {
        
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
            var db = req.db;
            var collection = db.get('parkingcollection');
            //read in data from csv files to database
            new ReadDataFiles(collection);
            res.redirect('/');
        });
        
        /* POST Update LatLng */
        router.post('/updatelatlng', function(req, res) {
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


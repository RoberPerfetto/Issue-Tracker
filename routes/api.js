/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) console.log("Error:" + err);
        console.log("Connection suscefull");
        db.collection('projects').findOne({issue_title: project}, (err,doc) => {
          if(err) console.log("Error: " + err);
          db.close();
          res.send(doc);
        });
      });
    })
    
    .post(function (req, res){
      //var project = req.params.project;
      var project = req.body;
      var issueData = {
        issue_title: project.issue_title, 
        issue_text: project.issue_text, 
        created_by: project.created_by, 
        assigned_to: project.assigned_to || '',
        status_text: project.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true 
      } 
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) console.log("Error:" + err);
        db.collection('projects').findOne({issue_title: issueData.issue_title}, (err,doc) => {
          if(!doc) { 
            db.collection('projects').insertOne(issueData, (err,doc1) => {
              if(err) console.log("Error: " + err);
              res.json(doc1.ops[0]);
              db.close();
            });
          } else {
            res.json({error: "Issue already exists"});
          }
        });
      });
    })
    
    .put(function (req, res){
      var project = req.body;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) console.log(err);

        var toUpdate = {}
        if(project.issue_title !== '') toUpdate.issue_title = project.issue_title;
        if(project.issue_text !== '') toUpdate.issue_text = project.issue_text;
        if(project.created_by !== '') toUpdate.created_by = project.created_by;
        if(project.assigned_to !== '') toUpdate.assigned_to = project.assigned_to;
        if(project.status_text !== '') toUpdate.status_text = project.status_text;
        if(project.open) {
          toUpdate.open = true;
        } else {
          toUpdate.open = false;
        }
        toUpdate.updated_on = new Date(),

        db.collection('projects').findAndModify( 
          {_id: ObjectId(project._id)},
          {rating: 1},
          {$set: toUpdate}, 
          function (err,doc) {
            if(err) console.log("Error: " + err);
            res.json(doc);
            db.close();
          }
        );
      });
    })
      
    .delete(function (req, res){
      var project = req.body;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) console.error(err);
        if(project._id !== '' && project._id.length >= 12) {
          db.collection('projects').remove({_id: ObjectId(project._id)}, (err,doc) => {
            if(err) {
              console.error(err);
              db.close();
              res.json(err);
            } else {
              db.close();
              res.json(doc);
            }
          });
        } else {
          //res.json({error:'_id error', success: 'deleted '+_id, failed: 'could not delete '+_id});
          res.json({error: 'Invalid ID'});
        }
      });
    });
};
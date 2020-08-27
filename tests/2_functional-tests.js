/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.ok, true);
          assert.isObject(res.body);
          //assert.equal(res.type, 'application/json');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'test',
          issue_text: 'text 2',
          created_by: 'Functional Test - Required field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.ok, true);
          assert.equal(res.type, 'application/json');
          done();
        }); 
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({            
            issue_text: 'text 2',
          })
          .end(function(err, res) {
            assert.equal(res.text, "Required fields are empty");
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({            
            
          })
          .end(function(err, res) {
            assert.equal(res.text, "Empty id field");
            done();
          });        
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/Title%20updated')
        .send({
          _id: '5f3e6ffd96d4a455949cf007',
          issue_title: 'Title updated'         
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.ok, true);
          assert.equal(res.text, 'successfully updated');
          done();
        }); 
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/Title%20updated')
        .send({
          _id: '5f3e6ffd96d4a455949cf007',
          issue_title: 'Title updated',
          issue_text: 'Multiple fields to update',
          created_by: 'Functional Test - Multiple fields to update'         
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.ok, true);
          assert.equal(res.text, 'successfully updated');
          done();
        }); 
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.isArray(res.body);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text: "text 2"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text: "text 2",
                created_by: "Functional Test - Required field filled in",
                issue_title: "test",
                open: true
              })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "Empty id field");
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: '5f472d214844000c9811320c'})
        .end(function(err, res){
          assert.isObject(res.body);          
          assert.property(res.body,'n');
          assert.property(res.body,'opTime');
          assert.property(res.body,'ok');
          assert.property(res.body,'operationTime');
          done();
        });       
      });
      
    });
});

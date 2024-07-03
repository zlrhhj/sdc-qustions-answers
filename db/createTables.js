const {client} = require('./db.js');
const fs = require("fs");
const path = require("path");

const executeSchema = () => {
  client.connect()
    .then(()=>{
      console.log('Connected to PostgreSQL');

      //read schema.sql

      const schemaPath = path.join(__dirname,'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      //Execute the SQL commands
      console.log(schema);
      return client.query(schema);
    })
    .then(()=>{
      console.log('Schema created successfully');
    })
    .catch((err) => {
      console.error('Error executing schema:', err.stack);
    })
    .finally(()=>{
      //close the postpreSQL connection
      client.end()
        .then(() => {
          console.log('Disconnected from postPreSQL');
        })
        .catch((err)=>{
          console.error('Error disconnecting:', err.stack);
        })
    });

};

executeSchema();
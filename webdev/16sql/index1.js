// CJS
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

// //fake data
// let  getRandomUser=  ()=> {
//   return {
//     id: faker.string.uuid(),
//     username: faker.internet.username(), 
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };
// };


// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '#mysql@123'
});




// //insert new data
// let que= " INSERT INTO user (id, username, email, password) VALUES (? ,?, ?, ?) ";
// let user= ['123', "123_newuser" , 'newuser@gmail.com', 'abc'];

// //connection to sql and query
// try{
//     connection.query(que, user , (err, result)=>{
//         if(err) throw err;
//         console.log(result);  //result -array
//     });
// }
// catch(err){
//     console.log(err);
// }


// //insert new data
// let que= " INSERT INTO user (id, username, email, password) VALUES ? ";
// let user= [['123a', "123a_newuser" , 'anewuser@gmail.com', 'aabc'],
//           ['123b', "123b_newuser" , 'bnewuser@gmail.com', 'abbc']];

// //connection to sql and query
// try{
//     connection.query(que, [user] , (err, result)=>{
//         if(err) throw err;
//         console.log(result);  //result -array
//     });
// }
// catch(err){
//     console.log(err);
// }


//fake data for hundred user
let  getRandomUser=  ()=> {
    return [
      faker.string.uuid(),
      faker.internet.username(), 
      faker.internet.email(),
      faker.internet.password(),
    ];
};

let que= " INSERT INTO user (id, username, email, password) VALUES ? ";
let data=[];
for (let i = 0; i <= 100; i++) {
   data.push(getRandomUser());
}

//connection to sql and query
try{
    connection.query(que, [data] , (err, result)=>{
        if(err) throw err;
        console.log(result);  //result -array
    });
}
catch(err){
    console.log(err);
}

connection.end();
// function hello(){
//   console.log("inside");
//   console.log("hello");
// }

// function demo(){
//   console.log("call hello");
//   hello();
// }

// console.log("calling demo");
// demo();







//*********************************************************************** */
// function savetoDb(data, success, failure) 
// {
//   let internetSpeed = Math.floor(Math.random() * 10) + 1;
//   if (internetSpeed > 4) {
//      success();
//   } 
//   else {
//      failure();
//   }
// }



// // callback hell
// savetoDb(
//     " dataaaa",
//     () => {
//       console.log("success: your data was saved");
//       savetoDb(
//                 "hello world",
//                 () => {
//                         console.log("success2: data2 saved");
//                       },
//                 () => {
//                         console.log("failure2: weak connection");
//                     }
//               );
//           },
//           () => {
//                     console.log("failure: weak connection. data not saved");
//                   }
//     );
//***************************************************************************** */
  







//PROMISE***********************************************************************
function savetoDb(data) {
  return new Promise((resolve, reject) => {
    let internetSpeed = Math.floor(Math.random() * 10) + 1; 
    if (internetSpeed > 4) {
      resolve("success: data was saved");
    } else {
      reject("failure: weak connection");
    }
  });
}

//let request =  savetoDb("apna college") // // req = promise object   or  savetoDb("apna college").then
//   request 
//   .then(() => {
//      console.log("data1 saved");
//      savetoDb("apna college") // req = promise object  
//          .then(() => {
//           console.log("data2 saved ");
//         });
//   })
  
//   .catch((error) => {
//       console.log("promise was rejected:", error);
//   });
         
                     // OR

savetoDb("apna college")
  .then((message) => {
    console.log("data1 saved:", message);      // message=resolve("success: data was saved");
    return savetoDb("hello world");
  })
  .then((message) => {
    console.log("data2 saved ",message);
  })
   .catch((error) => {
    console.log("promise was rejected:", error);   // error=reject("failure: weak connection");
  });





  /******************************************************************************** */

  // await and sync
  function getNum() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let num = Math.floor(Math.random() * 10) + 1;
        console.log(num);
        resolve(num); // Resolve with the generated number
      }, 1000);
    });
  }
  
  async function demo() {
    await getNum(); // Wait for the first number
    await getNum(); // Wait for the second number
    getNum(); // This one runs without waiting
  }
  
  demo();













  /*********************************************************************************** */
  function changeColor(color, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        h1.style.color = color;
        resolve("color changed!");
      }, delay);
    });
  }
  
  changeColor("red", 1000)
    .then(() => {
      console.log("red color was completed");
      return changeColor("orange", 1000);
    })
    .then(() => {
      console.log("orange color was completed");
      return changeColor("green", 1000);
    })
    .then(() => {
      console.log("green color was completed");
      return changeColor("blue", 1000);
    })
    .then(() => {
      console.log("blue color was completed");
    });

 
    
    //or


    function changeColor(color, delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          h1.style.color = color;
          console.log(`color changed to ${color}!`); // Correct use of template literal
          resolve("color changed!");
        }, delay);
      });
    }
    
    async function demo() {
      await changeColor("red", 1000);     // Wait for red
      await changeColor("orange", 1000);  // Wait for orange
      await changeColor("green", 1000);   // Wait for green
      await changeColor("blue", 1000);    // Now, we wait for blue as well
    }
    
    demo();
//************************************************************************************************ */
const expressError = require("./expressErrors");

let f = (fn) => {
    return (req, res, next) => {
        console.log("\n******Expresserror****\n");
        fn(req, res, next).catch(next);
    };
};

module.exports = f;


// return (...args) 

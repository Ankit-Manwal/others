const mongoose = require("mongoose");
const {Schema}=mongoose;

// Connect to MongoDB
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationalDemo");
  }
  
  main()
    .then(() => {
      console.log("Connection successful");
    })
    .catch((err) => console.log(err));
//********************************************************************************************** */




// Define Order Schema
const orderSchema = new Schema({
    item: String,
    price: Number,
});

// Define Customer Schema with reference to Order
const customerSchema = new Schema({
    name: String,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});





//middleware****************************************************************************************************


// Pre middleware (optional, for logging or other purposes)
customerSchema.pre("findOneAndDelete", async  ()=> {
    console.log("PRE MIDDLEWARE: Preparing to delete customer...");
  });
  


  // Post middleware for cascading deletion
  customerSchema.post("findOneAndDelete", async (customer)=>{
    console.log("fhgfffffffffffffffffffffffff");
    
    try {

      if (customer && customer.orders.length) 
        {
        // Delete all orders associated with the customer
        let res = await Order.deleteMany({ _id: { $in: customer.orders } });
        console.log(`Deleted Orders:`, res);
      }
    } 
    catch (error) {
      console.error("Error during cascading order deletion:", error);
    }
  });

  
//**************************************************************************************************** */
// Create Models
const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);












// const addOrders = async () => {
//     let res = await Order.insertMany([
//         { item: "Samosa", price: 12 },
//         { item: "Chips", price: 10 },
//         { item: "Chocolate", price: 40 },
//     ]);
//     console.log(res);
// };

// addOrders();




// Function to add a customer and associate orders

// when price is already predefined

const addCustomer = async () => {
    try 
    {
        // Create a new customer
        let cust1 = new Customer(
            {
               name: "Rahul Kumar",
            }
        );

        // Find existing orders
        let order1 = await Order.findOne({ item: "Chips" });
        let order2 = await Order.findOne({ item: "Chocolate" });

        // Add found orders to the customer's orders array
        if (order1) cust1.orders.push(order1);   // reference of order in customer
        if (order2) cust1.orders.push(order2);

        // Save the customer with references to the orders
        let result = await cust1.save();
        console.log(result);
    } 
    catch (error) 
    {
        console.error("Error adding customer:", error);
    }
};

// addCustomer();


        //                 or 


// when new items are inserted with customer
const addCust = async () => {
    let newCust = new Customer({
        name: "Karan Arjun",
    });

    let newOrder = new Order({
        item: "Pizza",
        price: 250,
    });

    newCust.orders.push(newOrder);// reference of order in customer

    await newOrder.save();// 1st save order
    await newCust.save();// referenced one

    console.log("\nAdded new customer");
};

// addCust();




//delete***************************************************************************************************************************

const delCust = async () => {
    try {
      let data = await Customer.findByIdAndDelete("6738832dbe5e09d92a668161");
    // let data = await Customer.findOneAndDelete({ _id: "6737878ac58c96fbe88b209f" });

    console.log(data ? `Deleted Customer: ${data}` : "Customer not found");
    } 
    catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  
  // Call the function
  delCust();
  









//find***************************************************************************************************************************

const findcustomer=async()=>{
    let result = await Customer.find({});                   // give how data order ids in customer
   // let result = await Customer.find({}).populate("orders");     //replave order ids with actual values from order collection
   console.log('\n******************************************************\n',result,'\n******************************************************\n');

    result = await Order.find({});                   
    console.log(result,'\n\n');

};

// findcustomer();




















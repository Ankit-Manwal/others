const express = require("express");

const app = express();

// Disable ETag generation globally
app.set('etag', false);


// Route for /listings
app.get("/listings", async (req, res) => {
    try {
        console.log("Before res.send()");

        // Simulate async operation (delay)
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Log headers before sending
        console.log("Response headers before sending:", res.getHeaders());
        console.log("Response status code before sending:", res.statusCode);

        // Send response and terminate the request-response cycle immediately
        res.send("Test response");

        // Log after sending the response
        console.log("After res.send()");

        console.log("Response status code after sending:", res.statusCode);
        console.log("Response headers after sending:", res.getHeaders());

        return;  // Forcefully terminate further execution
    } catch (err) {
        console.error("Error occurred in /listings route:", err);
        res.status(500).send("Internal Server Error");  // Directly handle error and respond
    }
});

// Explicitly handle the /favicon.ico request
app.get('/favicon.ico', (req, res) => {
    console.log("Favicon request received");
    res.status(204).send();  // Send a 204 No Content response
});

// Fallback route for unmatched routes
app.all('*', (req, res) => {
    console.log("Fallback route triggered for:", req.originalUrl);
    
    // If headers are sent, don't proceed with the fallback
    if (res.headersSent) {
        console.log("Skipping fallback route because headers are already sent.");
        return;  // Don't proceed to fallback route
    }

    console.log("Fallback route continuing...");
    res.status(404).send("Page not found!");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

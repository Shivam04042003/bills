<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const ExcelJS = require('exceljs');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB connection URI and database name
const uri = 'mongodb://localhost:27017'; // Local MongoDB connection string
const dbName = 'Bills'; // Replace with your database name

// MongoDB client
let client;

async function connectToDatabase() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

// Connect to the database
connectToDatabase();

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route to save bill data
app.post('/save-bill', async (req, res) => {
    let billData = req.body;

    // Function to remove properties with zero values or empty dropdown values
    function removeInvalidValues(obj) {
        for (let key in obj) {
            if (
                obj[key] === 0 || obj[key] === "0" || obj[key] === null || obj[key] === undefined ||
                (typeof obj[key] === 'string' && obj[key].trim() === '')
            ) {
                delete obj[key];
            }
        }
        return obj;
    }

    // Clean billData to remove zero values and empty dropdowns
    billData = removeInvalidValues(billData);

    try {
        const database = client.db(dbName);
        const bills = database.collection('Bills');
        const result = await bills.insertOne(billData);

        res.status(201).json({ message: 'Bill saved successfully', billId: result.insertedId });
    } catch (err) {
        console.error('Failed to save bill', err);
        res.status(500).json({ error: 'Failed to save bill' });
    }
});

// GET route to fetch all bill data
app.post('/fetch-bill', async (req, res) => {
    const { customerName, currentDate } = req.body;
  
    if (!customerName || !currentDate) {
      return res.status(400).send('Customer name and date are required');
    }
  
    try {
      // Connect to the MongoDB client
      await client.connect();
      
      // Select the database and collection
      const database = client.db('Bills'); // Database name
      const collection = database.collection('Bills'); // Collection name
  
      // Query to fetch bill based on customerName and currentDate
      const query = {
        customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }, // Case-insensitive match for customer name
        currentDate: currentDate // Exact date match
      };
  
      const bill = await collection.findOne(query);
  
      // Check if a matching bill is found
      if (bill) {
        res.json([bill]); // Return the found bill
      } else {
        res.status(404).send('No bill found for the given customer and date');
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  });

// GET route to fetch kiraya data based on vehicle name and date range and export to Excel
app.get('/fetch-kiraya', async (req, res) => {
    const { vehicleName, startDate, endDate } = req.query;

    try {
        const database = client.db(dbName);
        const bills = database.collection('Bills');
        const query = {
            vehicleName: vehicleName,
            currentDate: {
                $gte: startDate,
                $lte: endDate
            }
        };
        const billData = await bills.find(query).toArray();

        if (billData.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Kiraya Data');

            worksheet.columns = [
                { header: 'Customer Name', key: 'customerName', width: 20 },
                { header: 'Date', key: 'currentDate', width: 15 },
                { header: 'Vehicle Name', key: 'vehicleName', width: 20 },
                { header: 'Kiraya Rate', key: 'kirayaRate', width: 15 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
                { header: 'Final Result', key: 'finalResult', width: 15 }
            ];

            billData.forEach((bill) => {
                worksheet.addRow({
                    customerName: bill.customerName,
                    currentDate: bill.currentDate,
                    vehicleName: bill.vehicleName,
                    kirayaRate: bill.kirayaRate,
                    totalAmount: bill.totalAmount,
                    finalResult: bill.finalResult
                });
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=kiraya_data.xlsx'
            );

            await workbook.xlsx.write(res);
            res.end();
        } else {
            res.status(404).json({ message: 'No data found for the given criteria' });
        }
    } catch (err) {
        console.error('Failed to fetch kiraya data', err);
        res.status(500).json({ error: 'Failed to fetch kiraya data' });
    }
});



// Route to fetch last 30 bill dates based on customer name
app.post('/fetch-bill-dates', async (req, res) => {
    const { customerName } = req.body;

    if (!customerName) {
        return res.status(400).send('Customer name is required');
    }

    try {
        const database = client.db('Bills');
        const collection = database.collection('Bills');

        // Query to find the last 30 bills by customerName
        const bills = await collection.find(
            { customerName: { $regex: new RegExp(`^${customerName}$`, 'i') } },
            { projection: { currentDate: 1 } } // Only return the currentDate field
        )
        .sort({ currentDate: -1 }) // Sort by date in descending order
        .limit(30) // Limit to the last 30 results
        .toArray();

        const billDates = bills.map(bill => bill.currentDate); // Extract the dates
        res.json(billDates);
    } catch (error) {
        console.error('Error fetching bill dates:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to fetch bill dates for the last 120 days for a customer
app.get('/fetch-dates', async (req, res) => {
    try {
        const customerName = req.query.customerName;
        if (!customerName) {
            return res.status(400).json({ error: 'Customer name is required' });
        }

        // Calculate the date 120 days ago from today
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 120);

        // Fetch bills for the given customer within the last 120 days, sorted by date descending
        const bills = await Bill.find({
            customerName,
            currentDate: { $gte: pastDate, $lte: today } // Filter by date range
        })
        .sort({ currentDate: -1 })  // Sort by date in descending order
        .select('currentDate -_id');  // Return only dates

        const dates = bills.map(bill => bill.currentDate);
        res.json(dates);
    } catch (error) {
        console.error('Error fetching bill dates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Route to fetch the bill image based on customer name and date
app.post('/fetch-bill-image', async (req, res) => {
    const { customerName, currentDate } = req.body;

    if (!customerName || !currentDate) {
        return res.status(400).send('Customer name and date are required');
    }

    try {
        const database = client.db('Bills');
        const collection = database.collection('Bills');

        // Query to find the specific bill by customerName and date
        const bill = await collection.findOne({
            customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }, // Case-insensitive match
            currentDate: currentDate // Exact date match
        });

        if (bill) {
            res.json([bill]); // Return the found bill, including the base64 image
        } else {
            res.status(404).send('No bill found for the given date and customer');
        }
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).send('Internal Server Error');
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
=======
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const ExcelJS = require('exceljs');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB connection URI and database name
const uri = 'mongodb://localhost:27017'; // Local MongoDB connection string
const dbName = 'Bills'; // Replace with your database name

// MongoDB client
let client;

async function connectToDatabase() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

// Connect to the database
connectToDatabase();

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route to save bill data
app.post('/save-bill', async (req, res) => {
    let billData = req.body;

    // Function to remove properties with zero values or empty dropdown values
    function removeInvalidValues(obj) {
        for (let key in obj) {
            if (
                obj[key] === 0 || obj[key] === "0" || obj[key] === null || obj[key] === undefined ||
                (typeof obj[key] === 'string' && obj[key].trim() === '')
            ) {
                delete obj[key];
            }
        }
        return obj;
    }

    // Clean billData to remove zero values and empty dropdowns
    billData = removeInvalidValues(billData);

    try {
        const database = client.db(dbName);
        const bills = database.collection('Bills');
        const result = await bills.insertOne(billData);

        res.status(201).json({ message: 'Bill saved successfully', billId: result.insertedId });
    } catch (err) {
        console.error('Failed to save bill', err);
        res.status(500).json({ error: 'Failed to save bill' });
    }
});

// GET route to fetch all bill data
app.post('/fetch-bill', async (req, res) => {
    const { customerName, currentDate } = req.body;
  
    if (!customerName || !currentDate) {
      return res.status(400).send('Customer name and date are required');
    }
  
    try {
      // Connect to the MongoDB client
      await client.connect();
      
      // Select the database and collection
      const database = client.db('Bills'); // Database name
      const collection = database.collection('Bills'); // Collection name
  
      // Query to fetch bill based on customerName and currentDate
      const query = {
        customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }, // Case-insensitive match for customer name
        currentDate: currentDate // Exact date match
      };
  
      const bill = await collection.findOne(query);
  
      // Check if a matching bill is found
      if (bill) {
        res.json([bill]); // Return the found bill
      } else {
        res.status(404).send('No bill found for the given customer and date');
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  });

// GET route to fetch kiraya data based on vehicle name and date range and export to Excel
app.get('/fetch-kiraya', async (req, res) => {
    const { vehicleName, startDate, endDate } = req.query;

    try {
        const database = client.db(dbName);
        const bills = database.collection('Bills');
        const query = {
            vehicleName: vehicleName,
            currentDate: {
                $gte: startDate,
                $lte: endDate
            }
        };
        const billData = await bills.find(query).toArray();

        if (billData.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Kiraya Data');

            worksheet.columns = [
                { header: 'Customer Name', key: 'customerName', width: 20 },
                { header: 'Date', key: 'currentDate', width: 15 },
                { header: 'Vehicle Name', key: 'vehicleName', width: 20 },
                { header: 'Kiraya Rate', key: 'kirayaRate', width: 15 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
                { header: 'Final Result', key: 'finalResult', width: 15 }
            ];

            billData.forEach((bill) => {
                worksheet.addRow({
                    customerName: bill.customerName,
                    currentDate: bill.currentDate,
                    vehicleName: bill.vehicleName,
                    kirayaRate: bill.kirayaRate,
                    totalAmount: bill.totalAmount,
                    finalResult: bill.finalResult
                });
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=kiraya_data.xlsx'
            );

            await workbook.xlsx.write(res);
            res.end();
        } else {
            res.status(404).json({ message: 'No data found for the given criteria' });
        }
    } catch (err) {
        console.error('Failed to fetch kiraya data', err);
        res.status(500).json({ error: 'Failed to fetch kiraya data' });
    }
});



// Route to fetch last 30 bill dates based on customer name
app.post('/fetch-bill-dates', async (req, res) => {
    const { customerName } = req.body;

    if (!customerName) {
        return res.status(400).send('Customer name is required');
    }

    try {
        const database = client.db('Bills');
        const collection = database.collection('Bills');

        // Query to find the last 30 bills by customerName
        const bills = await collection.find(
            { customerName: { $regex: new RegExp(`^${customerName}$`, 'i') } },
            { projection: { currentDate: 1 } } // Only return the currentDate field
        )
        .sort({ currentDate: -1 }) // Sort by date in descending order
        .limit(30) // Limit to the last 30 results
        .toArray();

        const billDates = bills.map(bill => bill.currentDate); // Extract the dates
        res.json(billDates);
    } catch (error) {
        console.error('Error fetching bill dates:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to fetch bill dates for the last 120 days for a customer
app.get('/fetch-dates', async (req, res) => {
    try {
        const customerName = req.query.customerName;
        if (!customerName) {
            return res.status(400).json({ error: 'Customer name is required' });
        }

        // Calculate the date 120 days ago from today
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 120);

        // Fetch bills for the given customer within the last 120 days, sorted by date descending
        const bills = await Bill.find({
            customerName,
            currentDate: { $gte: pastDate, $lte: today } // Filter by date range
        })
        .sort({ currentDate: -1 })  // Sort by date in descending order
        .select('currentDate -_id');  // Return only dates

        const dates = bills.map(bill => bill.currentDate);
        res.json(dates);
    } catch (error) {
        console.error('Error fetching bill dates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Route to fetch the bill image based on customer name and date
app.post('/fetch-bill-image', async (req, res) => {
    const { customerName, currentDate } = req.body;

    if (!customerName || !currentDate) {
        return res.status(400).send('Customer name and date are required');
    }

    try {
        const database = client.db('Bills');
        const collection = database.collection('Bills');

        // Query to find the specific bill by customerName and date
        const bill = await collection.findOne({
            customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }, // Case-insensitive match
            currentDate: currentDate // Exact date match
        });

        if (bill) {
            res.json([bill]); // Return the found bill, including the base64 image
        } else {
            res.status(404).send('No bill found for the given date and customer');
        }
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).send('Internal Server Error');
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
>>>>>>> b8388af4023f826c8fb824659d4c6987baee64f4

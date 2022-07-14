const express = require('express'); //gets the express server up
const connectDB = require('./config/db');
// const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({extended: false})); // pass in object of extended false, this will allow us to get data in request.body

//Define Routes these are enpoints, they pertain to that users file
app.use('/api/realtors', require('./routes/api/realtors'));  
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }
app.get('/', (req, res) => res.send('API RUNNING')); //send data to the browser 
const PORT = process.env.PORT || 5000; //look for environrment vriable to run, locally run to port 5k if none set 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //call back to run message in console 
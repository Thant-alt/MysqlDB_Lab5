# COMP 4537 Lab 5: Introduction to Databases
# Overview
This lab focuses on interacting with databases using raw SQL queries. The front end provides an interface where users can submit both default and custom SQL queries, while the back end is responsible for processing these requests and interacting with the database.

WARNING: This lab demonstrates basic interactions with databases for educational purposes. Raw SQL queries from user input can pose a significant security risk. Never use such an approach in production environments.

# Features
Default Query Submission: Click a button to insert default patient records into the database.
Custom Query Submission: Input custom SQL queries to either SELECT or INSERT data into the database.

# Setup Dependencies:
Ensure you have Node.js installed.
Install the required Node.js modules using:
Copy code
npm install mysql dotenv
Database Configuration:

# Setup your MySQL database.
Create a .env file in your project directory and populate it with your database credentials, for example:
makefile
Copy code
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
Starting the Server:

# Navigate to the project directory in your terminal.
Run the command:
node app.js
The server should start, and you should see the message "Server is running on http://localhost:3000".

# Usage
Open a web browser and navigate to http://localhost:3000.
Click on the "Submit Default Queries" button to insert default patient records.
To run custom SQL queries, type your query into the textbox provided and click "submit request".

# Limitations
Only SELECT and INSERT queries are currently supported.
For the sake of security, avoid using complex combinations of SQL statements.
Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

# License
This project is open source. See the LICENSE file for more details.

Feel free to adjust this template according to your lab's specifics and any additional information you think is relevant!
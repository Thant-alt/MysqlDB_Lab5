const http = require("http");
const url = require("url");
require('dotenv').config();

const PORT = 3000;

// Define all hard-coded strings
const STRINGS = {
    DATABASE_ERROR: "Error connecting to the database:",
    DATABASE_CONNECTED: "Connected to the database",
    SQL_PATIENTS_TABLE: "CREATE TABLE IF NOT EXISTS patients (patientId INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100), dateOfBirth DATETIME, PRIMARY KEY (patientId))",
    TABLE_CREATION_ERROR: "Error creating table:",
    TABLE_EXISTS_OR_CREATED: "CONNECTED! Table exists or was created!",
    EXECUTING_SQL: "Executing SQL query:",
    SQL_ERROR: "Error executing SQL query:",
    SERVER_RUNNING: `Server is running on http://localhost:${PORT}`,
    BAD_REQUEST: "Bad Request",
    MISSING_QUERY: "Query parameter is missing or empty",
    SQL_PROCESSED: "SQL Query processed!",
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
};

const mysql = require("mysql");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect(function (err) {
    if (err) {
        console.error(STRINGS.DATABASE_ERROR, err);
        return;
    }
    console.log(STRINGS.DATABASE_CONNECTED);

    const sql = `
        CREATE TABLE IF NOT EXISTS patients (
            patientId INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(100),
            dateOfBirth DATETIME,
            PRIMARY KEY (patientId)
        )
    `;

    db.query(sql, function (err, result) {
        if (err) {
            console.error(STRINGS.TABLE_CREATION_ERROR, err);
            return;
        }
        console.log(STRINGS.TABLE_EXISTS_OR_CREATED);
        console.log("Query result:", result);
    });
});

const server = http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url);
    const pathName = parsedUrl.pathname;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    if (pathName.includes("/labs/lab5/api/v1/sql") && req.method === "GET") {
        const parsedUrl = url.parse(req.url, true);
        const new_query = parsedUrl.query.query;

        if (!new_query || new_query.trim() === "") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                error: STRINGS.BAD_REQUEST,
                details: STRINGS.MISSING_QUERY,
            }));
            return;
        }

        console.log(STRINGS.EXECUTING_SQL, new_query);
        db.query(new_query, function (err, result) {
            handleQueryError(res, err);
            console.log("Query result:", result);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: true,
                message: STRINGS.SQL_PROCESSED,
                result: result,
            }));
        });
    } else if (pathName === "/labs/lab5/api/v1/sql" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { query } = JSON.parse(body);
            db.query(query, function (err, result) {
                handleQueryError(res, err);
                console.log("Query result:", result);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: result.message,
                    result: result,
                }));
            });
        });
    } else {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: STRINGS.METHOD_NOT_ALLOWED }));
    }

    function handleQueryError(res, err) {
        if (err) {
            console.error(STRINGS.SQL_ERROR, err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                error: STRINGS.INTERNAL_SERVER_ERROR,
                details: err.message
            }));
            return;
        }
    }
});

server.listen(PORT, () => {
    console.log(STRINGS.SERVER_RUNNING);
});

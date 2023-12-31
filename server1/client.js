// INSERT INTO patients (name, dateOfBirth) VALUES ("Al Daquioag", "1996-01-01")
function sendDefaultQuery() {
    const defaultQuery =
        "INSERT INTO patients (name, dateOfBirth) VALUES " +
        '("Sara Brown", "1990-01-01"), ' +
        '("John Smith", "1941-01-01"), ' +
        '("Jack Ma", "1911-01-30"), ' +
        '("Elon Musk", "1999-01-01")';

    sendQuery(defaultQuery);

};

function validateQuery() {
    const instructionString = "Please provide an SQL query";
    const selectAndInsertErrorMessage = "INVALID SQL QUERY: Both SELECT and INSERT are not allowed for security reasons!";
    const invalidSqlMessage = "INVALID SQL QUERY!";

    const query = document.getElementById("sql_query").value;

    if (!query.trim()) {
        document.getElementById("feedback").innerHTML = instructionString
        return;
    }

    const newQuery = query.toLowerCase();

    if (newQuery.includes("select")) {
        getQuery(query);
    } else if (newQuery.includes("insert")) {
        sendQuery(query);
    } else if (newQuery.includes("select") && newQuery.includes("insert")) {
        document.getElementById("feedback").innerHTML = selectAndInsertErrorMessage;
    } else {
        document.getElementById("feedback").innerHTML = invalidSqlMessage;
    }

};

function sendQuery(query) {
    const successMessage = "Success:";
    const errorMessage = "Error:";
    const defaultMessage = "Query Successfull";
    const errorString = "Error with SQL Query! ";
    document.getElementById("feedback").innerHTML = query;

    fetch(`http://localhost:3000/labs/lab5/api/v1/sql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(successMessage, data);
            console.log(data.message);
            document.getElementById("feedback_container").innerHTML = defaultMessage;
            document.getElementById("response").innerHTML = `${data.message}`;
        })
        .catch((error) => {
            console.error(errorMessage, error);
            document.getElementById("feedback").innerHTML = errorString + error;
        });
}

function getQuery(query) {
    const querySuccess = "Query successful!";
    const queryUnSuccess = "NOOO IT didnt work!";

    fetch(`http://localhost:3000/labs/lab5/api/v1/sql/?query=${query}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`query '${query}' didnt work for some reason!`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Success:", data);
            console.log("Message:", data.message);
            document.getElementById("feedback").innerHTML = querySuccess;
            document.getElementById("feedback_container").innerHTML = "";
            document.getElementById("response").innerHTML = "";
            populateTable(data.result);

        })
        .catch((error) => {
            console.error("Error:", error);
            document.getElementById("feedback").innerHTML = queryUnSuccess;
        });
}

function populateTable(patientRecords) {
    const table = document.createElement("table");
    table.id = "patientsTable";

    // const table = document.getElementById("patientTable");
    table.innerHTML = "";
    const headerCells = ["Patient ID", "Name", "Date of Birth"];

    const headerRow = table.createTHead().insertRow(0); // Create a table head and a new row at pos 0
    for (let i = 0; i < headerCells.length; i++) {
        const headerCell = document.createElement("th"); // Iterate over the header cells array
        headerCell.textContent = headerCells[i];
        headerRow.appendChild(headerCell); // Appended to the header row (table head)
    }
    for (let i = 0; i < patientRecords.length; i++) {
        const patient = patientRecords[i]; // retrieve patient obj from array

        const row = table.insertRow(i + 1); // i + 1 to skip the header row

        const cell1 = row.insertCell(0);
        cell1.textContent = patient.patientId;

        const cell2 = row.insertCell(1);
        cell2.textContent = patient.name;

        const cell3 = row.insertCell(2);
        cell3.textContent = new Date(patient.dateOfBirth).toLocaleDateString(); // Format date as needed
    }

    const container = document.getElementById("feedback_container");
    container.appendChild(table);

}
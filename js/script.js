// Function to send a POST request for inserting predefined data
function sendPostRequest() {
    const query = "INSERT INTO patient (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')";

    alert(userMessages.alertInsertQuery + "\n" + query);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://isalab5.onrender.com/patient", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                console.log('Success:', result);
                alert(userMessages.successInsert);
            } else {
                alert(userMessages.errorSendData + xhr.statusText);
                console.error('Error:', xhr.statusText);
            }
        }
    };

    // Send the request with the query data
    xhr.send(JSON.stringify({ query }));
}

// Function to send a custom SQL query entered by the user
function sendQuery() {
    const query = document.getElementById('sqlQuery').value.trim();

    if (query.toLowerCase().startsWith("select")) {
        // Properly encode the query and append it to the URL
        const encodedQuery = encodeURIComponent(query);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://isalab5.onrender.com/patient/" + encodedQuery, true);

        // Handle the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    console.log('Success:', result);
                    alert(userMessages.successSelect + "\n\n" + JSON.stringify(result, null, 2));
                } else {
                    alert(userMessages.errorQueryExecution + xhr.statusText);
                    console.error('Error:', xhr.statusText);
                }
            }
        };

        // Send the GET request with the encoded query in the URL
        xhr.send();

    } else if (query.toLowerCase().startsWith("insert")) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://isalab5.onrender.com/patient", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        // Handle the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    console.log('Success:', result);
                    alert(userMessages.successInsert);
                } else {
                    alert(userMessages.errorQueryExecution + xhr.statusText);
                    console.error('Error:', xhr.statusText);
                }
            }
        };

        // Send the request with the user's query
        alert(userMessages.alertInsertQuery + "\n" + JSON.stringify({ query }));
        xhr.send(JSON.stringify({ query }));
    } else {
        alert(userMessages.invalidQuery);
    }
}

// Set user-facing text from JSON file
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("heading").innerText = userMessages.heading;
    document.getElementById("insertButton").innerText = userMessages.insertButton;
    document.getElementById("customQueryHeading").innerText = userMessages.customQueryHeading;
    document.getElementById("sqlQuery").placeholder = userMessages.sqlQueryPlaceholder;
    document.getElementById("submitButton").innerText = userMessages.submitButton;

    document.getElementById("insertButton").addEventListener("click", sendPostRequest);
    document.getElementById("submitButton").addEventListener("click", sendQuery);
});

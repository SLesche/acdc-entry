add_delete_button_to_list_item = function(listItem) {
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;'; // Red X
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        listItem.remove();
    });
    listItem.appendChild(deleteButton);

    return(listItem)
}

function toggleFieldset(fieldsetId) {
    const fieldset = document.getElementById(fieldsetId);
    if (fieldset.disabled) {
        fieldset.disabled = false;
        fieldset.style.display = 'block';
    } else {
        fieldset.disabled = true;
        fieldset.style.display = 'none';
    }
}

function getNewId(info_object){
    const id = Object.keys(info_object).length > 0 ? Math.max(...Object.keys(info_object).map(key => parseInt(key))) + 1 : 0;
    return id
}

function addGreenCheckmarkById(sidebarItemId) {
    // Select the sidebar item using its ID
    const sidebarItem = document.getElementById(sidebarItemId);
    if (!sidebarItem) {
        console.error(`Sidebar item with ID ${sidebarItemId} not found.`);
        return;
    }

    // Select the existing span element within the sidebar item
    const textSpan = sidebarItem.querySelector('span');
    if (!textSpan) {
        console.error(`No span element found within the sidebar item with ID ${sidebarItemId}.`);
        return;
    }
    // Create a new span element for the checkmark
    const checkmark = document.createElement('span');
    checkmark.textContent = ' ✔'; // Unicode checkmark character
    checkmark.classList.add('green-checkmark');

    // Check if the textSpan already has a checkmark
    const existingCheckmark = textSpan.querySelector('.green-checkmark');
    if (existingCheckmark) {
        console.log('Checkmark already exists.');
        return;
    }

    // Append the checkmark to the existing span
    textSpan.appendChild(checkmark);
}

function csvFileToObject(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const csvData = event.target.result;
            try {
                const jsonObject = Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        resolve(results.data);
                    },
                    error: function(error) {
                        reject(new Error('Error parsing CSV: ' + error.message));
                    }
                });
            } catch (error) {
                reject(new Error('Error parsing CSV: ' + error.message));
            }
        };

        reader.onerror = function() {
            reject(new Error('Error reading file: ' + reader.error));
        };

        reader.readAsText(file);
    });
}

function createTableFromCSV(csvObject, n_rows) {
    // Create table element
    let table = '<table><thead><tr>';

    // Extract table headers
    const headers = Object.keys(csvObject[0]);
    headers.forEach(header => {
        table += `<th>${header}</th>`;
    });
    table += '</tr></thead><tbody>';

    // Populate table rows with CSV data
    csvObject.slice(0, n_rows).forEach(row => {
        table += '<tr>';
        headers.forEach(header => {
            table += `<td>${row[header] !== undefined ? row[header] : ''}</td>`;
        });
        table += '</tr>';
    });
    table += '</tbody></table>';

    return table
}

function displayValidationError(questionId, message) {
    // Select the question element using its ID
    const questionElement = document.getElementById(questionId);
    if (!questionElement) {
        console.error(`Element with ID ${questionId} not found.`);
        return;
    }

    // Scroll to the question element
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Change the border color of the question element
    questionElement.style.borderColor = 'red';

    // Create a message element
    let messageElement = document.getElementById(`${questionId}-message`);
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = `${questionId}-message`;
        questionElement.parentNode.insertBefore(messageElement, questionElement.nextSibling);
    }

    // Set the message text and color
    messageElement.innerHTML = `<p> ${message}</p>`;
    messageElement.style.color = 'red';
    messageElement.style.marginTop = '5px'; // Optional: Add some margin for better appearance
}

function displayWarningMessage(questionId, message) {
    // Select the question element using its ID
    const questionElement = document.getElementById(questionId);
    if (!questionElement) {
        console.warn(`Element with ID ${questionId} not found.`);
        return;
    }

    // Scroll to the question element
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Change the border color of the question element
    questionElement.style.borderColor = 'orange';

    // Create a message element
    let messageElement = document.getElementById(`${questionId}-message`);
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = `${questionId}-message`;
        questionElement.parentNode.insertBefore(messageElement, questionElement.nextSibling);
    }

    // Set the message text and color
    messageElement.textContent = message;
    messageElement.style.color = 'orange';
    messageElement.style.marginTop = '5px'; // Optional: Add some margin for better appearance
}

function clearValidationMessages() {
    // Select all elements with an ID ending in '-message'
    const messageElements = document.querySelectorAll('[id$="-message"]');
    
    messageElements.forEach(element => {
        // Remove the message element from the DOM
        element.parentNode.removeChild(element);
    });

    // Reset the border color of all input elements
    const inputElements = document.querySelectorAll('input, textarea, select');
    inputElements.forEach(element => {
        element.style.borderColor = ''; // Reset to default border color
    });
}

function getRadioButtonSelection(radioGroupName) {
    const radioGroup = document.getElementsByName(radioGroupName);
    for (let i = 0; i < radioGroup.length; i++) {
        if (radioGroup[i].checked) {
            return radioGroup[i].value;
        }
    }
    return null;
}

// Find the statementset with the given name, give null if name is "No information"
function getStatementSetIndex(statementset_name) {
    if (statementset_name === "no information") {
        return null;
    }

    // Ensure statementset_name is defined and is a string
    if (typeof statementset_name !== 'string') {
        console.error(`Invalid statementset_name: ${statementset_name}`);
        return null;
    }

    // Extract the number from the statementset_name
    const match = statementset_name.match(/\d+/);
    if (!match) {
        console.error(`No number found in statementset_name: ${statementset_name}`);
        return null;
    }

    const index = parseInt(match[0], 10) - 1;

    return index;
}
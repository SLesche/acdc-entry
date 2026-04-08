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

    // Check if the textSpan already has a checkmark
    const existingCheckmark = textSpan.querySelector('.green-checkmark-custom');
    if (existingCheckmark) {
        console.log('Checkmark already exists.');
        return;
    }

    // Create the icon element
    const icon = document.createElement('i');
    icon.classList.add('bi', 'bi-check', 'text-success', 'fs-2', 'align-middle');

    // Create a new span element for the checkmark
    const checkmark = document.createElement('span');
    checkmark.classList.add('green-checkmark-custom');
    checkmark.appendChild(icon);

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
    // Start Bootstrap table
    let table = `
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-sm align-middle small">
                <thead class="text-capitalize-none">
                    <tr>
    `;

    // Extract headers
    const headers = Object.keys(csvObject[0]);
    headers.forEach(header => {
        table += `<th style="text-transform: none;" scope="col">${header}</th>`;
    });

    table += `
                    </tr>
                </thead>
                <tbody>
    `;

    // Add table rows
    csvObject.slice(0, n_rows).forEach(row => {
        table += '<tr>';
        headers.forEach(header => {
            table += `<td>${row[header] !== undefined ? row[header] : ''}</td>`;
        });
        table += '</tr>';
    });

    // Close table
    table += `
                </tbody>
            </table>
        </div>
    `;

    return table;
}

function displayValidationError(questionId, message) {
    const questionElement = document.getElementById(questionId);
    if (!questionElement) {
        console.error(`Element with ID ${questionId} not found.`);
        return;
    }

    // Scroll into view
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Apply Bootstrap error class
    questionElement.classList.add('is-invalid');
    questionElement.classList.remove('is-warning'); // Remove warning if present

    // Create or update the feedback message
    let messageElement = document.getElementById(`${questionId}-message`);
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = `${questionId}-message`;
        messageElement.className = 'invalid-feedback d-block';
        questionElement.parentNode.insertBefore(messageElement, questionElement.nextSibling);
    }

    messageElement.innerHTML = message;
}

function displayWarningMessage(questionId, message) {
    const questionElement = document.getElementById(questionId);
    if (!questionElement) {
        console.warn(`Element with ID ${questionId} not found.`);
        return;
    }

    // Scroll into view
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Apply custom warning class
    questionElement.classList.add('is-warning');
    questionElement.classList.remove('is-invalid'); // Remove error if present

    // Create or update the warning message
    let messageElement = document.getElementById(`${questionId}-message`);
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = `${questionId}-message`;
        messageElement.className = 'form-text text-warning fw-bold';
        questionElement.parentNode.insertBefore(messageElement, questionElement.nextSibling);
    }

    messageElement.innerHTML = message;
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

// Find the task with the given name, give null if name is "No information"
function getTaskIndex(task_name) {
    if (task_name === "no information") {
        return null;
    }

    // Ensure task_name is defined and is a string
    if (typeof task_name !== 'string') {
        console.error(`Invalid task_name: ${task_name}`);
        return null;
    }

    // Extract the number from the statementset_name
    const match = task_name.match(/\d+/);
    if (!match) {
        console.error(`No number found in task_name: ${task_name}`);
        return null;
    }

    const index = parseInt(match[0], 10) - 1;

    return index;
}

function showAlert(message, type = "info", containerId = "content") {
    const iconMap = {
        success: "check-circle",
        danger: "exclamation-triangle",
        warning: "exclamation-circle",
        info: "info-circle"
    };

    const icon = iconMap[type] || "info-circle";

    const container = document.getElementById(containerId);

    // // Remove existing alert if any
    // const existingAlert = container.querySelector(".alert");
    // if (existingAlert) {
    //     existingAlert.remove();
    // }

    // Create alert element
    const alertWrapper = document.createElement("div");
    alertWrapper.className = `alert alert-${type} alert-dismissible fade d-flex align-items-center mt-3`;
    alertWrapper.setAttribute("role", "alert");

    alertWrapper.innerHTML = `
        <i class="bi bi-${icon} me-2"></i>
        <div>${message}</div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Prepend alert and trigger fade-in
    container.prepend(alertWrapper);
    void alertWrapper.offsetWidth;
    alertWrapper.classList.add("show");

    // Scroll smoothly to alert
    alertWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
}

function generateYesNoField(id, label, value, yesLabel = "Yes", noLabel = "No") {
    return `
    <div class="mb-3">
        <label class="form-label">${label}</label>
        <div id=${id}>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="${id}" id="${id}_yes" value="1" ${value == 1 ? 'checked' : ''}>
                <label class="form-check-label" for="${id}_yes">${yesLabel}</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="${id}" id="${id}_no" value="0" ${value == 0 ? 'checked' : ''}>
                <label class="form-check-label" for="${id}_no">${noLabel}</label>
            </div>
        </div>
    </div>`;
}


document.addEventListener('DOMContentLoaded', () => {
    const user = 'julia.haaf';
    const domain = 'uni-potsdam.de';
    const email = `${user}@${domain}`;
    const link = document.getElementById('email1');
    link.href = `mailto:${email}`;
    link.textContent = email;
  });
  
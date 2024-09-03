function initializeStudySurvey(control, publication_idx, study_idx) {
    study_data = control.publication_info[publication_idx].study_info[study_idx].data;
    studyName = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
        <h2>${studyName}</h2>
        <form id="studySurvey" class = "survey-form">
            <label for="statementset" class = "survey-label">What statementset did you use in this study?</label>
            <input type="text" id="statementset" name="statementset" value="${study_data.statementset || ''}" required><br>

            <label for="numRepetitions" class = "survey-label">How many repetitions were done in this study?</label>
            <input type="number" id="numRepetitions" name="numRepetitions" value="${study_data.num_repetitions || ''}" required><br>

            <button type="submit" class = "survey-button">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('studySurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateStudySurvey(control, publication_idx, study_idx);
    });
}

function updateStudySurvey(control, publication_idx, study_idx) {
    // Get values from the input fields
    const statementset = document.getElementById('statementset').value;
    const num_repetitions = document.getElementById('numRepetitions').value;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].data = {
        statementset: statementset,
        num_repetitions: num_repetitions,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}
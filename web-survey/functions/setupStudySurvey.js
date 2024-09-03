function initializeStudySurvey(control, publication_idx, study_idx) {
    study_data = control.publication_info[publication_idx].study_info[study_idx].data;
    studyName = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
        <h2>${studyName}</h2>
        <form id="studySurvey" class="survey-form">
        <label for="truth_rating_scale" class="survey-label">With what scale did you measure the truth rating of a statement?</label>
        <select id="truth_rating_scale" name="truth_rating_scale" required>
            <option value="dichotomous" ${study_data.truth_rating_scale === 'dichotomous' ? 'selected' : ''}>Dichotomous</option>
            <option value="likert" ${study_data.truth_rating_scale === 'likert' ? 'selected' : ''}>Likert</option>
            <option value="range" ${study_data.truth_rating_scale === 'range' ? 'selected' : ''}>Range</option>
            <option value="other" ${study_data.truth_rating_scale === 'other' ? 'selected' : ''}>Other</option>
        </select><br>

        <label for="truth_rating_steps" class="survey-label">How many steps did your rating scale have?</label>
        <input type="number" id="truth_rating_steps" name="truth_rating_steps" value="${study_data.truth_rating_steps || ''}" required><br>

        <label for="rt_measured" class="survey-label">Did you measure response time (0 - No, 1 - Yes)?</label>
        <input type="number" id="rt_measured" name="rt_measured" value="${study_data.rt_measured || ''}" required><br>

        <label for="rt_onset" class="survey-label">What event marked the onset of response time measurement?</label>
        <input type="text" id="rt_onset" name="rt_onset" value="${study_data.rt_onset || ''}" required><br>

        <label for="n_groups" class="survey-label">How many between conditions did you have in the study?</label>
        <input type="number" id="n_groups" name="n_groups" value="${study_data.n_groups || ''}" required><br>

        <label for="participant_age" class="survey-label">Was was the average age of your participants?</label>
        <input type="number" step="0.01" id="participant_age" name="participant_age" value="${study_data.participant_age || ''}" required><br>

        <label for="percentage_female" class="survey-label">Which percentage of your participants was female?</label>
        <input type="number" step="0.01" id="percentage_female" name="percentage_female" value="${study_data.percentage_female || ''}" required><br>

        <label for="external_vars" class="survey-label">Please list any external variables you measured.</label>
        <input type="text" id="external_vars" name="external_vars" ${study_data.external_vars ? 'checked' : ''}><br>

        <label for="physiological_measures" class="survey-label">Did you collect any physiological data (0 - No, 1 - Yes)?</label>
        <input type="number" id="physiological_measures" name="physiological_measures" ${study_data.physiological_measures || ''}><br>

        <label for="cognitive_models" class="survey-label">Did you employ any cognitive models in your analysis (0 - No, 1 - Yes)?</label>
        <input type="number" id="cognitive_models" name="cognitive_models" ${study_data.cognitive_models || ''}><br>

        <label for="github" class="survey-label">If available, provide the link to the data on GitHub.</label>
        <input type="text" id="github" name="github" ${study_data.github || ''}><br>

        <label for="osf" class="survey-label">If available, provide the link to the data on OSF.</label>
        <input type="text" id="osf" name="osf" ${study_data.osf || ''}><br>

        <label for="study_comment" class="survey-label">Would you like to provide any additional information?</label>
        <textarea id="study_comment" name="study_comment" rows="4" cols="50" required>${study_data.study_comment || ''}</textarea><br>

        <button type="submit" class="survey-button">Submit</button>
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
    const truth_rating_scale = document.getElementById('truth_rating_scale').value;
    const truth_rating_steps = document.getElementById('truth_rating_steps').value;
    const rt_measured = document.getElementById('rt_measured').value;
    const rt_onset = document.getElementById('rt_onset').value;
    const n_groups = document.getElementById('n_groups').value;
    const participant_age = document.getElementById('participant_age').value;
    const percentage_female = document.getElementById('percentage_female').value;
    const external_vars = document.getElementById('external_vars').checked;
    const physiological_measures = document.getElementById('physiological_measures').value;
    const cognitive_models = document.getElementById('cognitive_models').value;
    const github = document.getElementById('github').value;
    const osf = document.getElementById('osf').value;
    const study_comment = document.getElementById('study_comment').value;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].data = {
        truth_rating_scale: truth_rating_scale,
        truth_rating_steps: truth_rating_steps,
        rt_measured: rt_measured,
        rt_onset: rt_onset,
        n_groups: n_groups,
        participant_age: participant_age,
        percentage_female: percentage_female,
        external_vars: external_vars,
        physiological_measures: physiological_measures,
        cognitive_models: cognitive_models,
        github: github,
        osf: osf,
        study_comment: study_comment,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}
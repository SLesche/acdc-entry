function addPublication(control) {
    // Determine the number of entries in dataset_info
    const publication_idx = getNewId(control.publication_info);
    const publication_name = "Publication " + (publication_idx + 1);

    // For now, where only one publication is allowed, we will remove the previous publication
    const publication_text = "Publication";

    control.publication_info[publication_idx] = setupPublicationInfo(publication_name);
    
    if (!publication_name) return;
    // Create a new list item for the publication
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "publication-" + publication_idx;
    listItem.id = "publication-" + publication_idx;

    // Create a span for the publication name
    const span = document.createElement("span");
    span.textContent = publication_text;

    // // Create action buttons
    // const actions = document.createElement("div");
    // actions.className = "actions";

    // const removeButton = document.createElement("button");
    // removeButton.innerHTML = '&times;'; // Red X
    // removeButton.classList.add('delete-button');
    // removeButton.onclick = function(event) {
    //     event.stopPropagation();
    //     removeItem(listItem, control);
    // };
    // actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    // listItem.appendChild(actions);

    // Create a nested list for studies
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Study" button
    const addStudyListItem = document.createElement("li");
    const addStudyButton = document.createElement("button");
    addStudyButton.className = "menu-button";
    addStudyButton.id = "addStudyButton-" + publication_idx;
    addStudyButton.textContent = "+ Add Study";
    addStudyButton.onclick = function() {
        addStudy(nestedList, control, publication_idx);
    };
    addStudyListItem.appendChild(addStudyButton);
    nestedList.appendChild(addStudyListItem);

    // Append the nested list to the publication item
    listItem.appendChild(nestedList);

    // Append the new list item to the sidebar list
    document.getElementById("sidebarList").appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });

    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializePublicationSurvey(control, publication_idx);
    });

    // Open one new study
    addStudy(nestedList, control, publication_idx);
}

function initializePublicationSurvey(control, publication_idx) {
    const publication = control.publication_info[publication_idx].publication_data;
    const publication_name = control.publication_info[publication_idx].publication_name;
    document.getElementById("content").innerHTML = `
    <div class = "display-text">
        <h1>${publication_name}</h1>
        <p>Before you begin entering your data, please start by providing details about the publication. This refers to the overall paper or article to which your data is associated.</p>
        <p>In this section, you'll be asked to provide key information about the publication, such as the title, authors, and publication date. This helps us organize and connect your data to the correct sources, making it easier for others to reference and understand the context of your research.</p>
        <p>After completing the publication details, you will have the opportunity to add one or more studies associated with this publication. Each study represents a distinct experiment or analysis conducted within the scope of the publication.</p>
        <p>By following this structure, you help ensure that your data is accurately represented and easily accessible for future use.</p>
        <p>Feel free to add as many studies as needed.</p>        
        
        <form id="publicationSurvey" class = "survey-form">
            <label for="allow_share" class="survey-label">Are you allowed to publicly share this data?</label>
            <div class="radio-buttons" id = "allow_share">
                <input type="radio" id="allow_share_yes" name="allow_share" value="1" ${publication.allow_share === '1' ? 'checked' : ''}>
                <label for="allow_share_yes">Yes</label>
                <input type="radio" id="allow_share_no" name="allow_share" value="0" ${publication.allow_share === '0' ? 'checked' : ''}>
                <label for="allow_share_no">No</label><br>
            </div>
            <label for="authors" class = "survey-label">Who are the authors of the publication?</label>
            <input type="text" id="authors" name="authors" value="${publication.authors || ''}"><br>
            <p class="survey-label-additional-info">Please list only the surnames of the authors separated by comma, i.e. "Smith, Müller, Garcia".</p>

            <label for="first_author" class = "survey-label">Who was the first author of this publication?</label>
            <input type="text" id="first_author" name="first_author" value="${publication.first_author || ''}"><br>
            <p class="survey-label-additional-info">Please list only the surname of the first author. If there were multiple first authors, list the surnames separated by commas.</p>

            <label for="title" class = "survey-label">What was the title of this publication?</label>
            <input type="text" id="title" name="title" value="${publication.title || ''}"><br>

            <label for="apa_reference" class = "survey-label">Please provide an APA7 style reference for the publication:</label>
            <input type="text" id="apa_reference" name="apa_reference" value="${publication.apa_reference || ''}"><br>

            <label for="conducted" class = "survey-label">In what year was the study conducted?</label>
            <input type="number" id="conducted" name="conducted" value="${publication.conducted || ''}"><br>

            <label for="country" class = "survey-label">In what country was the study conducted?</label>
            <input type="text" id="country" name="country" value="${publication.country || ''}"><br>

            <label for="keywords" class = "survey-label">What are the keywords associated with the publication?</label>
            <input type="text" id="keywords" name="keywords" value="${publication.keywords || ''}"><br>
            <p class="survey-label-additional-info">Separate the keywords by commas: "keyword 1, keyword 2, keyword 3</p>
            
            <label for="contact" class = "survey-label">Provide contact information for further questions:</label>
            <input type="text" id="contact" name="contact" value="${publication.contact || ''}"><br>

            <button type="submit" class = "survey-button">Submit</button>
        </form>
    </div>
    `;

    // Add event listener to the form's submit button
    document.getElementById('publicationSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validatePublicationData(collectPublicationData()) || control.testing) {
            updatePublicationSurvey(control, publication_idx);
        }
    });
}

function collectPublicationData(){
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const first_author = document.getElementById('first_author').value;
    const title = document.getElementById('title').value;
    const apa_reference = document.getElementById('apa_reference').value;
    const conducted = document.getElementById('conducted').value;
    const country = document.getElementById('country').value;
    const keywords = document.getElementById('keywords').value;
    const contact = document.getElementById('contact').value;
    const allow_share = getRadioButtonSelection('allow_share');

    // Store the values in the control object
    const publication_data = {
        authors: authors,
        first_author: first_author,
        title: title,
        apa_reference: apa_reference,
        conducted: conducted,
        country: country,
        keywords: keywords,
        contact: contact,
        allow_share: allow_share,
    }

    return publication_data;
}

function validatePublicationData(publication_data){
    clearValidationMessages();

    var alert_message = 'This field does not match validation criteria.';
    // Check if any of the fields are empty

    const required_keys = ['allow_share', 'authors', 'first_author', 'title', 'apa_reference', 'conducted', 'country', 'contact'];
    for (const key of required_keys) {
        if (!publication_data[key]) {
            alert_message = 'This field is required.';
            displayValidationError(key, alert_message);
            return false;
        }
    }

    if (publication_data.allow_share == 0) {
        alert_message = 'You can only upload data that you are allowed to share.';
        displayValidationError("allow_share", alert_message);
        return false;
    }

    if (publication_data.authors.includes(".")) {
        alert_message = 'Authors field should not contain periods. Only list the surnames separated by commas.';
        displayValidationError("authors", alert_message);
        return false;
    }

    if (publication_data.conducted < 1900 || publication_data.conducted > new Date().getFullYear()) {
        alert_message = 'Please enter a valid year for the study.';
        displayValidationError("conducted", alert_message);

        return false;
    }

    return true;
}

function updatePublicationSurvey(control, publication_idx) {
    // Store the values in the control object
    const publication_data = collectPublicationData();

    publication_data.validated = true;
    control.publication_info[publication_idx].publication_data = publication_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id = "publication-" + publication_idx;
    addGreenCheckmarkById(item_id);
}
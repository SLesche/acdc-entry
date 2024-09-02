function addDataset(parentElement, control, publication_idx, study_idx) {
    const dataset_idx = control.publication_info[publication_idx].study_info[study_idx].num_datasets;
    const dataset_name = "Dataset " + (dataset_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx] = setupDatasetInfo(dataset_name);
    
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = dataset_name;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";
    const renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(event) {
        event.stopPropagation();
        renameItem(span, dataset_name);
    };
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function(event) {
        event.stopPropagation();
        removeItem(listItem);
    };
    actions.appendChild(renameButton);
    actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    listItem.appendChild(actions);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

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
        initializeDatasetSurvey(control, publication_idx, study_idx, dataset_idx)
    });

    // Increase Num Datasets
    control.publication_info[publication_idx].study_info[study_idx].num_datasets++;
}

function renameItem(span, oldName) {
    const newName = prompt("Enter new name:", oldName);
    if (newName) {
        span.textContent = newName;
        // Update content area if the item is currently displayed
        const content = document.getElementById("content");
        if (content.querySelector("h2").textContent === oldName) {
            content.innerHTML = `
                <h2>${newName}</h2>
                <p>Here, length and other things should be checked.</p>
                <p>Maybe an option to upload untreated data here.</p>
            `;
        }
        // Update control item name
        const publication_idx = Array.from(document.getElementById("sidebarList").children).indexOf(span.parentElement);
        const study_idx = Array.from(span.parentElement.parentElement.children).indexOf(span.parentElement);
        const dataset_idx = Array.from(span.parentElement.parentElement.parentElement.children).indexOf(span.parentElement.parentElement);
        if (dataset_idx === -1) {
            control.publication_info[publication_idx].study_info[study_idx].study_name = newName;
        } else {
            control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_name = newName;
        }
    }
}
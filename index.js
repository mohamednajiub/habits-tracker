/**
 * This script is responsible for handling the submission of dates and displaying them in a list with their duration since the last submission.
 * It utilizes the LocalStorage to store the submission dates and dynamically updates the list upon new submissions.
 */

document.addEventListener("DOMContentLoaded", function () {
  /**
   * This function is triggered when the document has finished loading. It retrieves the stored submission dates from LocalStorage
   * and renders them in the HTML.
   */
  // Get stored data from LocalStorage
  let submissions = getSubmissions();

  renderSubmissions(submissions);
});

/**
 * This function takes an array of submission dates and renders them in the HTML. It calculates the duration since the last submission
 * for each date and formats it for display.
 * @param {Array} submissions - An array of submission dates in ISO format.
 */
function renderSubmissions(submissions) {
  const submissionsContainer = document.getElementById("submissions-items");

  let submissionsHtml = "";

  for (let i = 0; i < submissions.length; i++) {
    let date = new Date(submissions[i]);
    let duration = "";

    // Calculate duration if not the oldest submission
    if (i < submissions.length - 1) {
      const nextDate = new Date(submissions[i + 1]);
      const diffMs = date - nextDate; // milliseconds difference
      let diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000)); // days difference
      let diffHrs = Math.floor(
        (diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      ); // hours difference
      let diffMins = Math.round(
        ((diffMs % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / 60000
      ); // minutes difference

      // Format the duration string
      duration = "<p>Duration since last submission: ";
      if (diffDays > 0) duration += `${diffDays}D `;
      if (diffHrs > 0) duration += `${diffHrs}H `;
      if (diffMins > 0) duration += `${diffMins}m`;
      duration += "</p>";
    }

    submissionsHtml += `<div class="submission-item">
                            <p>${date.toLocaleString()}</p> ${duration}
                          </div>`;
  }

  submissionsContainer.innerHTML = submissionsHtml;
}

/**
 * This function is triggered when the submission form is submitted. It prevents the default form submission behavior, retrieves the
 * submitted date, adds it to the list of submissions, sorts the list in descending order, stores the updated list in LocalStorage,
 * and finally renders the updated list in the HTML.
 */
const form = document.getElementById("submission-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const dateInput = document.getElementById("date");

  let submissions = getSubmissions();
  submissions.push(new Date(dateInput.value));

  // Sort the submissions array in descending order
  submissions.sort((a, b) => new Date(b) - new Date(a));

  localStorage.setItem("submissions", JSON.stringify(submissions));

  renderSubmissions(submissions);
});

/**
 * This utility function retrieves the list of submissions from LocalStorage. If no submissions are found, it returns an empty array.
 * @returns {Array} - An array of submission dates in ISO format.
 */
function getSubmissions() {
  return JSON.parse(localStorage.getItem("submissions")) || [];
}

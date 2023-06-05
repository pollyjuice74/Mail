document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document
    .querySelector("#compose")
    .addEventListener("click", () => compose_email());

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";

  // Add event listener to submit button
  document
    .querySelector("#compose-form")
    .addEventListener("submit", send_email);
}

function send_email(event) {
  // Get input values
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  // Make post request
  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients,
      subject,
      body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      load_mailbox("sent"); // Load mailbox after sending mail
    })
    .catch((error) => {
      console.error(error);
    });

  // Prevents default submit behavior
  event.preventDefault();
}

function load_mailbox(mailbox) {
  // Clear the emails view content
  document.querySelector("#emails-view").innerHTML = "";

  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Append CSS styles for email boxes
  const styles = document.createElement("style");
  styles.innerHTML = `
    .email-box {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
    }

    .email-box:hover {
      background-color: #e8f5ff;
    }

    .email-read {
      background-color: lightgray;
    }

    .email-unread {
      background-color: white;
    }
  `;
  document.head.appendChild(styles);

  // Fetch emails for specified mailbox
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      // Create email list
      const emailList = document.createElement("div");
      emailList.id = "email-list";

      // For each email create HTML elements
      emails.forEach((email) => {
        const emailItem = document.createElement("div");
        emailItem.className = "email-box";

        // Set background color
        if (email.read) {
          emailItem.classList.add("email-read");
        } else {
          emailItem.classList.add("email-unread");
        }

        emailItem.innerHTML = `
          <span>${email.sender}</span>
          <span><strong>${email.subject}</strong></span>
          <span>${email.timestamp}</span>`;

        // Listener to view email details
        emailItem.addEventListener("click", () => {
          view_email(email.id, mailbox);
        });

        // Add to parent div
        emailList.appendChild(emailItem);
      });

      // Append emailList to emails-view div
      const emailsView = document.querySelector("#emails-view");
      emailsView.appendChild(emailList);
    })
    .catch((error) => {
      console.error(error);
    });
}

function view_email(emailId, mailbox) {
  // Clear the emails view content
  document.querySelector("#emails-view").innerHTML = "";

  fetch(`emails/${emailId}`)
    .then((response) => response.json())
    .then((email) => {
      if (!email.read) {
        fetch(`emails/${email.id}`, {
          method: "PUT",
          body: JSON.stringify({
            read: true,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // Create HTML elements for email details
      const emailView = document.querySelector("#emails-view");
      emailView.innerHTML = `
        <h2>${email.subject}</h2>
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <p>${email.body}</p>
      `;

      if (mailbox !== "sent") {
        // Create Archive or Unarchive button based on the mailbox
        const button = document.createElement("button");
        button.className = "btn btn-sm btn-outline-primary";
        button.addEventListener("click", () => {
          toggle_archive(emailId, email.archived);
        });

        if (email.archived) {
          button.textContent = "Unarchive";
        } else {
          button.textContent = "Archive";
        }

        emailView.appendChild(button);
      }

      // Create Reply button
      const replyButton = document.createElement("button");
      replyButton.className = "btn btn-sm btn-outline-primary";
      replyButton.textContent = "Reply";
      replyButton.addEventListener("click", () => {
        reply_email(email);
      });

      emailView.appendChild(replyButton);
    })
    .catch((error) => {
      console.error(error);
    });
}

function toggle_archive(emailId, currentArchivedStatus) {
  const archiveStatus = !currentArchivedStatus;

  fetch(`emails/${emailId}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: archiveStatus,
    }),
  })
    .then((result) => {
      console.log(result);
      load_mailbox("inbox"); // Load archive mailbox after archiving or unarchiving email
    })
    .catch((error) => {
      console.error(error);
    });
}

function reply_email(email) {
  document.querySelector("#compose-view").style.display = "block";

  // Pre-fill fields
  const recipients = email.sender;
  const originalSubject = email.subject;
  let subject = "";
  if (originalSubject.startsWith("Re: ")) {
    subject = originalSubject;
  } else {
    subject = "Re: " + originalSubject;
  }
  const body = "";

  const emailBody = `On ${email.timestamp} ${
    email.sender
  } wrote:\n\n${addIndentation(email.body)}`;

  document.querySelector("#compose-recipients").value = recipients;
  document.querySelector("#compose-subject").value = subject;
  document.querySelector("#compose-body").value = body;
  document.querySelector("#compose-body").placeholder = emailBody;

  // Remove event listener from submit button (to prevent multiple listeners)
  const composeForm = document.querySelector("#compose-form");
  const newComposeForm = composeForm.cloneNode(true);
  composeForm.parentNode.replaceChild(newComposeForm, composeForm);

  // Add event listener to submit button
  newComposeForm.addEventListener("submit", send_email);
}

function addIndentation(text) {
  const lines = text.split("\n");
  const indentedLines = lines.map((line) => "  " + line);
  return indentedLines;
}

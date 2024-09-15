# E-mail
This is a application implementing e-mail where a user that is logged in has an Inbox of recieved emails, can Compose emails, has a Sent and Archived emails boxes. 

![Alt text](Screenshot 2024-09-15 175642.png)


What is interesting about this proyect is the API functionalities implemented in these urls:

```
path("emails", views.compose, name="compose"),
path("emails/<int:email_id>", views.email, name="email"),
path("emails/<str:mailbox>", views.mailbox, name="mailbox")
```

And that they were linked and made work in this file:
`mail/static/mail/inbox.js`

# E-mail
This is a application implementing e-mail where a user that is logged in has an Inbox of recieved emails, can Compose emails, has a Sent and Archived emails boxes. 

![image](https://github.com/user-attachments/assets/9dae6b2f-da8f-40b6-9d82-419c42003633)



What is interesting about this proyect is the API functionalities implemented in these urls:

At file:  `mail/urls.py`
```
path("emails", views.compose, name="compose"),
path("emails/<int:email_id>", views.email, name="email"),
path("emails/<str:mailbox>", views.mailbox, name="mailbox")
```

And that they were linked and made work in this file:
`mail/static/mail/inbox.js`

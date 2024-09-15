# E-mail
This is a application implementing e-mail where a user that is logged in has an Inbox of recieved emails, can Compose emails, has a Sent and Archived emails boxes. 

What is interesting about this proyect is the API functionalities implemented in these urls:

At file:  `mail/urls.py`
```
path("emails", views.compose, name="compose"),
path("emails/<int:email_id>", views.email, name="email"),
path("emails/<str:mailbox>", views.mailbox, name="mailbox")
```

And that they were linked and made work in this file:
`mail/static/mail/inbox.js`

## Inbox window
![image](https://github.com/user-attachments/assets/0cbde949-3d4d-4c71-81e7-43c3717a8e71)

## Mail viewing window
![image](https://github.com/user-attachments/assets/cdc5743f-03ce-48ca-a39c-fa4c8690af54)


## Compose window
![image](https://github.com/user-attachments/assets/9dae6b2f-da8f-40b6-9d82-419c42003633)



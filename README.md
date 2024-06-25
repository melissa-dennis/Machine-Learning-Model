# COMP377_AI_Project_frontend

# GROUP 8: 
Melissa Jane Dennis - 301283465


# Overview
This project is the frontend for the COMP377 AI Project. It uses React.js to create an interactive web interface that communicates with the backend via a RESTful API.

# Technical Stack
- **Frontend Framework**: React.js
- **Languages**: HTML, CSS, JavaScript
- **API Technique**: RESTful API

# INSTRUCTIONS TO RUN THE APPLICATION
1. npm install - to install all dependencies

Runs the app in the development mode.\
Open [http://localhost:3000] to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


# Registration:
- Users can register as either a user or an admin.
- Passwords are securely hashed and stored in MongoDB under the `users` collection.
- Upon successful registration, a success message will be displayed, prompting the user to log in.

# Log in
- Robust authentication setup allows users to log in as either a user or an admin.
- Users are redirected to the `predictPage` after login, where they are prompted to fill out a form for prediction. Predictions are stored in MongoDB under the `predictions` collection.
- Admins are redirected to the `adminPage` where they can view all predictions and have the ability to delete them.

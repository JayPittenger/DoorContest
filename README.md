# DoorContest
A full-stack web application used by a non-profit in order to have residents vote in a door decoration contest.


Application was originally designed to run on Heroku with a mySQL database provisioned. However, I have modified it such that SQL database details in photoContest.js have been removed, and the application can be run locally without a database. 

Web page can be viewed locally by installing node, express. express-handlebars, and then running photoContest.js by typing in 'node photoContest.js' and viewing the application in your browser via 'http://localhost:5000'

Application consists of:
photoContest.js - The backend node.js file that handles html fed to frontend via handlebars, and handles requests to database for voting.
photoVote.js - handles the frontend javascript for voting mechanism and requests to backend.

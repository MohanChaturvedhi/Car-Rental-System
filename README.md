<div align="center">
  <h3 align="center">Car Rental System</h3>
  <p align="center">A full stack web application for managing car rental service</p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#website-urls">Website URLs</a>
      <ul>
        <li><a href="#user-page-urls">User Page URLs</a></li>
        <li><a href="#admin-page-urls">Admin Page URLs</a></li>
      </ul>
    </li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
  </ol>
</details>

## Website URLs

### User Page URLs
* https://silly-lime-crane.cyclic.app/
* https://car-rental-system-g6bb.onrender.com/

### Admin Page URLs
* https://silly-lime-crane.cyclic.app/admin
* https://car-rental-system-g6bb.onrender.com/admin



## About The Project

[![image](https://github.com/vanumdaniel7/car-rental-system-source-code/assets/98738744/d2ad22c4-a95e-4690-a4dc-d2b4f990342d)](https://car-rental-system-g6bb.onrender.com/)

Car Rental System is a full-stack web application designed to streamline the process of managing car rental services. It provides an intuitive platform for both users and administrators to browse available vehicles, make reservations, manage bookings, and handle administrative tasks efficiently.

Features:
* **Authentication features**:
  - User-friendly signup and signin processes.
  - Password reset functionality via email for user convenience.
  - Email verification to ensure account security.

* **User Functions**:
  - Comprehensive car search capabilities.
  - Convenient rental and return processes.
  - Flexible profile management options.
  - Ability to add balance to accounts for extended rental options.

* **Admin Functions**:
  - Effortless addition or removal of cars from the system.
  - Streamlined management of rental operations.



### Built With

* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![Express][Express.js]][Express-url]
* [![React][React.js]][React-url]
* [![Node][Node.js]][Node-url]



## Installation

1. **Get Database URI and Gmail Account**:
   - Obtain a free database URI at [https://www.postgresql.org/](https://www.postgresql.org/)
   - Create a Gmail account for sending emails and obtain its app password.

2. **Clone the Repository**:
   ```sh
   git clone https://github.com/vanumdaniel7/car-rental-system-source-code.git
   ```
3. Navigate to both the client and server folders and run:
   ```sh
   npm install
   ```
4. Create an .env file in the server folder and add the following environment variables
   ```text
   CONNECTION_STRING=<PostgreSQL URI>
   MAIL_PASSWORD=<App password the gmail account>
   DOMAIN=<Domain of the web application>
   ACCESS_TOKEN_SECRET=<Access token secret used for JWT authentication>
   ADMIN_ACCESS_KEY=<Admin page password>
   ```
5. Start the Application
   * Navigate to the server folder and run the following command to start the server:
     ```sh
     node index.js
     ```
   * Navigate to the client folder and run the following command to start the client:
     ```sh
     npm start
     ```

[PostgreSQL]: https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Express.js]: https://img.shields.io/badge/express-eeeeee?style=for-the-badge&logo=express&logoColor=black
[Express-url]: https://expressjs.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/node-6da55f?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/

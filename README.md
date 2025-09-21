# Hotel Booking Web App

Project Description
This is a full-stack web application designed for browsing and booking hotels. The platform allows users to securely register, search for accommodations based on specific criteria, and complete their reservations through a secure payment gateway. The application is built to be responsive and user-friendly, providing a smooth experience from search to checkout.

## Key Features

**User Authentication**: Implemented secure user sign-up, login, and session management using JSON Web Tokens (JWT) for protected routes.

**Search & Filtering**: Robust search functionality allows users to find hotels by filtering criteria such as price range, room type, and the number of guests.

**Secure Payment Processing**: Seamless integration with the Stripe API to handle credit card payments securely and efficiently.

**Full-Stack Architecture**: A single-page application built with a React frontend and a RESTful API backend powered by Express.js.

**Image Storage**: Utilizes the Cloudinary API for efficient and scalable cloud-based image storage.

**Data Validation**: Comprehensive client and server-side data validation to ensure data integrity and security.

## Technologies Used

### Frontend

- React: The core JavaScript library for building the user interface.

- React Router DOM: For client-side routing and navigation.

- Tailwind CSS: For fast and responsive styling.

### Backend

- Node.js & Express.js: The runtime environment and framework for the backend API.

- MongoDB & Mongoose: A NoSQL database and its object data modeling (ODM) library for data persistence.

- JSON Web Tokens (JWT): For secure, stateless authentication.

- Bcrypt.js: To securely hash user passwords.

- Stripe API: For handling secure payment transactions.

## Installation & Setup

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

To get a local copy of this project up and running, follow these steps.

1. Clone the repository:

```bash
git clone https://github.com/hasheddev/hotel_booking_mern.git
```

2. Install dependencies:
   Navigate into both the client and server directories and install dependencies for each.

```bash
cd hotel-booking-app
cd fontend
npm install
cd ../backend
npm install
```

3. Configure environment variables:

- Create a .env file in the backend directory and add the following variables.

```bash
MONGODB_CONNECTION_STRING
NODE_ENV
JWT_SECRET_KEY
FRONTEND_URL

#Cloudinary Image storage
CLOUDUNARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_KEY_SECRET
STRIPE_API_KEY
```

- Create a .env file in the frontend directory and add the following variables.

```bash
VITE_API_BASE_URL
VITE_STRIPE_PUB_KEY
```

4. Run the application:
   Start both the frontend and backend servers.

- In the backend directory

```bash
npm run dev
```

- In a new terminal, in the frontend directory

```bash
npm run dev
```

visit localhost:3000

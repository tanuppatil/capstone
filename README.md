# AttendMate

AttendMate is a MERN (MongoDB, Express.js, React.js, Node.js) stack application designed to simplify attendance tracking for teachers and students. With AttendMate, teachers can easily create attendance sessions, specifying location radius preferences, which generate unique QR codes. Students can then scan these codes or use a provided URL to log in and mark their attendance. The application automatically fetches the student's location upon attendance submission, ensuring accuracy and security.

## Features

- **Session Creation**: Teachers can create attendance sessions with specified location radius preferences.
- **Automatic Location Detection**: AttendMate automatically detects the teacher's location to generate accurate attendance sessions.
- **QR Code Generation**: Each attendance session generates a unique QR code for easy student access.
- **Flexible Access**: Students can either scan the QR code or use the provided URL to access the attendance session.
- **Secure Authentication**: AttendMate uses JWT for authentication, hashing and salting user passwords for security.
- **Integrated Database**: All session details and attendance records are stored in a MongoDB database for easy reference.
- **User-friendly Interface**: Intuitive interface for both teachers and students.
- **Dashboard for Teachers and Students**: Teachers have a dashboard to manage sessions and view attendance details, while students can view their attendance records and session details.
- **Location Validation**: Built-in location validation to ensure students are physically present in the class before they can mark their attendance.
- **Export and Analysis**: Tools to export attendance data for further analysis or record-keeping.

## Getting Started

### Prerequisites

- Node.js v16 or above
- MongoDB account
- npm or yarn

### Installation and Setup

To run AttendMate locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the server dependencies:
```bash
cd server
npm install
```
4. Install the client dependencies:
```bash
cd ../client
npm install
```
5. Start the development server:
```bash
npm start
```

### Usage

#### For Teachers

- After creating an account and logging in, you'll be directed to your dashboard.
- Navigate to the dashboard and create a new attendance session.
- Specify the parameters for the session such as class name, time, and distance parameter for attendance.
- Once the session is created, students can access it using the generated QR code or URL.
- View attendance details and student submissions on the dashboard.

#### For Students

- Create an account or log in to the application.
- Access the attendance session by scanning the QR code or using the provided URL.
- Enter your roll number and take a picture for attendance verification.
- Submit your attendance, which includes automatic location detection.
- View your attendance records and session details on the dashboard.

## Deployment

The application is deployed and accessible at [AttendMate Deploy](https://attendmate-deploy.onrender.com).


## Contact

For questions or feedback, feel free to contact us at [rahulagniotri4444@gmail.com](mailto:rahulagniotri4444@gmail.com), [dhruvilpatel2002@gmail.com](mailto:dhruvilpatel2002@gmail.com).

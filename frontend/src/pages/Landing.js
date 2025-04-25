import React from "react";
import { useEffect } from "react";
import "../styles/Landing.css";
import { Link } from "react-router-dom";
// import About from "./About";  // Comment this line

const Landing = () => {
  // Tutorial functionality commented out
  // const [Tutorial, setTutorial] = React.useState(
  //   localStorage.getItem("tutorial") ? false : true
  // );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  });

  // function toggleDone() {
  //   setTutorial(false);
  //   localStorage.setItem("tutorial", false);
  // }

  return (
    <div className="landing-main">
      {/* Tutorial component commented out - remove this section
      {Tutorial ? (
        <About toggleDone={toggleDone} />
      ) : ( ... )}
      */}
      <div className="landing-main">
        <h1>ATTENDMATE</h1>
        <p>Welcome to AttendMate your smart attendance companion</p>
        <Link to="/login" className="landing-login-button">
          Login
        </Link>
        <Link to="/register" className="landing-register-button">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
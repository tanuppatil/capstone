//create a new session component
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/StudentForm.css";

const StudentForm = ({ togglePopup }) => {
  //eslint-disable-next-line
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [image, setImage] = useState({ contentType: "", data: "" });
  const [photoData, setPhotoData] = useState(""); // To store the captured photo data
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  const constraints = {
    video: true,
  };

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera();
      }
    };
  }, []);

  const startCamera = () => {
    setCameraError(null);
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setCameraStarted(true);
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          setCameraError("Failed to access camera. Please check your camera permissions.");
        });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraStarted(false);
    }
  };

  const capturePhoto = async () => {
    // Check if video is ready
    if (!videoRef.current || !videoRef.current.srcObject || !cameraStarted) {
      alert("Camera is not started. Please start the camera first.");
      return;
    }

    // Check if video has loaded dimensions
    if (!videoRef.current.videoWidth) {
      alert("Camera feed not ready yet. Please wait a moment and try again.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const photoDataUrl = canvas.toDataURL("image/png");

      setImage(await fetch(photoDataUrl).then((res) => res.blob()));

      setPhotoData(photoDataUrl);
      stopCamera();
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("Failed to capture photo. Please try again.");
    }
  };

  const ResetCamera = () => {
    setPhotoData("");
    startCamera();
  };

  const AttendSession = async (e) => {
    e.preventDefault();
    let regno = e.target.regno.value;
    
    if (!photoData) {
      alert("Please capture your photo before submitting");
      return;
    }
    
    //get user IP address
    axios.defaults.withCredentials = false;
    const res = await axios.get("https://api64.ipify.org?format=json");
    axios.defaults.withCredentials = true;
    //
    let IP = res.data.ip;
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let locationString = `${latitude},${longitude}`;

          if (regno.length > 0) {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("regno", regno);
            formData.append("session_id", localStorage.getItem("session_id"));
            formData.append("teacher_email", localStorage.getItem("teacher_email"));
            formData.append("IP", IP);
            formData.append("date", new Date().toISOString().split("T")[0]);
            formData.append("Location", locationString);
            formData.append("student_email", localStorage.getItem("email"));
            
            // Convert blob to file
            if (image instanceof Blob) {
              const imageFile = new File([image], "student-photo.png", { type: "image/png" });
              formData.append("image", imageFile);
            }
            
            try {
              console.log("sending data to server");
              const response = await axios.post(
                "http://localhost:5050/sessions/attend_session",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              //replace the contents of the popup with the QR code
              document.querySelector(
                ".form-popup-inner"
              ).innerHTML = `<h5>${response.data.message}</h5>`;
            } catch (err) {
              console.error(err);
              alert("Error submitting attendance: " + (err.response?.data?.message || err.message));
            }
          } else {
            alert("Please fill all the fields");
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          alert("Error getting your location. Please allow location access and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="form-popup">
      <button onClick={togglePopup}>
        <strong>X</strong>
      </button>
      <div className="form-popup-inner">
        <h5>Enter Your Details</h5>
        {cameraError && <div className="error-message">{cameraError}</div>}
        {!photoData && <video ref={videoRef} width={300} height={225} autoPlay={true} playsInline={true} />}
        {photoData && <img src={photoData} width={300} alt="Captured" />}
        <div className="cam-btn">
          {!cameraStarted && !photoData && <button onClick={startCamera}>Start Camera</button>}
          {cameraStarted && !photoData && <button onClick={capturePhoto}>Capture</button>}
          {photoData && <button onClick={ResetCamera}>Reset</button>}
        </div>

        <form onSubmit={AttendSession}>
          <input
            type="text"
            name="regno"
            placeholder="RegNo"
            autoComplete="off"
            required
          />
          <button type="submit">Submit Attendance</button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;

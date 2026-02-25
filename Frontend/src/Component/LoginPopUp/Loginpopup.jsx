import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import "./Loginpopup.css";
import { storeContext } from "../../Context/Context";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const LoginPopup = ({ showLogin, setShowLogin }) => {
  const { url, setToken } = useContext(storeContext);

  const [currentState, setCurrentState] = useState("signup");
  const [step, setStep] = useState("form");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  useEffect(() => {
    setStep("form");
    setOtp("");
    setPasswordError("");
  }, [currentState, showLogin]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" && currentState === "signup") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must contain uppercase, lowercase, number, special character & minimum 8 characters"
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (currentState === "signup" && passwordError) {
      alert("Please fix password requirements");
      return;
    }

    try {
      const endpoint =
        currentState === "login"
          ? "/api/user/login"
          : "/api/user/register";

      const payload =
        currentState === "signup"
          ? {
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
            }
          : {
              email: formData.email.trim(),
              password: formData.password,
            };

      const response = await axios.post(url + endpoint, payload);

      if (!response.data.success) {
        alert(response.data.message);
        return;
      }

      if (currentState === "login") {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      }

      if (currentState === "signup") {
        setStep("otp");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong during signup/login");
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url + "/api/user/verify-otp", {
        email: formData.email.trim(),
        otp,
      });

      if (!response.data.success) {
        alert(response.data.message);
        return;
      }

      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } catch (err) {
      console.log(err);
      alert("OTP verification failed");
    }
  };

  if (!showLogin) return null;

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <img
          src={assets.cross_icon}
          alt="close"
          className="close-icon"
          onClick={() => setShowLogin(false)}
        />

        {step === "form" && (
          <>
            <h2>{currentState === "signup" ? "Create Account" : "Login"}</h2>

            <form onSubmit={onSubmitForm}>
              {currentState === "signup" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={onChangeHandler}
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChangeHandler}
                required
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  required
                  style={{ paddingRight: "190px" }}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={showPassword ? assets.show : assets.hide}
                    alt="toggle password"
                    style={{ width: "20px", height: "20px" }}
                  />
                </span>
              </div>

              {passwordError && currentState === "signup" && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "6px",
                  }}
                >
                  {passwordError}
                </p>
              )}

              <button type="submit">
                {currentState === "signup" ? "Sign Up" : "Login"}
              </button>
            </form>

            <p>
              {currentState === "signup"
                ? "Already have an account?"
                : "Don’t have an account?"}{" "}
              <span
                onClick={() =>
                  setCurrentState(
                    currentState === "signup" ? "login" : "signup"
                  )
                }
              >
                {currentState === "signup" ? "Login" : "Sign Up"}
              </span>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <h2>Verify OTP</h2>
            <form onSubmit={onVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit">Verify</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
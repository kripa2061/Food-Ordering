import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../Context/Context";
import { assets } from "../../assets/frontend_assets/assets";
import "./Loginpopup.css";
import axios from "axios";

const LoginPopup = ({ showLogin, setShowLogin }) => {
  const { url, fetchUser } = useContext(StoreContext);

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
      setPasswordError(
        !passwordRegex.test(value)
          ? "Password must contain uppercase, lowercase, number, special character & minimum 8 characters."
          : ""
      );
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (currentState === "signup" && passwordError) {
      return alert("Please enter a valid password.");
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

      const response = await axios.post(url + endpoint, payload, {
        withCredentials: true,
      });

      if (!response.data.success) {
        return alert(response.data.message);
      }

      if (currentState === "login") {
        await fetchUser();
        setShowLogin(false);
      }

      if (currentState === "signup") {
        setStep("otp");
      }
    } catch (error) {
      console.error(error);
      alert("Login/Signup failed");
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        url + "/api/user/verify-otp",
        {
          email: formData.email.trim(),
          otp,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        return alert(response.data.message);
      }

      await fetchUser();
      setShowLogin(false);
    } catch (error) {
      console.error(error);
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

        {step === "form" ? (
          <>
            <h2>
              {currentState === "signup"
                ? "Create Account"
                : "Login"}
            </h2>

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

              <div className="password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  className="password-input"
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? assets.show : assets.hide}
                    alt="toggle"
                    className="toggle-password-icon"
                  />
                </span>

              </div>

              {passwordError && currentState === "signup" && (
                <p className="password-error">
                  {passwordError}
                </p>
              )}

              <button type="submit">
                {currentState === "signup"
                  ? "Sign Up"
                  : "Login"}
              </button>

            </form>

            <p>
              {currentState === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}

              <span
                onClick={() =>
                  setCurrentState(
                    currentState === "signup"
                      ? "login"
                      : "signup"
                  )
                }
              >
                {currentState === "signup"
                  ? " Login"
                  : " Sign Up"}
              </span>
            </p>
          </>
        ) : (
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

              <button type="submit">
                Verify
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default LoginPopup;
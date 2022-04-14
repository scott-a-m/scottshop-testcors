import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import FormRow from "../components/FormRow";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../context/User_Context";
import Message from "../components/Message";

const ResetPassword = () => {
  const { showMessage, message } = useUserContext();

  const query = new URLSearchParams(useLocation().search);

  const [newPassword, setNewPassword] = useState("");

  const [btnStatus, setbtnStatus] = useState({
    text: "Submit",
    disabled: false,
    opacity: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPasswordData = {
      password: newPassword,
      token: query.get("token"),
      email: query.get("email"),
    };

    setbtnStatus({
      opacity: 0.5,
      text: "Loading",
      disabled: true,
    });

    if (newPassword.length < 6) {
      showMessage(
        true,
        "error-msg",
        "please make sure password has six or more characters"
      );
      setbtnStatus((btnData) => ({
        text: "Submit",
        disabled: false,
        opacity: 1,
      }));
      setNewPassword("");
      return;
    }
    try {
      await axios.post(`/api/v1/auth/reset-password`, newPasswordData);
      setbtnStatus((btnData) => ({
        ...btnData,
        text: "Updated",
        disabled: true,
      }));
      setNewPassword("");
      showMessage(
        true,
        "success-msg",
        <p>
          Password updated! Please{" "}
          <Link to="/login" className="text-link">
            Login
          </Link>
          .
        </p>
      );
    } catch (err) {
      setNewPassword("");

      if (err.response.data.msg) {
        showMessage(true, "error-msg", err.response.data.msg);
        setbtnStatus((btnData) => ({
          text: "Submit",
          disabled: false,
          opacity: 1,
        }));
        return;
      }
      showMessage(true, "error-msg", "Error: Please try again");
    }
  };

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  useEffect(() => {
    showMessage();
  }, [showMessage]);

  return (
    <div>
      <div className="form-container">
        <div className="form-box">
          <h1 className="font-heading text-3xl p-4">New Password</h1>
          {message.show && <Message />}
          <form onSubmit={handleSubmit}>
            <FormRow
              name="password"
              type="password"
              value={newPassword}
              onChangeFunc={handleChange}
            />
            <button
              className="btn"
              disabled={btnStatus.disabled}
              type="submit"
              style={{ opacity: btnStatus.opacity }}
            >
              {btnStatus.text}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

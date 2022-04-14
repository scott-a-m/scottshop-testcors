import React, { useEffect } from "react";
import { useUserContext } from "../context/User_Context";

const Message = () => {
  const { showMessage, message } = useUserContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      showMessage();
    }, 4000);
    return () => clearTimeout(timeout);
  });

  return <div className={message.type}>{message.msg}</div>;
};

export default Message;

import React from 'react'
import {
    CLIENT_ID,
    IDENTITY_SERVER_URL,
    CALLBACK_URL,
} from "../config";

const Login = () => {

    const openLogin = () => {
        let redirectUrl =
          IDENTITY_SERVER_URL +
          "/?callback_url=" +
          CALLBACK_URL +
          "&client_id=" +
          CLIENT_ID;
      
        window.location.href = redirectUrl;
    };
  return (
    <>
        {openLogin()}
    </>
  )
}

export default Login
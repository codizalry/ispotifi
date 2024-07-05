import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BasicAuth = () => {
  useEffect(()=>{
    if ("code_verifier" in sessionStorage && sessionStorage.getItem("access_token") !== 'undefined') { } else {
        sessionStorage.clear();
        window.location.href = "/";
        return;
      }
    }, []);
}

export default BasicAuth

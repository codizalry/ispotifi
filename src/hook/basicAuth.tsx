import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BasicAuth = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    if ("code_verifier" in sessionStorage && sessionStorage.getItem("access_token") !== 'undefined') { } else {
        sessionStorage.clear();
        // navigate("/");
        window.location.href = "/";
        return;
      }
    }, []);
}

export default BasicAuth

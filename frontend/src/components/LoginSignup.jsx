import { SignIn } from "@clerk/clerk-react";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";
const LoginSignup = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-page">

      <div className="bg-gradient"></div>

 <div className="auth-card">

  <div className="brand">
    <h1>💬 ChatFlow</h1>
  </div>

  <SignIn
    routing="path"
    path="/LoginSignup"
    signUpUrl="/signup"
  />

  <div className="signup-link">
    <span>Don't have an account? </span>

    <button
      type="button"
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </button>
  </div>

</div>

    </div>
  );
};

export default LoginSignup;
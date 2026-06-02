import { SignIn } from "@clerk/clerk-react";
import "./LoginSignup.css";

const LoginSignup = () => {
  return (
    <div className="auth-page">

      <div className="bg-gradient"></div>

      <div className="auth-card">

<div className="brand">
  <h1>💬 ChatFlow</h1>
</div>

<SignIn />


      </div>

    </div>
  );
};

export default LoginSignup;
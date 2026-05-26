import { SignIn } from "@clerk/clerk-react";

const LoginSignup = () => {
  return (
    <div className="auth-container">
      <SignIn />
    </div>
  );
};

export default LoginSignup;
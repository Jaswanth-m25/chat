import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <h1>💬 ChatFlow</h1>
        </div>

        <SignUp
          signInUrl="/LoginSignup"
        />
      </div>
    </div>
  );
};

export default Signup;
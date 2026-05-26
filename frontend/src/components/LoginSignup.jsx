import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const LoginSignup = () => {

  const { user, isSignedIn } = useUser();

  useEffect(() => {

    const syncUser = async () => {

      if (!user) return;

      try {

        await axios.post(
          'https://chat-backend-da9m.onrender.com/api/clerk/sync-user',
          {
            clerkId: user.id,
            username: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl
          }
        );

        console.log("User synced");
        console.log(user);
        console.log("Calling backend...");

      } catch (error) {

        console.error("Sync failed", error);
      }
    };

    if (isSignedIn) {
      syncUser();
    }

  }, [isSignedIn, user]);

  return (
    <div className="auth-container">
      <SignIn />
    </div>
  );
};

export default LoginSignup;
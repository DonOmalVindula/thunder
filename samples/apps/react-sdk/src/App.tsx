import "./App.css";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <>
      <SignedIn>
        <DashboardLayout>
          <HomePage />
        </DashboardLayout>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}

export default App;

import "./App.css";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <SignedIn>
        <HomePage />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}

export default App;

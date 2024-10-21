import Layout from "@/components/Layout";
import Router from "@/components/Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebaseApp";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth.currentUser,
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setInit(true);
    });
  }, [auth]);

  return (
    <Layout>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : "loading"}
    </Layout>
  );
}

import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import Navbar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CvPage from "./pages/CvPage";
import InfoPage from "./pages/InfoPage";
import AdminPage from "./pages/AdminPage";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

function App() {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);

  return (
    <div id="app-container">
      <div className="background-overlay"></div>
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/cv"
              element={isLoggedIn && role ? <CvPage /> : <InfoPage />}
            />
            <Route path="/info" element={<InfoPage />} />
            <Route
              path="/admin"
              element={
                isLoggedIn && role === "admin" ? <AdminPage /> : <InfoPage />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;

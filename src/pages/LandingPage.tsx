import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import "../styles/pages/landingpage.css";
import heroImage from "../assets/images/hero-section-image.jpg";

function LandingPage() {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);

  const targetPath = isLoggedIn && role ? "/cv" : "/info";

  return (
    <div className="landing-hero">
      <div className="landing-hero-wrapper">
        <div className="hero-content">
          <h1>Welcome to your last resume creation tool</h1>
          <p>Effortlessly create and manage your CV.</p>
          <Link to={targetPath}>
            <button className="hero-btn">Get Started</button>
          </Link>
        </div>
        <div className="landing-hero-right">
          <img src={heroImage} alt="CVP Logo" className="heroImage" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

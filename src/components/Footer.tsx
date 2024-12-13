import "../styles/components/footer.css";
import { CiLinkedin } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { CiFacebook } from "react-icons/ci";

function Footer() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} CV Portal. Developed by{" "}
        <span>
          <a href="https://www.grimholt.me">grimholt.dev</a>
        </span>{" "}
        .
      </p>
      <div className="some-icons">
        <a href="https://www.linkedin.com/in/odd-grimholt-7b1954ab">
          <CiLinkedin className="footer-icon" />
        </a>
        <a href="https://www.skydivetonsberg.no/kurs">
          <CiFacebook className="footer-icon" />
        </a>
        <a href="https://www.instagram.com/gokstadakademiet/">
          <CiInstagram className="footer-icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;

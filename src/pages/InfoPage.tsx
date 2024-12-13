import React, { useState } from "react";
import "../styles/pages/infopage.css";

function InfoPage() {
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqPassword, setReqPassword] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reqName,
        email: reqEmail,
        password: reqPassword,
      }),
    });
    if (!res.ok) {
      alert("Failed to send request");
    } else {
      alert("Registration request sent. Please wait for admin approval.");
      setReqName("");
      setReqEmail("");
      setReqPassword("");
    }
  };

  return (
    <div className="infopage-wrapper">
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Apply for an account </h2>
        <p>Submit your details and wait for approval.</p>
        <form
          onSubmit={handleRequest}
          style={{ display: "inline-block", textAlign: "left" }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={reqName}
            onChange={(e) => setReqName(e.target.value)}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={reqEmail}
            onChange={(e) => setReqEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={reqPassword}
            onChange={(e) => setReqPassword(e.target.value)}
          />
          <br />
          <button type="submit">Request Account</button>
        </form>
      </div>
    </div>
  );
}

export default InfoPage;

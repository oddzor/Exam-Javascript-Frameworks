import { useEffect, useState } from "react";
import { WaitlistEntry } from "../types/types";
import "../styles/components/waitlist.css";

interface WaitlistProps {
  onUsersUpdated: () => void;
}

function Waitlist({ onUsersUpdated }: WaitlistProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWaitlist = async () => {
    const res = await fetch("http://localhost:5000/api/waitlist", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const approve = async (entry: WaitlistEntry) => {
    const resUser = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: entry.name,
        email: entry.email,
        password: entry.password,
      }),
    });

    if (resUser.ok) {
      if (entry._id) {
        const resDel = await fetch(
          `http://localhost:5000/api/waitlist/${entry._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (resDel.ok) {
          alert("Approved and user created");
          fetchWaitlist();
          onUsersUpdated();
        }
      }
    } else {
      alert("Failed to approve");
    }
  };

  const reject = async (entryId?: string) => {
    if (!entryId) return;
    const resDel = await fetch(
      `http://localhost:5000/api/waitlist/${entryId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (resDel.ok) {
      alert("Rejected request");
      fetchWaitlist();
    } else {
      alert("Failed to reject");
    }
  };
  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedEntries = filteredEntries.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Pending Registrations</h3>
      <div className="waitlist-search-container">
        <input
          type="text"
          placeholder="Search waitlist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="waitlist-search"
        />
      </div>
      {sortedEntries.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="waitlist-list-container">
          <ul className="waitlist-list">
            {sortedEntries.map((e) => (
              <li key={e._id} className="waitlist-item">
                <div className="waitlist-info">
                  <div className="waitlist-info-field">
                    <span className="waitlist-label">Name:</span>
                    <span className="waitlist-value">{e.name}</span>
                  </div>
                  <div className="waitlist-info-field">
                    <span className="waitlist-label">Email:</span>
                    <span className="waitlist-value">{e.email}</span>
                  </div>
                </div>
                <div className="waitlist-actions">
                  <button onClick={() => approve(e)}>Approve</button>
                  <button onClick={() => reject(e._id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Waitlist;

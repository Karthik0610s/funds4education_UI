import React, { useState } from "react";
import "../../pages/styles.css";
import Header from "../../app/components/header/header";

const scholarships = [
  { id: 1, title: "Merit Scholarship", amount: "$2,000", deadline: "May 31, 2024" },
  { id: 2, title: "Women in STEM Award", amount: "$5,000", deadline: "June 15, 2024" },
  { id: 3, title: "Community Service Scholarship", amount: "$1,500", deadline: "July 10, 2024" },
  { id: 4, title: "Future Leaders Scholarship", amount: "$3,000", deadline: "August 20, 2024" },
];

export default function ScholarshipDiscovery() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // Filter logic (right now only search filters)
  const filtered = scholarships.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />

      <div className="scholarship-page">
        {/* Search Bar */}
       {/* Search Bar */}
<div className="search-container">
  <div className="search-group">
    <input
      type="text"
      placeholder="Search scholarships"
      className="search-input"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <input
      type="text"
      placeholder="Location"
      className="search-input"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
    <input
      type="text"
      placeholder="Category"
      className="search-input"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />
  </div>

  {/* Button outside the box */}
  <button className="search-btn">Search</button>
</div>

        {/* Main Layout */}
        <div className="layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h2>Saved Scholarships</h2>
            <ul>
              <li>Merit Scholarship</li>
            </ul>

            <h2>Recommendations</h2>
            <ul>
              <li>Science and Technology Scholarship</li>
              <li>Academic Excellence Grant</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="content">
            <h2 className="main-heading">Scholarships</h2>
            <div className="scholarship-list">
              {filtered.map((s) => (
                <div key={s.id} className="card">
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.amount}</p>
                    <p className="deadline">Deadline: {s.deadline}</p>
                  </div>
                  <button className="apply-btn">Apply</button>
                </div>
              ))}
            </div>

            {/* Upcoming Deadlines */}
            <div className="deadlines">
              <h2>Upcoming Deadlines</h2>
              <ul>
                <li>
                  <span>Service to Society Scholarship</span>
                  <span>April 28, 2024</span>
                </li>
                <li>
                  <span>Women in Science Scholarship</span>
                  <span>May 10, 2024</span>
                </li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

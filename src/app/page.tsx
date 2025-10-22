"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Advocate } from "./types/advocate";

function formatPhone(n: number | string) {
  const s = String(n);
  // naive US formatting: 10 digits -> (XXX) XXX-XXXX
  const m = s.match(/^(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : s;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(term) ||
        advocate.lastName.includes(term) ||
        advocate.city.includes(term) ||
        advocate.degree.includes(term) ||
        advocate.specialties.join(", ").toLowerCase().includes(term) ||
        String(advocate.yearsOfExperience).includes(term)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Solace Advocates</h1>

      <div className={styles.search}>
        <label htmlFor="search">Search</label>
        <span className={styles.searchingFor} aria-live="polite">
          Searching for: <strong>{searchTerm}</strong>
        </span>
        <input
          id="search"
          type="search"
          className={styles.input}
          placeholder="Search name, city, degree, specialty…"
          value={searchTerm}
          onChange={onChange}
        />
        <button className={styles.button} onClick={onClick}>
          Reset Search
        </button>
      </div>

      {loading ? (
        <div className={styles.status}>Loading…</div>
      ) : filteredAdvocates.length === 0 ? (
        <div className={`${styles.status} ${styles.empty}`}>
          No results found. Try a different search.
        </div>
      ) : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => (
              <tr
                key={`${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}
              >
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  <ul className={styles.specialtiesList}>
                    {advocate.specialties.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{formatPhone(advocate.phoneNumber)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

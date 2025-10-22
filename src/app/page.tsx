"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./page.module.css";
import { Advocate } from "./types/advocate";

function formatPhone(n: number | string) {
  const s = String(n);
  const m = s.match(/^(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : s;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/advocates?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  const onChange = (e) => setSearchTerm(e.target.value);
  const onClick = () => setSearchTerm("");

  const filteredAdvocates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return advocates;
    return advocates.filter((a) =>
      [
        a.firstName,
        a.lastName,
        a.city,
        a.degree,
        ...(a.specialties || []),
        String(a.yearsOfExperience),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [advocates, searchTerm]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Solace Advocates</h1>

      <div className={styles.search}>
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          className={styles.input}
          value={searchTerm}
          onChange={onChange}
          placeholder="Search name, city, degree, specialty…"
        />
        <button className={styles.button} onClick={onClick}>
          Reset Search
        </button>
      </div>

      {loading ? (
        <div className={styles.status}>Loading…</div>
      ) : filteredAdvocates.length === 0 ? (
        <div className={`${styles.status} ${styles.empty}`}>
          No results found.
        </div>
      ) : (
        <>
          <div className={styles.search} style={{ justifyContent: "center" }}>
            <button
              className={styles.button}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span className={styles.searchingFor}>Page {page}</span>
            <button
              className={styles.button}
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || advocates.length < limit}
            >
              Next
            </button>
          </div>

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
        </>
      )}
    </main>
  );
}

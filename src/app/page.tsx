"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Advocate } from "./types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
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
      <br />
      <div className={styles.search}>
        <p>Search</p>
        <p className={styles.searchingFor}>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          className={styles.input}
          value={searchTerm}
          onChange={onChange}
        />
        <button className={styles.button} onClick={onClick}>
          Reset Search
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
              <tr key={`${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td className={styles.specialties}>
                  {advocate.specialties.map((s) => (
                  <div key={s}>{s}</div>  
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

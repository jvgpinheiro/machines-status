"use client";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
export type AvailablePages =
  | "home"
  | "assets"
  | "users"
  | "units"
  | "workOrders";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState<AvailablePages>("home");
  const [isFetching, setFetchingStatus] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<any>([]);

  useEffect(() => {
    if (selectedPage === "home") {
      return;
    }
  }, [selectedPage]);

  useEffect(() => {
    isFetching;
  }, [isFetching]);

  function changePage(page: AvailablePages): void {
    setSelectedPage(page);
    setFetchingStatus(true);
    fetch(`https://my-json-server.typicode.com/tractian/fake-api/${page}`)
      .then((response) => response.json())
      .then((json) => setFetchData(json))
      .finally(() => setFetchingStatus(false));
  }

  function makeContentComponent(): JSX.Element {
    return (
      <div className={styles.bodyContent} data-testid="body-content-id">
        {fetchData.map((data) => (
          <span key={data.id}>{JSON.stringify(data)}</span>
        ))}
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <nav className={styles.navbar} data-testid="navbar-id">
        <div
          className={`${styles.navbarOption} ${
            selectedPage === "home" ? styles.active : ""
          }`}
          data-testid="navbar-home-id"
          onClick={() => changePage("home")}
        >
          <span className={styles.navbarText}>Home</span>
        </div>
        <div
          className={`${styles.navbarOption} ${
            selectedPage === "assets" ? styles.active : ""
          }`}
          data-testid="navbar-assets-id"
          onClick={() => changePage("assets")}
        >
          <span className={styles.navbarText}>Assets</span>
        </div>
        <div
          className={`${styles.navbarOption} ${
            selectedPage === "users" ? styles.active : ""
          }`}
          data-testid="navbar-users-id"
          onClick={() => changePage("users")}
        >
          <span className={styles.navbarText}>Users</span>
        </div>
        <div
          className={`${styles.navbarOption} ${
            selectedPage === "units" ? styles.active : ""
          }`}
          data-testid="navbar-units-id"
          onClick={() => changePage("units")}
        >
          <span className={styles.navbarText}>Units</span>
        </div>
        <div
          className={`${styles.navbarOption} ${
            selectedPage === "workOrders" ? styles.active : ""
          }`}
          data-testid="navbar-workOrders-id"
          onClick={() => changePage("workOrders")}
        >
          <span className={styles.navbarText}>Work Orders</span>
        </div>
      </nav>
      <div className={styles.body} data-testid="body-id">
        {isFetching ? (
          <div
            className={styles.loading}
            data-testid="loading-content-id"
          ></div>
        ) : (
          <div className={styles.bodyContent} data-testid="body-content-id">
            {makeContentComponent()}
          </div>
        )}
      </div>
    </main>
  );
}

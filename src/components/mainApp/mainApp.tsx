"use client";
import styles from "./mainApp.module.css";
import { useEffect, useState } from "react";
import AssetsComponent from "@/components/assets/assets";
import { useRecoilState } from "recoil";
import { Asset, assetsAtom } from "@/stores/store";

export type AvailablePages = keyof SetStatesMap;
type SetStatesMap = {
  home: () => void;
  assets: (value: Array<Asset>) => void;
  users: () => void;
  units: () => void;
  workOrders: () => void;
};

export default function MainApp() {
  const [selectedPage, setSelectedPage] = useState<AvailablePages>("home");
  const [isFetching, setFetchingStatus] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<any>([]);
  const [assetsList, setAssetsList] = useRecoilState(assetsAtom);
  const statesMap: SetStatesMap = {
    home: () => {},
    assets: setAssetsList,
    users: () => {},
    units: () => {},
    workOrders: () => {},
  };

  useEffect(() => {
    if (selectedPage === "home") {
      return;
    }
    const setState = statesMap[selectedPage];
    setState && setState(fetchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  function changePage(page: AvailablePages): void {
    setSelectedPage(page);
    if (page === "home") {
      setFetchData([]);
      return;
    }
    setFetchingStatus(true);
    fetch(`https://my-json-server.typicode.com/tractian/fake-api/${page}`)
      .then((response) => response.json())
      .then((json) => setFetchData(json))
      .finally(() => setFetchingStatus(false));
  }

  function makeContentComponent(): JSX.Element {
    if (selectedPage === "assets") {
      return (
        <div className={styles.bodyContent} data-testid="body-content-id">
          <AssetsComponent></AssetsComponent>
        </div>
      );
    }
    return (
      <div className={styles.bodyContent} data-testid="body-content-id">
        {fetchData.map((data) => (
          <span key={data.id}>{JSON.stringify(data)}</span>
        ))}
      </div>
    );
  }

  function makeLoadingComponent(): JSX.Element {
    return (
      <div
        className={styles.loadingContent}
        data-testid="loading-content-id"
      ></div>
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
        {isFetching ? makeLoadingComponent() : makeContentComponent()}
      </div>
    </main>
  );
}

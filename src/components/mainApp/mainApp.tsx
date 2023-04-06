"use client";
import styles from "./mainApp.module.css";
import { useEffect, useState } from "react";
import AssetsComponent from "@/components/assets/assets";
import UsersComponent from "@/components/users/users";
import { useRecoilState } from "recoil";
import {
  Asset,
  Unit,
  User,
  WorkOrder,
  assetsAtom,
  unitsAtom,
  usersAtom,
  workOrdersAtom,
} from "@/stores/store";
import WorkOrdersComponent from "../workOrders/workOrders";
import UnitsComponent from "../units/units";

export type AvailablePages = keyof SetStatesMap;
type SetStatesMap = {
  home: { Component: JSX.Element; setList: () => void };
  assets: { Component: JSX.Element; setList: (value: Array<Asset>) => void };
  users: { Component: JSX.Element; setList: (value: Array<User>) => void };
  units: { Component: JSX.Element; setList: (value: Array<Unit>) => void };
  workOrders: {
    Component: JSX.Element;
    setList: (value: Array<WorkOrder>) => void;
  };
};

export default function MainApp() {
  const [selectedPage, setSelectedPage] = useState<AvailablePages>("home");
  const [isFetching, setFetchingStatus] = useState<boolean>(false);
  const [, setAssetsList] = useRecoilState(assetsAtom);
  const [, setUsers] = useRecoilState(usersAtom);
  const [, setUnits] = useRecoilState(unitsAtom);
  const [, setWorkOrders] = useRecoilState(workOrdersAtom);
  const statesMap: SetStatesMap = {
    home: { Component: <div></div>, setList: () => {} },
    assets: {
      Component: <AssetsComponent></AssetsComponent>,
      setList: setAssetsList,
    },
    users: { Component: <UsersComponent></UsersComponent>, setList: setUsers },
    units: { Component: <UnitsComponent></UnitsComponent>, setList: setUnits },
    workOrders: {
      Component: <WorkOrdersComponent></WorkOrdersComponent>,
      setList: setWorkOrders,
    },
  };

  useEffect(() => {
    requestData("assets");
    requestData("users");
    requestData("units");
    requestData("workOrders");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestData(page: AvailablePages): void {
    function onSuccess(data: any): void {
      console.log(page);
      console.log(JSON.stringify(data));
      const stateControl = statesMap[page];
      stateControl && stateControl.setList(data);
    }

    setFetchingStatus(true);
    fetch(`https://my-json-server.typicode.com/tractian/fake-api/${page}`)
      .then((response) => response.json())
      .then((json) => onSuccess(json))
      .finally(() => setFetchingStatus(false));
  }

  function changePage(page: AvailablePages): void {
    setSelectedPage(page);
  }

  function makeContentComponent(): JSX.Element {
    const stateControl = statesMap[selectedPage];
    return (
      (
        <div className={styles.bodyContent} data-testid="body-content-id">
          {stateControl.Component}
        </div>
      ) ?? <div></div>
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

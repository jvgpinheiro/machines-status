"use client";
import { RecoilRoot } from "recoil";
import MainApp from "@/components/mainApp/mainApp";

export default function Home() {
  return (
    <RecoilRoot>
      <MainApp></MainApp>
    </RecoilRoot>
  );
}

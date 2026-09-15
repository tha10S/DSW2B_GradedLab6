import React from "react";
import { StatusBar } from "expo-status-bar";
import NoticeScreen from "./NoticeScreen";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NoticeScreen />
    </>
  );
}
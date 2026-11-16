"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getCurrentDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getServerDate() {
  return "Data atual";
}

export default function CurrentDate() {
  const date = useSyncExternalStore(subscribe, getCurrentDate, getServerDate);

  return (
    <p aria-label={date} className="text-xs font-medium capitalize text-[#858078]">
      {date}
    </p>
  );
}

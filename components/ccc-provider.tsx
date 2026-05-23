"use client";

import { ccc } from "@ckb-ccc/connector-react";
import React from "react";

export function CccProvider({ children }: { children: React.ReactNode }) {
  return <ccc.Provider>{children}</ccc.Provider>;
}

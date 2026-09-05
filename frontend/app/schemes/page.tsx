import React from "react";
import { SchemesDirectoryClient } from "../../components/schemes/SchemesDirectoryClient";

export const metadata = {
  title: "Government Scheme Directory & Auto-Router | SAARTHI AI",
  description:
    "Official guidelines from the Ministry of Social Justice and Empowerment (MoSJE), NBCFDC, NSFDC, PMEGP, and Mudra.",
};

export default function SchemesPage() {
  return <SchemesDirectoryClient />;
}

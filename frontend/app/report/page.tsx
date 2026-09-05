import React from "react";
import { ReportDossierClient } from "../../components/report/ReportDossierClient";

export const metadata = {
  title: "Official Feasibility & Financial Structuring Dossier | SAARTHI AI",
  description:
    "Official printable Feasibility Dossier adhering to MoSJE SIH26091 guidelines.",
};

export default function ReportPage() {
  return <ReportDossierClient />;
}

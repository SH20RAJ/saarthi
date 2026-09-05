import React from "react";
import { AdvisorChatClient } from "../../components/copilot/AdvisorChatClient";

export const metadata = {
  title: "Copilot AI Advisor & Decision Assistant | SAARTHI AI",
  description:
    "Conversational decision support assistant powered by CopilotKit, grounded in MoSJE guidelines and geospatial data.",
};

export default function AdvisorPage() {
  return <AdvisorChatClient />;
}

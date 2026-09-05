import React from "react";
import { DataChatClient } from "../../components/data-chat/DataChatClient";

export const metadata = {
  title: "Chat With Your Data | SAARTHI AI",
  description:
    "Interactive CopilotKit data canvas and conversational analytics for rural micro-enterprise datasets.",
};

export default function ChatDataPage() {
  return <DataChatClient />;
}

import React from "react";
import { GeospatialClient } from "../../../components/map/GeospatialClient";

export const metadata = {
  title: "Geospatial & Competitor Intelligence Map | SAARTHI AI",
  description: "Concentric 5km and 10km catchment buffers, competitor clusters, and market infrastructure.",
};

export default function GeospatialMapPage() {
  return <GeospatialClient />;
}

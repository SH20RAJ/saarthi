"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Building, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { CompetitorMap } from "../CompetitorMap";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../../lib/constants";

export const GeospatialClient: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0]);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link href="/dashboard" className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-xs font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-slate-500">•</span>
            <Badge variant="teal" className="text-[9px]">SIH26091 Module 1</Badge>
          </div>
          <h1 className="text-2xl font-black">Geospatial Intelligence & Competitor Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            5 km & 10 km concentric catchment buffers, competitor clusters, and market infrastructure nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLocation.id}
            onChange={(e) => {
              const loc = LOCATIONS.find((l) => l.id === e.target.value);
              if (loc) setSelectedLocation(loc);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                {loc.name}, {loc.district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CompetitorMap
        location={selectedLocation}
        categoryName={selectedCategory.name}
        lang="en"
      />
    </div>
  );
};

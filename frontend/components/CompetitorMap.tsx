"use client";

import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Store,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { LocationContext, CompetitorPOI } from "../lib/types";
import { DEMO_COMPETITORS_KANKE } from "../lib/constants";

interface CompetitorMapProps {
  location: LocationContext;
  categoryName: string;
  lang: "en" | "hi";
}

export const CompetitorMap: React.FC<CompetitorMapProps> = ({
  location,
  categoryName,
  lang,
}) => {
  const [activeRadius, setActiveRadius] = useState<5 | 10>(5);
  const [filterType, setFilterType] = useState<"all" | "competitor" | "mandi" | "supplier">("all");

  const pois = DEMO_COMPETITORS_KANKE.filter(
    (p) => filterType === "all" || p.type === filterType
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === "en" ? "Hyper-Local Geospatial Intelligence" : "स्थानिक बाजार व प्रतिस्पर्धी मानचित्र"}
              </h3>
              <p className="text-xs text-slate-500">
                {location.name}, {location.block} Block ({location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E)
              </p>
            </div>
          </div>
        </div>

        {/* Radius Buffer Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">
            {lang === "en" ? "Buffer Radius:" : "त्रिज्या:"}
          </span>
          <button
            onClick={() => setActiveRadius(5)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
              activeRadius === 5
                ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            5 km Catchment
          </button>
          <button
            onClick={() => setActiveRadius(10)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
              activeRadius === 10
                ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            10 km Catchment
          </button>
        </div>
      </div>

      {/* Interactive Visual Map Canvas Simulation */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* Radar concentric radius circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* 10 km ring */}
          <div
            className={`rounded-full border border-teal-500/20 absolute transition-all duration-500 ${
              activeRadius === 10 ? "w-72 h-72 sm:w-88 sm:h-88 bg-teal-950/20" : "w-60 h-60"
            }`}
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-teal-400 font-mono tracking-wider">
              10 KM RADIUS BUFFER
            </span>
          </div>

          {/* 5 km ring */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-dashed border-teal-400/40 absolute bg-teal-900/10">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-teal-300 font-mono tracking-wider">
              5 KM PRIMARY CATCHMENT
            </span>
          </div>

          {/* Radial grid lines */}
          <div className="w-full h-px bg-teal-500/10 absolute" />
          <div className="h-full w-px bg-teal-500/10 absolute" />
        </div>

        {/* Center Target: Entrepreneur Location */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-teal-500/30 animate-ping absolute inset-0" />
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg ring-4 ring-teal-400/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-900/90 text-teal-200 text-[10px] font-bold border border-teal-700 shadow-md">
            Proposed Unit ({location.name})
          </span>
        </div>

        {/* POI Markers */}
        {pois.map((poi, idx) => {
          // Calculate polar-to-cartesian layout relative to center
          const angle = (idx * 60 + 25) * (Math.PI / 180);
          const distanceScale = activeRadius === 5 ? 18 : 11;
          const x = Math.cos(angle) * (poi.distance_km * distanceScale);
          const y = Math.sin(angle) * (poi.distance_km * distanceScale);

          return (
            <div
              key={poi.id}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute z-20 group cursor-pointer"
            >
              <div
                className={`p-1.5 rounded-full text-white shadow-md transition-transform hover:scale-125 ${
                  poi.type === "competitor"
                    ? "bg-red-600 ring-2 ring-red-400/30"
                    : poi.type === "mandi"
                    ? "bg-amber-600 ring-2 ring-amber-400/30"
                    : poi.type === "supplier"
                    ? "bg-blue-600 ring-2 ring-blue-400/30"
                    : "bg-emerald-600 ring-2 ring-emerald-400/30"
                }`}
              >
                {poi.type === "competitor" && <Store className="w-3.5 h-3.5" />}
                {poi.type === "mandi" && <ShoppingBag className="w-3.5 h-3.5" />}
                {poi.type === "supplier" && <Truck className="w-3.5 h-3.5" />}
                {poi.type === "transit" && <Navigation className="w-3.5 h-3.5" />}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-30 w-44 p-2 bg-slate-900 text-white rounded-lg text-[10px] shadow-xl border border-slate-700 pointer-events-none">
                <p className="font-bold text-slate-100">{poi.name}</p>
                <p className="text-slate-400 mt-0.5">
                  Distance: <span className="text-teal-300 font-mono">{poi.distance_km} km</span>
                </p>
                <p className="text-[9px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
                  Type: {poi.type}
                </p>
              </div>
            </div>
          );
        })}

        {/* Legend Overlay in Bottom Corner */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>Direct Competitor ({pois.filter((p) => p.type === "competitor").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Weekly Haat / Mandi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>Feed / Raw Material Depot</span>
          </div>
        </div>

        {/* OpenStreetMap Provenance Watermark */}
        <div className="absolute bottom-3 right-3 z-20 text-[10px] text-slate-400 bg-slate-900/70 px-2 py-1 rounded-md border border-slate-800 font-mono">
          ODbL © OpenStreetMap contributors
        </div>
      </div>

      {/* Geospatial Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-t border-slate-200">
        <div className="p-3.5 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">5 km Catchment Pop</span>
          <span className="text-base font-extrabold text-slate-900 font-mono">
            {location.population_5km.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="p-3.5 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Household Density</span>
          <span className="text-base font-extrabold text-teal-700 font-mono">
            {location.households_5km.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="p-3.5 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Nearest Mandi</span>
          <span className="text-base font-extrabold text-slate-900 font-mono">
            {location.market_distance_km} km
          </span>
        </div>
        <div className="p-3.5 bg-white text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Road Connectivity</span>
          <span className="text-base font-extrabold text-emerald-700">
            {location.road_connectivity}
          </span>
        </div>
      </div>
    </div>
  );
};

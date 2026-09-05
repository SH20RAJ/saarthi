import { LocationContext, BusinessCategory, CompetitorPOI } from "./types";

export const LOCATIONS: LocationContext[] = [
  {
    id: "kanke_ranchi",
    name: "Kanke",
    panchayat: "Kanke Central",
    block: "Kanke",
    district: "Ranchi",
    state: "Jharkhand",
    lat: 23.4316,
    lng: 85.3218,
    population_5km: 42500,
    households_5km: 8100,
    market_distance_km: 3.2,
    road_connectivity: "High",
  },
  {
    id: "ormanjhi_ranchi",
    name: "Ormanjhi",
    panchayat: "Chakla",
    block: "Ormanjhi",
    district: "Ranchi",
    state: "Jharkhand",
    lat: 23.4831,
    lng: 85.4851,
    population_5km: 29800,
    households_5km: 5600,
    market_distance_km: 5.8,
    road_connectivity: "Moderate",
  },
  {
    id: "mandu_ramgarh",
    name: "Mandu",
    panchayat: "Mandu South",
    block: "Mandu",
    district: "Ramgarh",
    state: "Jharkhand",
    lat: 23.7938,
    lng: 85.4744,
    population_5km: 24200,
    households_5km: 4800,
    market_distance_km: 4.1,
    road_connectivity: "Moderate",
  },
  {
    id: "bhandra_lohardaga",
    name: "Bhandra",
    panchayat: "Bhandra West",
    block: "Bhandra",
    district: "Lohardaga",
    state: "Jharkhand",
    lat: 23.4167,
    lng: 84.8833,
    population_5km: 18400,
    households_5km: 3600,
    market_distance_km: 7.5,
    road_connectivity: "Low",
  }
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: "dairy",
    name: "Dairy Farming & Processing",
    name_hi: "डेयरी फार्मिंग एवं दुग्ध प्रसंस्करण",
    icon: "Milk",
    description: "Milch cattle rearing, raw milk collection, curd, and artisanal paneer supply.",
    description_hi: "दुधारू पशु पालन, दूध संग्रहण, दही और पनीर निर्माण।",
    min_capital: 50000,
    typical_cost: 1000000,
    demand_level: "High",
    risk_level: "Low",
    monthly_rev_factor: 0.09,
    monthly_opex_factor: 0.055,
    key_risks: [
      "Seasonal fodder and concentrate feed price volatility (+15% during summer)",
      "Bovine disease outbreak risk requiring strict vaccination schedule",
      "Cold chain storage constraints for unsold fresh liquid milk"
    ],
    key_opportunities: [
      "Zero packaged paneer processing units operating within 7 km catchment",
      "Direct procurement partnership link with Medha Dairy cooperative",
      "Consistent high urban demand corridor connecting Kanke to Ranchi City"
    ]
  },
  {
    id: "poultry",
    name: "Broiler & Layer Poultry",
    name_hi: "मुर्गी पालन (ब्रायलर / लेयर)",
    icon: "Egg",
    description: "Commercial broiler shed farming for live birds and table eggs.",
    description_hi: "मांस और अंडों के लिए वाणिज्यिक पोल्ट्री शेड स्थापना।",
    min_capital: 60000,
    typical_cost: 600000,
    demand_level: "High",
    risk_level: "Medium",
    monthly_rev_factor: 0.11,
    monthly_opex_factor: 0.075,
    key_risks: [
      "Avian flu outbreaks and sudden wholesale farm-gate price fluctuations",
      "High sensitivity to commercial feed costs (soya meal, maize)",
      "High summer mortality without adequate cooling ventilation"
    ],
    key_opportunities: [
      "Rising protein consumption in local village markets and dhabas",
      "Fast 40-45 day broiler cycle enabling quick liquidity reinvestment"
    ]
  },
  {
    id: "tailoring",
    name: "Apparel & Tailoring Unit",
    name_hi: "वस्त्र सिलाई एवं बुटीक इकाई",
    icon: "Scissors",
    description: "Custom stitching, school uniform manufacturing, and local boutique retail.",
    description_hi: "कपड़ों की सिलाई, स्कूल यूनिफॉर्म एवं ग्रामीण बुटीक।",
    min_capital: 20000,
    typical_cost: 200000,
    demand_level: "Moderate",
    risk_level: "Low",
    monthly_rev_factor: 0.08,
    monthly_opex_factor: 0.038,
    key_risks: [
      "Demand concentration during festive, wedding, and school re-opening seasons",
      "Availability of skilled stitching artisans for specialized embroidery"
    ],
    key_opportunities: [
      "Low capital equipment requirement with negligible inventory spoilage",
      "High value-added margin on custom wedding bridal wear and blouses"
    ]
  },
  {
    id: "grocery",
    name: "Daily Grocery & Provision Store",
    name_hi: "किराना एवं दैनिक उपभोक्ता भंडार",
    icon: "ShoppingBag",
    description: "FMCG, packaged staple food grains, spices, and household essentials.",
    description_hi: "दैनिक राशन, पैकेज्ड सामग्री और घरेलू जरूरत की वस्तुएं।",
    min_capital: 30000,
    typical_cost: 300000,
    demand_level: "High",
    risk_level: "High",
    monthly_rev_factor: 0.14,
    monthly_opex_factor: 0.115,
    key_risks: [
      "High competitor saturation (average 6-9 competing shops per village cluster)",
      "Thin gross retail margins (8-12%) requiring immense sales velocity",
      "Customer credit defaults ('udhaari') straining working capital"
    ],
    key_opportunities: [
      "Everyday recurring household cash flow with instant customer walk-ins",
      "Expansion into digital micro-banking (AePS cash withdrawal) and utility recharges"
    ]
  },
  {
    id: "food_processing",
    name: "Spices & Grain Flour Milling",
    name_hi: "मसाला पिसाई एवं लघु आटा मिल",
    icon: "Wheat",
    description: "Mini flour mill (chakkhi), oil expeller, and local branded turmeric/chilli packaging.",
    description_hi: "आटा चक्की, तेल घानी एवं स्थानीय मसाला पैकेजिंग इकाई।",
    min_capital: 40000,
    typical_cost: 400000,
    demand_level: "Growing",
    risk_level: "Low",
    monthly_rev_factor: 0.10,
    monthly_opex_factor: 0.060,
    key_risks: [
      "Three-phase electric power supply disruptions in rural feeders",
      "Raw commodity procurement price spikes during unseasonal rain"
    ],
    key_opportunities: [
      "Consistent recurring milling job-work charges paid in immediate cash",
      "Substantial value-addition markup on pure unadulterated cold-pressed mustard oil"
    ]
  }
];

export const DEMO_COMPETITORS_KANKE: CompetitorPOI[] = [
  { id: "c1", name: "Yadav Dairy Farm (Raw Milk)", category: "dairy", distance_km: 1.4, lat: 23.438, lng: 85.328, type: "competitor" },
  { id: "c2", name: "Birsa Khatal", category: "dairy", distance_km: 2.8, lat: 23.421, lng: 85.312, type: "competitor" },
  { id: "c3", name: "Munda Cattle Unit", category: "dairy", distance_km: 4.2, lat: 23.449, lng: 85.341, type: "competitor" },
  { id: "m1", name: "Kanke Weekly Haat (Mandi)", category: "market", distance_km: 3.2, lat: 23.435, lng: 85.325, type: "mandi" },
  { id: "s1", name: "Kisan Cattle Feed Depot", category: "supplier", distance_km: 2.1, lat: 23.429, lng: 85.332, type: "supplier" },
  { id: "t1", name: "Kanke Ring Road Transit Hub", category: "transit", distance_km: 1.9, lat: 23.442, lng: 85.318, type: "transit" }
];

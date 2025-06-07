import React from "react";
import { Building, Home, Award } from "@/components/ui/LucideIcons";

export const metricsData = [
  {
    value: "1",
    unit: "Cr+",
    subLabel: "Sq. Ft.",
    label: "Constructed",
    icon: <Building size={32} />,
  },
  {
    value: "14500+",
    label: "Lives Impacted",
    icon: <Home size={32} />,
  },
  {
    value: "25+",
    label: "Prime Locations",
    icon: <Building size={32} />,
  },
  {
    value: "25",
    unit: "+",
    label: "Years Building Trust",
    icon: <Award size={32} />,
  },
];
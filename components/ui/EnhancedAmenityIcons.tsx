import React from "react";
import { 
  FaShieldAlt, 
  FaSwimmingPool, 
  FaDumbbell, 
  FaTree, 
  FaParking, 
  FaChild, 
  FaBuilding, 
  FaArrowsAltV,
  FaWifi,
  FaClock,
  FaUtensils
} from "react-icons/fa";
import { MdSecurity, MdFitnessCenter, MdLocalParking, MdElevator, MdPool } from "react-icons/md";
import { GiGardeningShears, GiTreehouse } from "react-icons/gi";
import { BsHouseDoorFill } from "react-icons/bs";

// Enhanced amenity icons with react-icons - increased size
export const EnhancedSecurityIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaShieldAlt className={className} size={24} />
);

export const EnhancedPoolIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaSwimmingPool className={className} size={24} />
);

export const EnhancedFitnessIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaDumbbell className={className} size={24} />
);

export const EnhancedGardenIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaTree className={className} size={24} />
);

export const EnhancedParkingIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaParking className={className} size={24} />
);

export const EnhancedPlaygroundIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaChild className={className} size={24} />
);

export const EnhancedClubhouseIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaBuilding className={className} size={24} />
);

export const EnhancedElevatorIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaArrowsAltV className={className} size={24} />
);

export const EnhancedWifiIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaWifi className={className} size={24} />
);

export const Enhanced24HourIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaClock className={className} size={24} />
);

export const EnhancedDiningIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <FaUtensils className={className} size={24} />
);

// Map of original amenity names to enhanced icons
export const enhancedIconMap: Record<string, React.ReactNode> = {
  "24/7 Security": <EnhancedSecurityIcon />,
  "Swimming Pool": <EnhancedPoolIcon />,
  "Fitness Center": <EnhancedFitnessIcon />,
  "Garden Area": <EnhancedGardenIcon />,
  "Parking Space": <EnhancedParkingIcon />,
  "Children's Play Area": <EnhancedPlaygroundIcon />,
  "Club House": <EnhancedClubhouseIcon />,
  "Elevator": <EnhancedElevatorIcon />,
  "WiFi": <EnhancedWifiIcon />,
  "24-Hour Access": <Enhanced24HourIcon />,
  "Dining Facilities": <EnhancedDiningIcon />
}; 
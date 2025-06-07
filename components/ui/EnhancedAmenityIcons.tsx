import React from "react";
import {
  Shield, Camera, Phone, Flame, DoorOpen, UserCheck,
  Waves, Dumbbell, Baby, Home, Gamepad2, Trophy, Activity, Heart, PartyPopper, BookOpen,
  Trees, Flower, Droplets, Armchair, Route,
  Car, ArrowUpDown, Zap, Droplet, Trash2, CloudRain, Sun, Wrench,
  Wifi, Smartphone, Tv, Settings,
  Bell, Sparkles, Shirt, CreditCard, ShoppingBag, Cross,
  UtensilsCrossed, Coffee, ChefHat, Utensils,
  Sparkle, Thermometer, Hand, Pill,
  Building, Users, Laptop,
  Bus, KeyRound, BatteryCharging,
  Bed, Dog, Theater, Film, Palette,
} from "lucide-react";

// Comprehensive amenity icon mapping using Lucide React icons
export const enhancedIconMap: Record<string, React.ReactNode> = {
  // Security & Safety
  "24/7 Security": <Shield className="w-6 h-6" />,
  "CCTV Surveillance": <Camera className="w-6 h-6" />,
  "Intercom System": <Phone className="w-6 h-6" />,
  "Fire Safety System": <Flame className="w-6 h-6" />,
  "Emergency Exit": <DoorOpen className="w-6 h-6" />,
  "Security Guard": <UserCheck className="w-6 h-6" />,

  // Recreation & Entertainment
  "Swimming Pool": <Waves className="w-6 h-6" />,
  "Fitness Center": <Dumbbell className="w-6 h-6" />,
  "Children's Play Area": <Baby className="w-6 h-6" />,
  "Club House": <Home className="w-6 h-6" />,
  "Indoor Games Room": <Gamepad2 className="w-6 h-6" />,
  "Outdoor Sports Court": <Trophy className="w-6 h-6" />,
  "Jogging Track": <Activity className="w-6 h-6" />,
  "Yoga/Meditation Area": <Heart className="w-6 h-6" />,
  "Party Hall": <PartyPopper className="w-6 h-6" />,
  "Library": <BookOpen className="w-6 h-6" />,

  // Landscape & Environment
  "Garden Area": <Trees className="w-6 h-6" />,
  "Terrace Garden": <Flower className="w-6 h-6" />,
  "Water Features": <Droplets className="w-6 h-6" />,
  "Outdoor Seating": <Armchair className="w-6 h-6" />,
  "Walking Paths": <Route className="w-6 h-6" />,

  // Utilities & Infrastructure
  "Parking Space": <Car className="w-6 h-6" />,
  "Elevator": <ArrowUpDown className="w-6 h-6" />,
  "Power Backup": <Zap className="w-6 h-6" />,
  "Water Supply": <Droplet className="w-6 h-6" />,
  "Waste Management": <Trash2 className="w-6 h-6" />,
  "Rainwater Harvesting": <CloudRain className="w-6 h-6" />,
  "Solar Panels": <Sun className="w-6 h-6" />,
  "Maintenance Service": <Wrench className="w-6 h-6" />,

  // Technology & Connectivity
  "High-Speed Internet": <Wifi className="w-6 h-6" />,
  "Smart Home Features": <Smartphone className="w-6 h-6" />,
  "Cable TV Ready": <Tv className="w-6 h-6" />,
  "Home Automation": <Settings className="w-6 h-6" />,

  // Convenience & Services
  "Concierge Service": <Bell className="w-6 h-6" />,
  "Housekeeping": <Sparkles className="w-6 h-6" />,
  "Laundry Service": <Shirt className="w-6 h-6" />,
  "ATM/Banking": <CreditCard className="w-6 h-6" />,
  "Shopping Center": <ShoppingBag className="w-6 h-6" />,
  "Medical Center": <Cross className="w-6 h-6" />,

  // Dining & Food
  "Restaurant": <UtensilsCrossed className="w-6 h-6" />,
  "Cafeteria": <Coffee className="w-6 h-6" />,
  "Food Court": <ChefHat className="w-6 h-6" />,
  "Banquet Hall": <Utensils className="w-6 h-6" />,

  // Wellness & Health
  "Spa & Wellness": <Sparkle className="w-6 h-6" />,
  "Sauna": <Thermometer className="w-6 h-6" />,
  "Massage Room": <Hand className="w-6 h-6" />,
  "Pharmacy": <Pill className="w-6 h-6" />,

  // Business & Work
  "Business Center": <Building className="w-6 h-6" />,
  "Conference Room": <Users className="w-6 h-6" />,
  "Co-working Space": <Laptop className="w-6 h-6" />,

  // Transportation
  "Shuttle Service": <Bus className="w-6 h-6" />,
  "Valet Parking": <KeyRound className="w-6 h-6" />,
  "EV Charging Station": <BatteryCharging className="w-6 h-6" />,

  // Additional Amenities
  "Guest Rooms": <Bed className="w-6 h-6" />,
  "Pet Area": <Dog className="w-6 h-6" />,
  "Amphitheater": <Theater className="w-6 h-6" />,
  "Mini Theater": <Film className="w-6 h-6" />,
  "Art Gallery": <Palette className="w-6 h-6" />,

  // Legacy mappings for backward compatibility
  "WiFi": <Wifi className="w-6 h-6" />,
  "24-Hour Access": <Shield className="w-6 h-6" />,
  "Dining Facilities": <UtensilsCrossed className="w-6 h-6" />,
  "Gym": <Dumbbell className="w-6 h-6" />,
  "Clubhouse": <Home className="w-6 h-6" />,
  "Landscaped Gardens": <Trees className="w-6 h-6" />,
  "Parking": <Car className="w-6 h-6" />
};
"use client";

import CareerClient from "@/components/sections/CareerClient";

export default function CareerPage() {
  // Pass empty array initially - CareerClient will fetch data on the client side
  return <CareerClient jobOpenings={[]} />;
}
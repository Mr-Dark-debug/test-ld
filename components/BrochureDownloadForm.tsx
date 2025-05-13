"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

interface BrochureDownloadFormProps {
  projectName: string;
  brochureUrl: string;
}

export function BrochureDownloadForm({ projectName, brochureUrl }: BrochureDownloadFormProps) {
  const { theme } = useTheme();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
  };

  const handleDownload = () => {
    // Open the brochure in a new tab or trigger download
    window.open(brochureUrl, "_blank");
  };

  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4">
          <CardTitle>{formSubmitted ? "Download Brochure" : "Download Request"}</CardTitle>
          <CardDescription>
            {formSubmitted 
              ? "Thank you for your interest in " + projectName
              : "Please enter your details to download the brochure for " + projectName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9999999999" 
                    required 
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full">Submit</Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">Your brochure is ready to download</p>
              <Button onClick={handleDownload} className="w-full">
                Download Brochure
              </Button>
            </div>
          )}
        </CardContent>
      </MagicCard>
    </Card>
  );
} 
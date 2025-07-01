"use client";

import React from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialMediaLinksProps {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  className?: string;
  iconSize?: number;
  iconColor?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  facebook = "https://www.facebook.com/laxmigroupsurat",
  instagram = "https://www.instagram.com/laxmi_developers/",
  linkedin = "https://www.linkedin.com/company/laxmi-developerssurat/posts/?feedView=all",
  youtube = "https://www.youtube.com/@laxmidevelopers1380",
  className = "",
  iconSize = 20,
  iconColor = "text-gray-300 hover:text-white",
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={`${iconColor} transition-colors duration-300`}
        >
          <Facebook size={iconSize} />
        </a>
      )}
      
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={`${iconColor} transition-colors duration-300`}
        >
          <Instagram size={iconSize} />
        </a>
      )}
      
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={`${iconColor} transition-colors duration-300`}
        >
          <Linkedin size={iconSize} />
        </a>
      )}
      
      {youtube && (
        <a
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className={`${iconColor} transition-colors duration-300`}
        >
          <Youtube size={iconSize} />
        </a>
      )}
    </div>
  );
};

export default SocialMediaLinks; 
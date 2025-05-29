'use client';

import { usePathname } from 'next/navigation';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import { MessageCircle, Smartphone, Bot } from 'lucide-react';
import React from 'react';

export default function GlobalFloatingMenu() {
  const pathname = usePathname();
  const showFloatingMenu = !pathname.startsWith('/cms-admin');

  const menuOptions = [
    {
      label: 'Chat with AI',
      Icon: <Bot className="w-4 h-4" />,
      onClick: () => {
        // Placeholder - Replace with actual chatbot integration
        console.log('Chatbot clicked');
        // Example: if you have a chat widget toggle function:
        // window.MyChatWidget.toggle(); 
      },
    },
    {
      label: 'WhatsApp Us',
      Icon: <Smartphone className="w-4 h-4" />,
      onClick: () => {
        // IMPORTANT: Replace YOUR_WHATSAPP_NUMBER with your actual WhatsApp number
        window.open('https://wa.me/YOUR_WHATSAPP_NUMBER?text=Hello%20Laxmi%20Developers', '_blank');
      },
    },
    {
      label: 'Contact Us',
      Icon: <MessageCircle className="w-4 h-4" />,
      onClick: () => {
        window.location.href = '/contact';
      },
    },
  ];

  if (!showFloatingMenu) {
    return null;
  }

  return <FloatingActionMenu options={menuOptions.reverse()} />; // Reverse to get specified order (Contact Us top)
} 
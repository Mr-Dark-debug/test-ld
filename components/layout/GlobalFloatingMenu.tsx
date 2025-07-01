'use client';

import { usePathname } from 'next/navigation';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import { MessageCircle, Smartphone, Bot } from 'lucide-react';
import React, { useState } from 'react';
import ChatOverlay from '@/components/ui/ChatOverlay';

export default function GlobalFloatingMenu() {
  const pathname = usePathname();
  const showFloatingMenu = !pathname.startsWith('/cms-admin');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuOptions = [
    {
      label: 'Chat with Us',
      Icon: <Bot className="w-4 h-4" />,
      onClick: () => {
        setIsChatOpen(true);
      },
    },
    {
      label: 'WhatsApp Us',
      Icon: <Smartphone className="w-4 h-4" />,
      onClick: () => {
        // Using the official WhatsApp number
        window.open('https://wa.me/919978600222?text=Hello%20Laxmi%20Developers', '_blank');
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

  return (
    <>
      <FloatingActionMenu options={menuOptions.reverse()} /> {/* Reverse to get specified order (Contact Us top) */}
      <ChatOverlay 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
} 
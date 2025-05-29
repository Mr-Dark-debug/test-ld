export interface ContactInfo {
  address: string;
  phone: string;
  hours: { days: string; time: string }[];
  mapEmbedSrc: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'responded' | 'archived';
}

export const defaultContactInfo: ContactInfo = {
  address: "Millennium Textile Market 3, 395002, Surat – Gujarat, India",
  phone: "+91 9978600222",
  hours: [
    { days: "Monday to Saturday", time: "9:00 AM – 7:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6655163266864!2d72.82!3d21.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEwJzQ4LjAiTiA3MsKwNDknMTIuMCJF!5e0!3m2!1sen!2sin!4v1638880598901!5m2!1sen!2sin",
};

export const mockContactRequests: ContactRequest[] = [
  {
    id: '1',
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    phone: '+91 98765 43210',
    message: 'I am interested in the Millennium Park project. Please provide more details about the available units.',
    date: '2023-05-15T09:30:00',
    status: 'responded'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 87654 32109',
    message: 'Looking for commercial space in Millennium Textile Market. What are the current rates?',
    date: '2023-05-18T14:45:00',
    status: 'new'
  },
  {
    id: '3',
    name: 'Amit Desai',
    email: 'amit.desai@example.com',
    phone: '+91 76543 21098',
    message: 'I want to schedule a site visit for Laxmi Enclave this weekend. Is that possible?',
    date: '2023-05-20T11:15:00',
    status: 'new'
  },
  {
    id: '4',
    name: 'Sneha Mehta',
    email: 'sneha.m@example.com',
    phone: '+91 65432 10987',
    message: 'Please send me the brochure for your upcoming residential projects in Vesu area.',
    date: '2023-05-22T16:20:00',
    status: 'archived'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    phone: '+91 54321 09876',
    message: 'Looking for 3BHK apartment in your projects. My budget is around 80-90 lakhs.',
    date: '2023-05-25T10:05:00',
    status: 'new'
  }
]; 
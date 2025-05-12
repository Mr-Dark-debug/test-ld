interface Testimonial {
  id: string;
  name: string;
  role?: string;
  quote: string;
  avatarSrc?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "RS",
    name: "Rahul Sharma",
    role: "Owner at Laxmi Heights",
    quote:
      "We are absolutely thrilled with our new home at Laxmi Heights. The quality of construction and attention to detail is exceptional. The amenities offered are top-notch, and the location is perfect for our family.",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "PP",
    name: "Priya Patel",
    role: "Business Owner, Laxmi Arcade",
    quote:
      "Investing in Laxmi Arcade was one of the best business decisions I've made. The location is prime, the facilities are excellent, and the construction quality is superior. My business has flourished since moving here.",
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "AD",
    name: "Anand Desai",
    role: "Resident at Laxmi Paradise",
    quote:
      "Living at Laxmi Paradise has been a wonderful experience. The community is friendly, the amenities are excellent, and the maintenance is impeccable. The developers have truly created a paradise for families.",
    avatarSrc: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    id: "NM",
    name: "Neha Mehta",
    role: "Shop Owner, Laxmi Trade Center",
    quote:
      "As a retail business owner, location and footfall are crucial for success. Laxmi Trade Center has provided both, along with excellent infrastructure and supportive management. My business has seen significant growth since moving here.",
    avatarSrc: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "SK",
    name: "Suresh Kapoor",
    role: "Investor, Laxmi Business Hub",
    quote:
      "I've invested in multiple properties developed by Laxmi Developers over the years. Their commitment to quality and timely delivery has always impressed me. The returns on my investments have been consistently excellent.",
    avatarSrc: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "MJ",
    name: "Meera Joshi",
    role: "Resident, Laxmi Gardens",
    quote:
      "Moving to Laxmi Gardens was the best decision for my family. The thoughtful layout, spacious apartments, and beautiful landscaping make it a joy to come home every day. The management is responsive and professional.",
    avatarSrc: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: "VS",
    name: "Vikram Singh",
    role: "Corporate Client, Laxmi Towers",
    quote:
      "Our company relocated to Laxmi Towers last year, and it has significantly improved our work environment. The modern facilities, central location, and professional management have helped us attract top talent and boost productivity.",
    avatarSrc: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: "AK",
    name: "Anjali Kumar",
    role: "First-time Homebuyer",
    quote:
      "As first-time homebuyers, we were nervous about the process, but Laxmi Developers made it seamless. Their transparent approach, helpful staff, and quality construction gave us confidence in our investment. We couldn't be happier with our new home.",
    avatarSrc: "https://randomuser.me/api/portraits/women/90.jpg",
  },
]; 
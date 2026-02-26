/**
 * Facility details keyed by slug. Used for facility detail pages.
 * Rating and reviewCount are overridden by API data when reviews exist.
 */
export const FACILITIES_BY_SLUG: Record<
  string,
  {
    slug: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    image: string;
    description: string;
    amenities: string[];
  }
> = {
  "arctic-ice-arena": {
    slug: "arctic-ice-arena",
    name: "Arctic Ice Arena",
    address: "12000 Portland Ave S, Minneapolis, MN 55337, USA",
    phone: "(612) 555-0123",
    hours: "Mon–Sun · 6:00 AM – 11:00 PM",
    image: "/newasset/facilities/card/arctic-arena-1.png",
    description:
      "Premier ice skating facility featuring two NHL-sized rinks, perfect for hockey leagues, figure skating, and public skating.",
    amenities: ["Ice Rink", "Locker Rooms", "Cafe / Snack Bar", "Parking", "Viewing Area"],
  },
  "champions-sports-complex": {
    slug: "champions-sports-complex",
    name: "Champions Sports Complex",
    address: "5750 Cowboys Pkwy, Frisco, TX 75034, USA",
    phone: "(972) 555-0456",
    hours: "Mon–Sun · 5:00 AM – 11:00 PM",
    image: "/newasset/facilities/card/Elite-Training-Hub -1.png",
    description:
      "Multi-sport complex with ice rinks, synthetic ice, and extensive training amenities for hockey and other sports.",
    amenities: ["Real Ice", "Synthetic Ice", "Locker Rooms", "Cafe", "Parking", "Tournament Space"],
  },
  "glacial-gardens": {
    slug: "glacial-gardens",
    name: "Glacial Gardens",
    address: "7900 Xerxes Ave S, Bloomington, MN 55431, USA",
    phone: "(952) 555-0789",
    hours: "Mon–Fri 6 AM – 10 PM · Sat–Sun 7 AM – 9 PM",
    image: "/newasset/facilities/card/skydiving-wsc.jpg",
    description:
      "Community ice rink with excellent skating conditions and training programs.",
    amenities: ["Ice Rink", "Locker Rooms", "Training Area", "Parking"],
  },
  "elite-training-hub": {
    slug: "elite-training-hub",
    name: "Elite Training Hub",
    address: "5701 Normandale Rd, Edina, MN 55424, USA",
    phone: "(952) 555-0321",
    hours: "Mon–Sun · 5:00 AM – 10:00 PM",
    image: "/newasset/facilities/card/arctic-arena-1.png",
    description:
      "State-of-the-art dryland and synthetic ice training facility for hockey development.",
    amenities: ["Synthetic Ice", "Shooting Lane", "Skating Treadmill", "Locker Rooms", "Equipment Rental"],
  },
};

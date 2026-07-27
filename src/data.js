

export const RESTAURANT_LOCATION = {
  latitude:19.27924486082039,    
  longitude: 72.87530603972628,  
  allowedRadiusMeters: 500,
};


export const COMBO_PAIRS = {
  1: [7, 9],   
  2: [11, 5],
  3: [10, 8],
  4: [10, 8],
  7: [1, 9],
  9: [1, 7],
};

export const OFFERS = [
  {
    id: 1,
    title: "50% OFF on your first Ramen order",
    bg: "#e0263e",
    image: "/image/offer1.jpg"
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free on Prawn Curry",
    bg: "#f6c344",
    image: "/image/offer2.jpg"
  },
  {
    id: 3,
    title: "Free delivery above 500 ₹",
    bg: "#2ecc71",
    image: "/image/offer3.jpg"
  },
];
export const CATEGORIES = [
  { id: "popular", label: "Popular", emoji: "👌" },
  { id: "curry", label: "curry", emoji: "🍛" },
  { id: "ramen", label: "ramen", emoji: "🍜" },
  { id: "teppanyaki", label: "teppanyaki", emoji: "🍜" },
];

export const ITEMS = [

    {
    id: 1,
    category: "popular",
    name: "prawn raisukaree",
    price: 200.00,
    image: "/image/prawn.jpg",
    description: "a mild, coconut and citrus curry, with prawns, mangetout, peppers, red and spring onions. served with white rice, a sprinkle of mixed sesame seeds, red chillies, coriander and fresh lime"
  },
  {
    id: 2,
    category: "popular",
    name: "firecracker prawn",
    price: 300.00,
    image: "/image/firecracker-prawn.jpg",
    description: "stir-fried prawns with peppers, onions and a spicy firecracker sauce, served with rice"
  },

  { id: 3, category: "popular", name: "hot chicken katsu", price: 250.00, image: "/image/hot-chicken-katsu.jpg" },
  { id: 4, category: "popular", name: "tofu firecracker", price: 200.00, image: "/image/tofu-firecracker.jpg" },
  { id: 5, category: "popular", name: "chilli king prawn ramen", price: 250.00, image: "/image/chilli-king-prawn-ramen.jpg" },
  { id: 6, category: "popular", name: "spicy beef ramen", price: 250.00, image: "/image/spicy-beef-ramen.jpg" },
  { id: 7, category: "curry", name: "katsu curry", price: 250.00, image: "/image/katsu-curry.jpg" },
  { id: 8, category: "curry", name: "yasai katsu curry", price: 250.00, image: "/image/yasai-katsu-curry.jpg" },
  { id: 9, category: "ramen", name: "chicken ramen", price: 250.00, image: "/image/chicken-ramen.jpg" },
  { id: 10, category: "ramen", name: "yasai ramen", price: 250.00, image: "/image/yasai-ramen.jpg" },
  { id: 11, category: "teppanyaki", name: "chicken teppanyaki", price: 250.00, image: "/image/chicken-teppanyaki.jpg" },
  { id: 12, category: "teppanyaki", name: "yasai teppanyaki", price: 250.00, image: "/image/yasai-teppanyaki.jpg" },
];
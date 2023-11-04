import { Images } from '../../common'

const {
  PET,
  ELLIPSIS,
  DOLLAR,
  BEAUTY,
  UTENSILS,
  CLOTHES,
  APPLIANCES,
  FURNITURE,
  CLEANING,
  SPORTS,
  ELECTRONICS,
  CONTROLLER,
  GARDEN_TOOLS,
  NETSAVE_ICON,
  BOOK,
  ART,
  WRITE_DOCUMENT,
  CAR,
  JEWELRY,
  CURTAINS,
  AUTO_PARTS,
  WIRELESS,
  ALL_CATEGORIES,
  DECORATION,
} = Images

const Categories = [
  {
    id: 3,
    name: 'Appliances',
    icon: APPLIANCES,
  },
  {
    id: 13,
    name: 'Art & Collectibles',
    icon: ART,
  },
  {
    id: 18,
    name: 'Auto Parts & Supplies',
    icon: AUTO_PARTS,
  },
  {
    id: 7,
    name: 'Beauty & Wellness',
    icon: BEAUTY,
  },
  {
    id: 12,
    name: 'Book, Music & Video',
    icon: BOOK,
  },
  {
    id: 15,
    name: 'Cars & Trucks',
    icon: CAR,
  },
  {
    id: 4,
    name: 'Electronics',
    icon: ELECTRONICS,
  },
  {
    id: 11,
    name: 'Fashion',
    icon: CLOTHES,
  },
  {
    id: 2,
    name: 'Furnitures',
    icon: FURNITURE,
  },
  {
    id: 5,
    name: 'Games & Toys',
    icon: CONTROLLER,
  },
  {
    id: 10,
    name: 'Garden & Tools',
    icon: GARDEN_TOOLS,
  },
  {
    id: 8,
    name: 'Home Cleaning & Tools',
    icon: CLEANING,
  },
  {
    id: 16,
    name: 'Home Decor Items',
    icon: DECORATION,
  },
  {
    id: 19,
    name: 'Home Goods',
    icon: CURTAINS,
  },
  {
    id: 20,
    name: 'Jewelry & Accessories',
    icon: JEWELRY,
  },
  {
    id: 1,
    name: 'Kitchen & Housewares',
    icon: UTENSILS,
  },
  {
    id: 14,
    name: 'Office Equipment & Supplies',
    icon: WRITE_DOCUMENT,
  },
  {
    id: 9,
    name: 'Pets Supplies',
    icon: PET,
  },
  {
    id: 6,
    name: 'Sporting Goods',
    icon: SPORTS,
  },
  {
    id: 17,
    name: 'Wireless Accessories',
    icon: WIRELESS,
  },
]

const QuickCategories = [
  {
    id: 'all',
    name: 'All',
    icon: ALL_CATEGORIES,
  },
  Categories[7], // Fashion
  Categories[6], // Electronics
  Categories[8], // Furnitures
  Categories[0], // Appliances
  {
    id: 'more',
    name: 'More',
    icon: ELLIPSIS,
  },
]

export default Categories
export { QuickCategories }

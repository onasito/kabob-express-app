export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  items?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: string; // Decimal comes as string from API
  isAvailable: boolean;
  categoryId: number;
  category?: MenuCategory;
  createdAt: string;
  updatedAt: string;
}

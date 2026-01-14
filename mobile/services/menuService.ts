import api from '../config/api';

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

const menuService = {
  // Get all categories with items
  getCategories: async (): Promise<MenuCategory[]> => {
    const response = await api.get<MenuCategory[]>('/menu/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<MenuCategory> => {
    const response = await api.get<MenuCategory>(`/menu/categories/${id}`);
    return response.data;
  },

  // Get all menu items
  getItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>('/menu/items');
    return response.data;
  },

  // Get menu item by ID
  getItemById: async (id: number): Promise<MenuItem> => {
    const response = await api.get<MenuItem>(`/menu/items/${id}`);
    return response.data;
  },
};

export default menuService;

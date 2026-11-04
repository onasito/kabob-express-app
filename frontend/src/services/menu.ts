import api from "../config/api.ts";
import type { MenuCategory, MenuItem } from "../types.ts";

const menuService =  {
    getCategories: async (): Promise<MenuCategory[]> => {
        const response = await api.get<MenuCategory[]>('/menu/categories');
        return response.data;
    },
    getCategoryById: async (id: number): Promise<MenuCategory> => {
        const response = await api.get<MenuCategory>(`/menu/categories/${id}`)
        return response.data;
    },

    getItems: async (): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>('/menu/items');
        return response.data;
    },
    getItemById: async (id: number): Promise<MenuItem> => {
        const response = await api.get<MenuItem>(`/menu/items/${id}`);
        return response.data
    }
}

export default menuService;
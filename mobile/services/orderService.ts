import api from '../config/api';
import { MenuItem } from './menuService';
import { User } from './authService';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  quantity: number;
  price: string; // Decimal comes as string
  menuItemId: number;
  orderId: number;
  menuItem: MenuItem;
}

export interface Order {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  status: OrderStatus;
  totalPrice: string; // Decimal comes as string
  userId: number | null;
  user?: User | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderData {
  customerName?: string;
  customerPhone?: string;
  userId?: number;
  items: CreateOrderItem[];
}

export interface UpdateOrderData {
  customerName?: string;
  customerPhone?: string;
  status?: OrderStatus;
}

const orderService = {
  // Get all orders (with optional filters)
  getOrders: async (params?: { status?: OrderStatus; userId?: number }): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Get orders by user ID
  getOrdersByUser: async (userId: number): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },

  // Create new order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // Update order
  updateOrder: async (id: number, data: UpdateOrderData): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export default orderService;

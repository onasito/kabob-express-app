import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { type MenuItem } from '../services/menuService'

interface CartItem {
  item: MenuItem
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  cart: CartState
  addItem: (item: MenuItem) => void
  removeItem: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const initialState: CartState = {
  items: [],
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((ci) => ci.item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((ci) =>
            ci.item.id === action.payload.id ? { ...ci, quantity: ci.quantity + 1 } : ci
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { item: action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((ci) => ci.item.id !== action.payload),
      }
    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((ci) => ci.item.id !== menuItemId),
        }
      }
      return {
        ...state,
        items: state.items.map((ci) =>
          ci.item.id === menuItemId ? { ...ci, quantity } : ci
        ),
      }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (item: MenuItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (menuItemId: number) => dispatch({ type: 'REMOVE_ITEM', payload: menuItemId })
  const updateQuantity = (menuItemId: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = cart.items.reduce((sum, ci) => sum + ci.quantity, 0)
  const totalPrice = cart.items.reduce(
    (sum, ci) => sum + parseFloat(ci.item.price) * ci.quantity,
    0
  )

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export type { CartItem }

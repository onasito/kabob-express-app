# Kabob Express Mobile App

React Native mobile app built with Expo Router for the Kabob Express restaurant.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your phone (for testing on physical device)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the mobile directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and set your backend URL:

- **Android Emulator**: `EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api`
- **iOS Simulator**: `EXPO_PUBLIC_API_URL=http://localhost:5000/api`
- **Physical Device (Expo Go)**: `EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5000/api`

To find your computer's IP address:
- **Windows**: Run `ipconfig` and look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` or `ip addr`

**Important**: The `.env` file is gitignored and won't be committed. Each developer needs to create their own with their local IP address.

### 3. Start the Backend

Make sure your backend server is running:

```bash
cd ../backend
npm run dev
```

### 4. Start Expo

```bash
npm start
```

This will open the Expo Dev Tools in your browser.

### 5. Run on Device/Emulator

Choose one of the following:

- Press `a` - Run on Android emulator
- Press `i` - Run on iOS simulator (Mac only)
- Press `w` - Run on web browser
- Scan QR code with Expo Go app on your phone

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Menu screen (Tab 1)
│   │   └── two.tsx        # Orders screen (Tab 2)
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── config/
│   └── api.ts            # Axios configuration
├── services/             # API service layer
│   ├── authService.ts    # Authentication APIs
│   ├── menuService.ts    # Menu APIs
│   └── orderService.ts   # Order APIs
├── constants/            # App constants
└── assets/              # Images, fonts, etc.
```

## API Services

The app includes pre-configured services for your backend:

### Auth Service
- `register(data)` - Register new user
- `login(credentials)` - Login user
- `me()` - Get current user
- `logout()` - Logout user

### Menu Service
- `getCategories()` - Get all menu categories
- `getItems()` - Get all menu items
- `getItemById(id)` - Get specific menu item

### Order Service
- `getOrders(params?)` - Get all orders (with optional filters)
- `createOrder(data)` - Create new order
- `updateOrderStatus(id, status)` - Update order status
- `deleteOrder(id)` - Delete order

## Example Usage

```typescript
import menuService from '@/services/menuService';

// Fetch menu items
const items = await menuService.getItems();

// Create an order
import orderService from '@/services/orderService';

const order = await orderService.createOrder({
  customerName: 'John Doe',
  customerPhone: '555-1234',
  items: [
    { menuItemId: 1, quantity: 2 },
    { menuItemId: 3, quantity: 1 }
  ]
});
```

## Troubleshooting

### Can't connect to backend

1. Make sure backend is running on port 5000
2. Check your `config/api.ts` has the correct IP address
3. For physical devices, ensure phone and computer are on same WiFi network
4. Check your firewall isn't blocking port 5000

### Module not found errors

```bash
npm install
npx expo start --clear
```

## Next Steps

- Customize the menu screen UI
- Add order creation flow
- Implement user authentication
- Add shopping cart functionality
- Create order history screen
- Add payment integration

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)

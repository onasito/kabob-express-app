import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import menuService, { MenuItem } from '@/services/menuService';

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await menuService.getItems();
      setMenuItems(items);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu items');
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        {!item.isAvailable && (
          <Text style={styles.unavailable}>Currently Unavailable</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMenuItems}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kabob Express Menu</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  menuItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItemContent: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  unavailable: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

// Product List Screen
function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchProducts();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Now</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={30} color="#fff" style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

// Product Details Screen
function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;

  const addToCart = () => {
    navigation.navigate('Cart', { newItem: { ...product, quantity: 1 } });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.detailImage} />
      <View style={styles.detailContainer}>
        <Text style={styles.detailName}>{product.title}</Text>
        <Text style={styles.detailPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.detailDescription}>{product.description}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Cart Screen
function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState(route.params?.newItem ? [route.params.newItem] : []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={48} color="#6B7280" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <View style={styles.cartInfo}>
                  <Text style={styles.cartName} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cartPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          <View style={styles.cartFooter}>
            <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.checkoutButton, { opacity: cartItems.length ? 1 : 0.5 }]}
              disabled={!cartItems.length}
              onPress={() => navigation.navigate('Checkout', { cartItems, totalPrice })}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// Checkout & Payment Screen
function CheckoutScreen({ route, navigation }) {
  const { cartItems, totalPrice } = route.params || { cartItems: [], totalPrice: 0 };
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const placeOrder = () => {
    if (!address.trim()) {
      alert('Please enter a delivery address.');
      return;
    }
    navigation.navigate('OrderConfirmation', { cartItems, totalPrice, address, paymentMethod });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Checkout</Text>
      <Text style={styles.subTitle}>Delivery Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.subTitle}>Payment Method</Text>
      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'Credit Card' && styles.selectedPayment]}
        onPress={() => setPaymentMethod('Credit Card')}
      >
        <Ionicons name="card-outline" size={24} color="#fff" />
        <Text style={styles.paymentText}>Credit Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'PayPal' && styles.selectedPayment]}
        onPress={() => setPaymentMethod('PayPal')}
      >
        <Ionicons name="logo-paypal" size={24} color="#fff" />
        <Text style={styles.paymentText}>PayPal</Text>
      </TouchableOpacity>
      <Text style={styles.subTitle}>Order Summary</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryName}>{item.title}</Text>
            <Text style={styles.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
      />
      <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder}>
        <Text style={styles.checkoutButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Order Confirmation Screen
function OrderConfirmationScreen({ route }) {
  const { cartItems, totalPrice, address, paymentMethod } = route.params;
  const orderId = Math.floor(100000 + Math.random() * 900000); // Mock order ID

  return (
    <ScrollView style={styles.container}>
      <View style={styles.confirmationContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
        <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
        <Text style={styles.confirmationText}>Order ID: #{orderId}</Text>
      </View>
      <Text style={styles.sectionTitle}>Order Details</Text>
      <Text style={styles.subTitle}>Shipping Address</Text>
      <Text style={styles.detailText}>{address}</Text>
      <Text style={styles.subTitle}>Payment Method</Text>
      <Text style={styles.detailText}>{paymentMethod}</Text>
      <Text style={styles.subTitle}>Order Summary</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryName}>{item.title}</Text>
            <Text style={styles.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
      />
      <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
    </ScrollView>
  );
}

// Profile & Order History Screen
function ProfileScreen() {
  const orders = [
    {
      id: '1001',
      date: '2023-10-07',
      total: 59.99,
      items: [{ title: 'Men\'s Jacket', price: 59.99, quantity: 1 }],
    },
    {
      id: '1002',
      date: '2023-10-08',
      total: 29.99,
      items: [{ title: 'Women\'s T-Shirt', price: 29.99, quantity: 1 }],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Kinza</Text>
        <Text style={styles.profileEmail}>kinza@example.com</Text>
      </View>
      <Text style={styles.sectionTitle}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
              <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
              <Text style={styles.orderItems}>
                {item.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Cart' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{ title: 'Order Confirmation' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginRight: 16,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  detailContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cartImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  cartInfo: {
    flex: 1,
    padding: 12,
  },
  cartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cartPrice: {
    fontSize: 14,
    color: '#3B82F6',
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quantity: {
    fontSize: 16,
    color: '#1F2937',
  },
  cartFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 16,
    fontSize: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B7280',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  paymentText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryName: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  summaryPrice: {
    fontSize: 14,
    color: '#3B82F6',
  },
  confirmationContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailText: {
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 2,
  },
  orderTotal: {
    fontSize: 14,
    color: '#3B82F6',
    marginVertical: 2,
  },
  orderItems: {
    fontSize: 14,
    color: '#1F2937',
  },
});
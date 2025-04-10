import React, { useState, useContext, createContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, Button, StyleSheet, Switch, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Mock Product Data with Proper Images from Unsplash
const products = [
  { id: '1', name: 'Laptop', price: 999, description: 'High-performance laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a0fc?q=80&w=300' },
  { id: '2', name: 'Phone', price: 499, description: 'Latest smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300' },
  { id: '3', name: 'Headphones', price: 99, description: 'Noise-canceling headphones', image: 'https://images.unsplash.com/photo-1505740106531-4243f3831145?q=80&w=300' },
  { id: '4', name: 'Watch', price: 199, description: 'Smart fitness watch', image: 'https://images.unsplash.com/photo-1523275339254-cc67719e7b7f?q=80&w=300' },
  { id: '5', name: 'Tablet', price: 349, description: 'Portable tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300' },
  { id: '6', name: 'Camera', price: 799, description: 'Professional camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300' },
  { id: '7', name: 'Speaker', price: 149, description: 'Bluetooth speaker', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300' },
  { id: '8', name: 'Monitor', price: 299, description: '4K monitor', image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?q=80&w=300' },
  { id: '9', name: 'Keyboard', price: 89, description: 'Mechanical keyboard', image: 'https://images.unsplash.com/photo-1587829746771-c2092c5dd6f6?q=80&w=300' },
  { id: '10', name: 'Mouse', price: 49, description: 'Wireless mouse', image: 'https://images.unsplash.com/photo-1613141411350-6e5b31c5b07a?q=80&w=300' },
];

// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const placeOrder = (cartItems, shippingDetails) => {
    setOrders([...orders, { id: Date.now().toString(), items: cartItems, shippingDetails, status: 'Pending' }]);
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, orders, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFD700' }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to ShopX</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1579468111929-74f2c1c6e4c8?q=80&w=50' }} // Cart icon
          style={styles.headerIcon}
          onError={(e) => console.log(`Failed to load cart icon: ${e.nativeEvent.error}`)}
        />
      </View>
      <TextInput
        style={[styles.searchBar, { borderColor: '#FF33A1', backgroundColor: '#FFF', color: '#333' }]}
        placeholder="Search products..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productItem, { backgroundColor: '#FFFACD' }]}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              onError={(e) => console.log(`Failed to load ${item.name} image: ${e.nativeEvent.error}`)}
            />
            <View style={styles.productInfo}>
              <Text style={{ color: '#FF33A1', fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#33FF57' }}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Product Details Screen
const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFF3E6' }]}>
      <Image
        source={{ uri: product.image }}
        style={styles.detailImage}
        onError={(e) => console.log(`Failed to load ${product.name} detail image: ${e.nativeEvent.error}`)}
      />
      <Text style={[styles.title, { color: '#FF5733' }]}>{product.name}</Text>
      <Text style={{ color: '#33FF57' }}>${product.price}</Text>
      <Text style={{ color: '#5733FF' }}>{product.description}</Text>
      <View style={styles.quantityContainer}>
        <Button title="-" color="#FF5733" onPress={() => quantity > 1 && setQuantity(quantity - 1)} />
        <Text style={{ marginHorizontal: 10, color: '#333' }}>{quantity}</Text>
        <Button title="+" color="#33FF57" onPress={() => setQuantity(quantity + 1)} />
      </View>
      <Button
        title="Add to Cart"
        color="#007AFF"
        onPress={() => {
          addToCart(product, quantity);
          navigation.navigate('Cart');
        }}
      />
    </ScrollView>
  );
};

// Cart Screen
const CartScreen = ({ navigation }) => {
  const { cart, updateQuantity } = useContext(CartContext);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: '#F3E6FF' }]}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: '#FFFFFF' }]}>
            <Image
              source={{ uri: item.image }}
              style={styles.cartImage}
              onError={(e) => console.log(`Failed to load ${item.name} cart image: ${e.nativeEvent.error}`)}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#007AFF' }}>{item.name}</Text>
              <Text style={{ color: '#FF5733' }}>${item.price} x {item.quantity}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <Button title="-" color="#FF5733" onPress={() => updateQuantity(item.id, item.quantity - 1)} />
              <Text style={{ marginHorizontal: 10, color: '#333' }}>{item.quantity}</Text>
              <Button title="+" color="#33FF57" onPress={() => updateQuantity(item.id, item.quantity + 1)} />
            </View>
          </View>
        )}
      />
      <Text style={[styles.total, { color: '#5733FF' }]}>Total: ${totalPrice}</Text>
      <Button
        title="Checkout"
        color="#FF5733"
        onPress={() => navigation.navigate('Checkout')}
        disabled={cart.length === 0}
      />
    </View>
  );
};

// Checkout Screen
const CheckoutScreen = ({ navigation }) => {
  const { cart, placeOrder } = useContext(CartContext);
  const [shippingDetails, setShippingDetails] = useState({ address: '', method: 'Standard' });
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#E6FFE6' }]}>
      <TextInput
        style={[styles.input, { borderColor: '#33FF57', color: '#333' }]}
        placeholder="Shipping Address"
        placeholderTextColor="#666"
        value={shippingDetails.address}
        onChangeText={(text) => setShippingDetails({ ...shippingDetails, address: text })}
      />
      <Text style={{ color: '#5733FF' }}>Payment Method: Credit Card (Mock)</Text>
      <Text style={[styles.total, { color: '#FF5733' }]}>Total: ${totalPrice}</Text>
      <Button
        title="Place Order"
        color="#007AFF"
        onPress={() => {
          placeOrder(cart, shippingDetails);
          navigation.navigate('OrderHistory');
        }}
        disabled={!shippingDetails.address || cart.length === 0}
      />
    </ScrollView>
  );
};

// Order History Screen
const OrderHistoryScreen = () => {
  const { orders } = useContext(CartContext);

  return (
    <View style={[styles.container, { backgroundColor: '#FFE6F3' }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.orderItem, { backgroundColor: '#FFFFFF' }]}>
            <Text style={{ color: '#007AFF' }}>Order #{item.id}</Text>
            <Text style={{ color: '#33FF57' }}>
              Items: {item.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
            </Text>
            <Text style={{ color: '#5733FF' }}>Shipping: {item.shippingDetails.address}</Text>
            <Text style={{ color: '#FF33A1' }}>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Profile & Settings Screen
const ProfileSettingsScreen = () => {
  const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#FFF3E6' }]}>
      <TextInput
        style={[styles.input, { borderColor: '#007AFF', color: isDarkTheme ? '#FFF' : '#333' }]}
        placeholder="Name"
        placeholderTextColor={isDarkTheme ? '#CCC' : '#666'}
        value={userInfo.name}
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
      />
      <TextInput
        style={[styles.input, { borderColor: '#007AFF', color: isDarkTheme ? '#FFF' : '#333' }]}
        placeholder="Email"
        placeholderTextColor={isDarkTheme ? '#CCC' : '#666'}
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
      />
      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkTheme ? '#FFF' : '#5733FF' }}>Dark Theme</Text>
        <Switch value={isDarkTheme} onValueChange={setIsDarkTheme} thumbColor="#33FF57" trackColor={{ true: '#007AFF' }} />
      </View>
    </ScrollView>
  );
};

// Navigation Setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerStyle: { backgroundColor: '#FF33A1' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ headerStyle: { backgroundColor: '#FF5733' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerStyle: { backgroundColor: '#33FF57' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerStyle: { backgroundColor: '#5733FF' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerStyle: { backgroundColor: '#FFFF33' }, headerTintColor: '#333' }} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ headerStyle: { backgroundColor: '#FF5733' }, headerTintColor: '#FFF' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#FF33A1' },
  headerIcon: { width: 50, height: 50, borderRadius: 25 },
  searchBar: { height: 40, borderWidth: 2, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10, elevation: 2 },
  productItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 10, elevation: 3 },
  productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  productInfo: { flex: 1 },
  detailImage: { width: '100%', height: 250, borderRadius: 15, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 10 },
  cartItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 10, elevation: 3 },
  cartImage: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  total: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  input: { height: 40, borderWidth: 2, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10 },
  orderItem: { padding: 15, borderRadius: 10, marginBottom: 10, elevation: 3 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
});
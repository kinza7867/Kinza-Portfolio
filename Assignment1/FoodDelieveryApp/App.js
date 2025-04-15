import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Sample data with high-quality images from Pexels
const restaurants = [
  { 
    id: '1', 
    name: 'Italian Bistro', 
    image: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg', 
    rating: 4.8,
    cuisine: 'Italian'
  },
  { 
    id: '2', 
    name: 'Sushi Haven', 
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg', 
    rating: 4.9,
    cuisine: 'Japanese'
  },
  { 
    id: '3', 
    name: 'Burger Bliss', 
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', 
    rating: 4.5,
    cuisine: 'American'
  },
];

const menuItems = [
  { id: '1', name: 'Truffle Carbonara', price: 15.99, image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg' },
  { id: '2', name: 'Sashimi Deluxe', price: 12.99, image: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg' },
  { id: '3', name: 'Bacon Cheeseburger', price: 10.99, image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg' },
  { id: '4', name: 'Margherita Pizza', price: 13.99, image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg' },
  { id: '5', name: 'Tempura Roll', price: 9.99, image: 'https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg' },
  { id: '6', name: 'BBQ Ribs', price: 16.99, image: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg' },
  { id: '7', name: 'Tiramisu', price: 6.99, image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg' },
];

const Stack = createStackNavigator();

// Home Screen
function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Haven</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
          >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.cuisine}>{item.cuisine}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Restaurant Details Screen
function RestaurantDetailsScreen({ route, navigation }) {
  const { restaurant } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.detailImage} />
      <View style={styles.detailHeader}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
        </View>
      </View>
      <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      <Text style={styles.sectionTitle}>Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>${item.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Cart', { item })}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Reviews</Text>
      <View style={styles.review}>
        <Text style={styles.reviewText}>"Exquisite flavors and prompt delivery!"</Text>
        <Text style={styles.reviewer}>- Gourmet Lover</Text>
      </View>
    </ScrollView>
  );
}

// Cart Screen
function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState(route.params?.item ? [route.params.item] : []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartInfo}>
              <Text style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartPrice}>${item.price}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.cartFooter}>
        <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Checkout & Payment Screen
function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate('OrderTracking')}
      >
        <Text style={styles.checkoutButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

// Order Tracking Screen
function OrderTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Tracking</Text>
      <View style={styles.trackingStatus}>
        <Text style={styles.statusText}>Order Status: Preparing</Text>
        <Text style={styles.statusText}>Estimated Delivery: 25 minutes</Text>
      </View>
      <View style={styles.trackingMap}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3566187/pexels-photo-3566187.jpeg' }}
          style={styles.mapImage}
        />
      </View>
    </View>
  );
}

// Profile & Order History Screen
function ProfileScreen() {
  const orders = [
    { id: '1', restaurant: 'Italian Bistro', date: '2023-10-05', total: 15.99, image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg' },
    { id: '2', restaurant: 'Sushi Haven', date: '2023-10-06', total: 12.99, image: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg' },
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
            <Image source={{ uri: item.image }} style={styles.orderImage} />
            <View style={styles.orderInfo}>
              <Text style={styles.orderRestaurant}>{item.restaurant}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
              <Text style={styles.orderTotal}>${item.total}</Text>
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
          headerStyle: { backgroundColor: '#1E3A8A' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEAFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBar: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    margin: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: 120,
    height: 120,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cuisine: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#1F2937',
  },
  detailImage: {
    width: '100%',
    height: 280,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuInfo: {
    flex: 1,
    padding: 12,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuPrice: {
    fontSize: 16,
    color: '#EF4444',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  review: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    color: '#1F2937',
  },
  reviewer: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cartImage: {
    width: 80,
    height: 80,
  },
  cartInfo: {
    flex: 1,
    padding: 12,
  },
  cartName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cartPrice: {
    fontSize: 16,
    color: '#EF4444',
    marginVertical: 4,
  },
  cartFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  paymentText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  trackingStatus: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#1F2937',
    marginVertical: 4,
  },
  trackingMap: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  orderImage: {
    width: 80,
    height: 80,
  },
  orderInfo: {
    flex: 1,
    padding: 12,
  },
  orderRestaurant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 2,
  },
  orderTotal: {
    fontSize: 16,
    color: '#EF4444',
  },
});
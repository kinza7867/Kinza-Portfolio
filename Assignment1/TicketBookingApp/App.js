import React, { useState, useContext, createContext } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Mock Data with Lorem Picsum Images
const initialItems = [
  { 
    id: '1', 
    type: 'Movie', 
    title: 'Neon Shadows', 
    image: 'https://picsum.photos/id/237/300/300', 
    price: 15, 
    showtimes: ['16:00', '19:00'], 
    seats: ['A1', 'A2', 'B1', 'B2'], 
    duration: '2h 10m', 
    rating: '8.5', 
    description: 'A cyberpunk thriller set in a futuristic city.' 
  },
  { 
    id: '2', 
    type: 'Event', 
    title: 'Glow Fest', 
    image: 'https://picsum.photos/id/1025/300/300', 
    price: 40, 
    date: '2025-04-25', 
    location: 'Riverside Park', 
    duration: '5h', 
    rating: '9.0', 
    description: 'A vibrant night of lights and music.' 
  },
  { 
    id: '3', 
    type: 'Travel', 
    title: 'Flight to Bali', 
    image: 'https://picsum.photos/id/1015/300/300', 
    price: 500, 
    departure: '2025-06-15 09:00', 
    seats: ['F1', 'F2', 'F3'], 
    duration: '8h 45m', 
    rating: '7.8', 
    description: 'A tropical escape to paradise.' 
  },
  { 
    id: '4', 
    type: 'Movie', 
    title: 'Echoes of Time', 
    image: 'https://picsum.photos/id/1043/300/300', 
    price: 13, 
    showtimes: ['18:00', '21:00'], 
    seats: ['C1', 'C2', 'D1', 'D2'], 
    duration: '1h 55m', 
    rating: '8.2', 
    description: 'A time-travel adventure with twists.' 
  },
  { 
    id: '5', 
    type: 'Event', 
    title: 'Art Expo', 
    image: 'https://picsum.photos/id/1060/300/300', 
    price: 25, 
    date: '2025-05-10', 
    location: 'Gallery Square', 
    duration: '3h', 
    rating: '8.7', 
    description: 'Showcase of modern art and sculptures.' 
  },
  { 
    id: '6', 
    type: 'Travel', 
    title: 'Train to Alps', 
    image: 'https://picsum.photos/id/1019/300/300', 
    price: 120, 
    departure: '2025-07-01 07:30', 
    seats: ['E1', 'E2'], 
    duration: '6h 20m', 
    rating: '8.9', 
    description: 'Scenic journey through the mountains.' 
  },
];

// App Context
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Maya Lee', email: 'maya@example.com' });
  const [bookings, setBookings] = useState([]);
  const [items] = useState(initialItems);

  const bookTicket = (item, details) => {
    const booking = { id: String(bookings.length + 1), item, details, status: 'Upcoming', timestamp: new Date().toISOString() };
    setBookings([booking, ...bookings]);
  };

  return (
    <AppContext.Provider value={{ user, setUser, bookings, bookTicket, items }}>
      {children}
    </AppContext.Provider>
  );
};

// Home Screen (Grid Layout)
const HomeScreen = ({ navigation }) => {
  const { items } = useContext(AppContext);

  return (
    <LinearGradient colors={['#FF6F61', '#FF9F1C']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        initialNumToRender={6}
        windowSize={5}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('BookingDetails', { item })}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.gridImage} 
              onError={(e) => console.log(`Failed to load ${item.title} image: ${e.nativeEvent.error}`)}
              defaultSource={{ uri: 'https://via.placeholder.com/150x150.png?text=No+Image' }}
            />
            <Text style={styles.gridTitle}>{item.title}</Text>
            <Text style={styles.gridSubtitle}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.navButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyBookings')}>
          <Text style={styles.navButtonText}>🎟️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ProfileSettings')}>
          <Text style={styles.navButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Search & Filter Screen
const SearchFilterScreen = ({ navigation }) => {
  const { items } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredItems = items.filter(item => 
    (item.title.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === 'All' || item.type === typeFilter)
  );

  return (
    <LinearGradient colors={['#FF9F1C', '#FFD166']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <TextInput style={styles.input} placeholder="Search..." placeholderTextColor="#FFF" value={search} onChangeText={setSearch} />
      <RNPickerSelect
        onValueChange={(value) => setTypeFilter(value)}
        items={[
          { label: 'All', value: 'All' },
          { label: 'Movies', value: 'Movie' },
          { label: 'Events', value: 'Event' },
          { label: 'Travel', value: 'Travel' },
        ]}
        style={pickerSelectStyles}
        value={typeFilter}
        placeholder={{ label: 'Select a type...', value: null }}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        initialNumToRender={6}
        windowSize={5}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('BookingDetails', { item })}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.gridImage} 
              onError={(e) => console.log(`Failed to load ${item.title} image: ${e.nativeEvent.error}`)}
              defaultSource={{ uri: 'https://via.placeholder.com/150x150.png?text=No+Image' }}
            />
            <Text style={styles.gridTitle}>{item.title}</Text>
            <Text style={styles.gridSubtitle}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

// Booking Details Screen
const BookingDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params || {};
  const { bookTicket } = useContext(AppContext);
  const [selectedTime, setSelectedTime] = useState(item?.showtimes?.[0] || item?.departure || item?.date || '');
  const [selectedSeat, setSelectedSeat] = useState(item?.seats?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <LinearGradient colors={['#FFD166', '#06D6A0']} style={styles.container}>
        <Text style={styles.appName}>TickaLad</Text>
        <Text style={styles.errorText}>Error: Item not found. Please go back and try again.</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const totalPrice = item.price * quantity;

  const handleBook = () => {
    const details = { time: selectedTime, seat: selectedSeat, quantity, totalPrice };
    bookTicket(item, details);
    navigation.navigate('Payment', { booking: { item, details } });
  };

  return (
    <LinearGradient colors={['#FFD166', '#06D6A0']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <ScrollView>
        <Image 
          source={{ uri: item.image }} 
          style={styles.detailImage} 
          onError={(e) => console.log(`Failed to load ${item.title} detail image: ${e.nativeEvent.error}`)}
          defaultSource={{ uri: 'https://via.placeholder.com/300x200.png?text=No+Image' }}
        />
        <Text style={styles.detailTitle}>{item.title}</Text>
        <Text style={styles.detailInfo}>{item.type} • {item.duration} • ⭐ {item.rating}</Text>
        <Text style={styles.detailDescription}>{item.description}</Text>
        <Text style={styles.detailPrice}>${item.price} / ticket</Text>
        {item.showtimes && (
          <RNPickerSelect
            onValueChange={setSelectedTime}
            items={item.showtimes.map(time => ({ label: time, value: time }))}
            style={pickerSelectStyles}
            value={selectedTime}
            placeholder={{ label: 'Select a time...', value: null }}
          />
        )}
        {item.seats && (
          <RNPickerSelect
            onValueChange={setSelectedSeat}
            items={item.seats.map(seat => ({ label: seat, value: seat }))}
            style={pickerSelectStyles}
            value={selectedSeat}
            placeholder={{ label: 'Select a seat...', value: null }}
          />
        )}
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.circleControl} onPress={() => quantity > 1 && setQuantity(quantity - 1)}>
            <Text style={styles.controlText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity style={styles.circleControl} onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// Payment Screen
const PaymentScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [discountCode, setDiscountCode] = useState('');
  
  if (!booking || !booking.item) {
    return (
      <LinearGradient colors={['#06D6A0', '#118AB2']} style={styles.container}>
        <Text style={styles.appName}>TickaLad</Text>
        <Text style={styles.errorText}>Error: Booking not found. Please go back and try again.</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const discount = discountCode === 'TICKA20' ? 0.20 : 0;
  const finalPrice = booking.details.totalPrice * (1 - discount);

  const handlePayment = () => {
    navigation.navigate('MyBookings');
  };

  return (
    <LinearGradient colors={['#06D6A0', '#118AB2']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <ScrollView>
        <Text style={styles.detailTitle}>Payment</Text>
        <Text style={styles.detailInfo}>{booking.item.title}</Text>
        <Text style={styles.detailPrice}>Subtotal: ${booking.details.totalPrice}</Text>
        <TextInput style={styles.input} placeholder="Discount Code" placeholderTextColor="#FFF" value={discountCode} onChangeText={setDiscountCode} />
        <Text style={styles.discountText}>{discount > 0 ? `Discount: -$${booking.details.totalPrice * discount}` : 'No Discount'}</Text>
        <Text style={styles.totalPrice}>Final: ${finalPrice}</Text>
        <RNPickerSelect
          onValueChange={setPaymentMethod}
          items={[
            { label: 'Credit Card', value: 'Credit Card' },
            { label: 'PayPal', value: 'PayPal' },
            { label: 'Apple Pay', value: 'Apple Pay' },
          ]}
          style={pickerSelectStyles}
          value={paymentMethod}
          placeholder={{ label: 'Select a payment method...', value: null }}
        />
        <TouchableOpacity style={styles.bookButton} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// My Bookings Screen
const MyBookingsScreen = ({ navigation }) => {
  const { bookings } = useContext(AppContext);

  return (
    <LinearGradient colors={['#118AB2', '#073B4C']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <Text style={styles.sectionTitle}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        initialNumToRender={6}
        windowSize={5}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>{item.item.title}</Text>
            <Text style={styles.bookingDetail}>{item.item.type} • {item.details.time}</Text>
            {item.details.seat && <Text style={styles.bookingDetail}>Seat: {item.details.seat}</Text>}
            <Text style={styles.bookingDetail}>Qty: {item.details.quantity} • ${item.details.totalPrice}</Text>
            <Text style={styles.bookingStatus}>{item.status}</Text>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.navButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ProfileSettings')}>
          <Text style={styles.navButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Profile & Settings Screen
const ProfileSettingsScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AppContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    setUser({ ...user, name, email });
  };

  return (
    <LinearGradient colors={['#073B4C', '#EF476F']} style={styles.container}>
      <Text style={styles.appName}>TickaLad</Text>
      <ScrollView>
        <Text style={styles.sectionTitle}>Profile</Text>
        <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#FFF" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#FFF" value={email} onChangeText={setEmail} />
        <TouchableOpacity style={styles.bookButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>History</Text>
        <Text style={styles.placeholderText}>No history yet (mock).</Text>
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.navButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyBookings')}>
          <Text style={styles.navButtonText}>🎟️</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Navigation Setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={SearchFilterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  appName: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 20, textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  gridItem: { flex: 1, margin: 10, alignItems: 'center' },
  gridImage: { 
    width: width * 0.4, 
    height: width * 0.4, 
    borderRadius: width * 0.2, 
    borderWidth: 2, 
    borderColor: '#FFF' 
  },
  gridTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
  gridSubtitle: { fontSize: 14, color: '#FFF', opacity: 0.8 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 25, marginTop: 10 },
  navButton: { 
    width: width * 0.12, 
    height: width * 0.12, 
    borderRadius: width * 0.06, 
    backgroundColor: '#EF476F', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  navButtonText: { fontSize: 24, color: '#FFF' },
  input: { height: 50, borderWidth: 2, borderColor: '#FFF', paddingHorizontal: 15, marginBottom: 15, borderRadius: 25, color: '#FFF', backgroundColor: 'rgba(255,255,255,0.1)' },
  detailImage: { 
    width: '100%', 
    height: height * 0.3, 
    borderRadius: 20, 
    marginBottom: 20 
  },
  detailTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  detailInfo: { fontSize: 16, color: '#FFF', marginBottom: 10 },
  detailDescription: { fontSize: 14, color: '#FFF', opacity: 0.9, marginBottom: 15 },
  detailPrice: { fontSize: 18, fontWeight: 'bold', color: '#FFD166', marginBottom: 15 },
  quantityContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  circleControl: { 
    width: width * 0.12, 
    height: width * 0.12, 
    borderRadius: width * 0.06, 
    backgroundColor: '#EF476F', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  controlText: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  quantityText: { fontSize: 24, color: '#FFF', marginHorizontal: 20 },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#FFD166', textAlign: 'center', marginVertical: 15 },
  bookButton: { backgroundColor: '#EF476F', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
  discountText: { fontSize: 16, color: '#FFD166', marginBottom: 15 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  bookingCard: { padding: 15, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, marginBottom: 15 },
  bookingTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  bookingDetail: { fontSize: 14, color: '#FFF', marginVertical: 2 },
  bookingStatus: { fontSize: 14, color: '#FFD166', marginTop: 5 },
  placeholderText: { fontSize: 14, color: '#FFF', opacity: 0.7, fontStyle: 'italic' },
  errorText: { fontSize: 18, color: '#FFF', textAlign: 'center', marginVertical: 20 },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 25,
    color: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  inputAndroid: {
    height: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 25,
    color: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
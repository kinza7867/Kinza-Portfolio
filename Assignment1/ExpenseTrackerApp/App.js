import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, Switch, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LineChart, PieChart } from 'react-native-chart-kit';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// App Context for global state
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [user, setUser] = useState({ name: 'Kinza Ali', email: 'kinza.ali@example.com' }); // Initialize with your name

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        const storedBudgets = await AsyncStorage.getItem('budgets');
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
        if (storedTheme) setTheme(storedTheme);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage
  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveData('theme', newTheme);
  };

  const addTransaction = (transaction) => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
  };

  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    saveData('budgets', newBudgets);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    saveData('user', updatedUser);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, transactions, addTransaction, budgets, updateBudgets, user, setUser: updateUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Dashboard Screen
const DashboardScreen = ({ navigation }) => {
  const { theme, transactions, user } = useContext(AppContext);
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
   AMINtransform: [{ scale: withSpring(animatedValue.value) }],
  }));

  useEffect(() => {
    animatedValue.value = 1;
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Hello, {user.name}!</Text>
      <Text style={[styles.subTitle, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Expense Tracker</Text>
      <Animated.View style={[styles.summaryCard, animatedStyle, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
        <Text style={[styles.summaryText, { color: theme === 'light' ? '#4B5563' : '#D1D5DB' }]}>Balance: ${balance.toFixed(2)}</Text>
        <Text style={[styles.summaryText, { color: '#22C55E' }]}>Income: ${totalIncome.toFixed(2)}</Text>
        <Text style={[styles.summaryText, { color: '#EF4444' }]}>Expenses: ${totalExpenses.toFixed(2)}</Text>
      </Animated.View>
      <View style={styles.navContainer}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.navButtonText}>➕ Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.navButtonText}>📜 Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.navButtonText}>📊 Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={() => navigation.navigate('Budget')}>
          <Text style={styles.navButtonText}>💰 Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navButtonText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Add Expense/Income Screen
const AddExpenseScreen = ({ navigation }) => {
  const { theme, addTransaction } = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('expense');

  const handleAdd = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    const transaction = {
      id: String(Date.now()),
      amount: parseFloat(amount),
      category,
      date,
      type,
    };
    addTransaction(transaction);
    navigation.goBack();
  };

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Add Transaction</Text>
      <View style={[styles.inputCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Amount"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Category (e.g., Food, Salary)"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          value={date}
          onChangeText={setDate}
        />
        <View style={styles.switchContainer}>
          <Text style={{ color: theme === 'light' ? '#1F2937' : '#F9FAFB' }}>{type === 'expense' ? 'Expense' : 'Income'}</Text>
          <Switch
            value={type === 'income'}
            onValueChange={() => setType(type === 'expense' ? 'income' : 'expense')}
            trackColor={{ false: '#EF4444', true: '#22C55E' }}
            thumbColor={theme === 'light' ? '#FFFFFF' : '#D1D5DB'}
          />
        </View>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Transactions List Screen
const TransactionsListScreen = () => {
  const { theme, transactions } = useContext(AppContext);

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.transactionCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
            <Text style={[styles.transactionText, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>{item.category}</Text>
            <Text style={[styles.transactionText, { color: item.type === 'income' ? '#22C55E' : '#EF4444' }]}>
              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <Text style={[styles.transactionText, { color: theme === 'light' ? '#9CA3AF' : '#6B7280' }]}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme === 'light' ? '#9CA3AF' : '#6B7280' }]}>No transactions yet.</Text>}
      />
    </LinearGradient>
  );
};

// Reports & Analytics Screen
const ReportsScreen = () => {
  const { theme, transactions } = useContext(AppContext);

  const categories = [...new Set(transactions.map(t => t.category))];
  const categoryData = categories.map(category => ({
    name: category,
    value: transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    legendFontColor: theme === 'light' ? '#1F2937' : '#F9FAFB',
    legendFontSize: 14,
  })).filter(data => data.value > 0);

  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = t.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {});

  const lineChartData = {
    labels: Object.keys(monthlyData).sort().slice(-6),
    datasets: [{ data: Object.keys(monthlyData).sort().slice(-6).map(month => monthlyData[month]) }],
  };

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Reports & Analytics</Text>
      {categoryData.length > 0 ? (
        <>
          <Text style={[styles.chartTitle, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Spending by Category</Text>
          <PieChart
            data={categoryData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151',
              backgroundGradientFrom: theme === 'light' ? '#FFFFFF' : '#374151',
              backgroundGradientTo: theme === 'light' ? '#FFFFFF' : '#374151',
              color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`,
              labelColor: () => (theme === 'light' ? '#1F2937' : '#F9FAFB'),
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={[styles.chartTitle, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Monthly Spending Trend</Text>
          <LineChart
            data={lineChartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151',
              backgroundGradientFrom: theme === 'light' ? '#FFFFFF' : '#374151',
              backgroundGradientTo: theme === 'light' ? '#FFFFFF' : '#374151',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`,
              labelColor: () => (theme === 'light' ? '#1F2937' : '#F9FAFB'),
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#A5B4FC' },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </>
      ) : (
        <Text style={[styles.emptyText, { color: theme === 'light' ? '#9CA3AF' : '#6B7280' }]}>No data to display.</Text>
      )}
    </LinearGradient>
  );
};

// Budget Settings Screen
const BudgetSettingsScreen = () => {
  const { theme, budgets, updateBudgets } = useContext(AppContext);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSetBudget = () => {
    if (!category || !limit || isNaN(limit)) {
      Alert.alert('Error', 'Please enter a valid category and limit');
      return;
    }
    const newBudgets = { ...budgets, [category]: parseFloat(limit) };
    updateBudgets(newBudgets);
    setCategory('');
    setLimit('');
  };

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Budget Settings</Text>
      <View style={[styles.inputCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Category (e.g., Food)"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Budget Limit"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          keyboardType="numeric"
          value={limit}
          onChangeText={setLimit}
        />
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={handleSetBudget}>
          <Text style={styles.buttonText}>Set Budget</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.subTitle, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Current Budgets</Text>
      {Object.keys(budgets).map(key => (
        <View key={key} style={[styles.budgetCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
          <Text style={[styles.budgetText, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>{key}: ${budgets[key].toFixed(2)}</Text>
        </View>
      ))}
    </LinearGradient>
  );
};

// Profile & Theme Settings Screen
const ProfileSettingsScreen = () => {
  const { theme, toggleTheme, user, setUser } = useContext(AppContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    setUser({ ...user, name, email });
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <LinearGradient colors={theme === 'light' ? ['#E0E7FF', '#A5B4FC'] : ['#1F2937', '#111827']} style={styles.container}>
      <Text style={[styles.title, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Profile & Settings</Text>
      <View style={[styles.inputCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Name"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { color: theme === 'light' ? '#1F2937' : '#F9FAFB', borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563' }]}
          placeholder="Email"
          placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme === 'light' ? '#A5B4FC' : '#4B5563' }]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.themeCard, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#374151' }]}>
        <Text style={[styles.themeText, { color: theme === 'light' ? '#1F2937' : '#F9FAFB' }]}>Theme: {theme === 'light' ? 'Light' : 'Dark'}</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#D1D5DB', true: '#4B5563' }}
          thumbColor={theme === 'light' ? '#A5B4FC' : '#F9FAFB'}
        />
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
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Transactions" component={TransactionsListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Reports" component={ReportsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Budget" component={BudgetSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileSettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  subTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryText: { fontSize: 18, marginVertical: 5 },
  navContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  navButton: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    width: (width - 60) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  navButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  inputCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  actionButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionCard: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionText: { fontSize: 16 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
  chartTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  budgetCard: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  budgetText: { fontSize: 16 },
  themeCard: {
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  themeText: { fontSize: 16 },
});
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.cityName}>City Name</Text>
      <View style={styles.card}>
        <Text style={styles.temperature}>25°C</Text>
        <Text style={styles.condition}>Partly Cloudy</Text>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' }}
          style={styles.weatherIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 20,
    marginTop: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

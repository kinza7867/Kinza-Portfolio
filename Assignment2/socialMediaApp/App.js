import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const users = {
  kinza_001: {
    name: 'Kinza Ali',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Lover of tech and tea ☕',
    followers: 180,
    following: 120,
    stories: ['https://picsum.photos/id/111/400', 'https://picsum.photos/id/112/400'],
  },
  ayan_002: {
    name: 'Ayan Khan',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Adventure is out there! 🧗‍♂️',
    followers: 210,
    following: 95,
    stories: ['https://picsum.photos/id/113/400', 'https://picsum.photos/id/114/400'],
  },
  maira_003: {
    name: 'Maira Sheikh',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Digital Artist 🎨',
    followers: 300,
    following: 250,
    stories: ['https://picsum.photos/id/115/400'],
  },
  sara_004: {
    name: 'Sara Zain',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'Bookworm and coder 📚💻',
    followers: 430,
    following: 310,
    stories: ['https://picsum.photos/id/116/400', 'https://picsum.photos/id/117/400'],
  },
  ali_005: {
    name: 'Ali Raza',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Traveling the world 🌍',
    followers: 520,
    following: 480,
    stories: ['https://picsum.photos/id/118/400'],
  },
};

const posts = [
  { id: '1', userId: 'kinza_001', image: 'https://picsum.photos/400', caption: 'Beautiful view today!', likes: 120 },
  { id: '2', userId: 'ayan_002', image: 'https://picsum.photos/401', caption: 'Hiking adventure!', likes: 80 },
  { id: '3', userId: 'maira_003', image: 'https://picsum.photos/402', caption: 'Artwork in progress', likes: 95 },
  { id: '4', userId: 'sara_004', image: 'https://picsum.photos/403', caption: 'Books are magic 📖', likes: 150 },
  { id: '5', userId: 'ali_005', image: 'https://picsum.photos/404', caption: 'From the mountains 🏔️', likes: 200 },
];

function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => {
    const user = users[item.userId];
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.userId })}>
          <View style={styles.row}>
            <Image source={{ uri: user.avatar }} style={styles.avatarSmall} />
            <Text style={styles.username}>@{item.userId}</Text>
          </View>
        </TouchableOpacity>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.likes}>{item.likes} Likes</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={{ backgroundColor: '#121212' }}
    />
  );
}

function ProfileScreen({ route }) {
  const { userId } = route.params;
  const user = users[userId];
  const userPosts = posts.filter((p) => p.userId === userId);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.profileImage} />
      <Text style={styles.username}>{user.name}</Text>
      <Text style={styles.bio}>{user.bio}</Text>
      <Text style={styles.follow}>{user.followers} Followers • {user.following} Following</Text>

      <Text style={styles.sectionTitle}>Stories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {user.stories.map((story, index) => (
          <Image key={index} source={{ uri: story }} style={styles.storyImage} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Posts</Text>
      {userPosts.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.likes}>{item.likes} Likes</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#121212' } }}>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerStyle: { backgroundColor: '#1f1f1f' }, headerTintColor: '#fff' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1f1f1f',
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginVertical: 10,
  },
  caption: {
    color: '#f0f0f0',
    fontSize: 14,
    marginBottom: 5,
  },
  likes: {
    color: '#bbb',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  bio: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 5,
  },
  follow: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8f8f8',
    marginVertical: 10,
  },
  storyImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
});

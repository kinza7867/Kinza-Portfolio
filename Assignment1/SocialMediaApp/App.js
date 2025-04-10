import React, { useState, useContext, createContext } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Mock Data with Multiple Posts and Avatars
const initialPosts = [
  { id: '1', user: 'Alice', content: 'Exploring the mountains! #nature', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=300', likes: 12, comments: ['Wow!', 'Amazing view'], tags: ['nature'] },
  { id: '2', user: 'Bob', content: 'New tech review video! #tech', video: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300', likes: 8, comments: ['Great content'], tags: ['tech'] },
  { id: '3', user: 'Alice', content: 'Sunset vibes #sunset', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300', likes: 15, comments: ['Beautiful'], tags: ['sunset'] },
  { id: '4', user: 'Charlie', content: 'Post-workout selfie #fitness', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300', likes: 5, comments: [], tags: ['fitness'] },
  { id: '5', user: 'Bob', content: 'Coding marathon #coding', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300', likes: 10, comments: ['Keep it up!'], tags: ['coding'] },
];
const initialUsers = [
  { id: '1', username: 'Alice', password: 'pass123', bio: 'Nature lover 🌿', posts: [initialPosts[0], initialPosts[2]], following: 20, followers: 25, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=50' },
  { id: '2', username: 'Bob', password: 'pass456', bio: 'Tech geek 👨‍💻', posts: [initialPosts[1], initialPosts[4]], following: 15, followers: 18, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=50' },
  { id: '3', username: 'Charlie', password: 'pass789', bio: 'Fitness enthusiast 💪', posts: [initialPosts[3]], following: 10, followers: 12, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50' },
];

// App Context
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState(initialUsers);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) setUser(foundUser);
    return !!foundUser;
  };

  const signup = (username, password) => {
    if (users.find(u => u.username === username)) return false;
    const newUser = { id: String(users.length + 1), username, password, bio: '', posts: [], following: 0, followers: 0, avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=50' };
    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };

  const createPost = (content, media, tags) => {
    const newPost = { id: String(posts.length + 1), user: user.username, content, [media.type]: media.url, likes: 0, comments: [], tags };
    setPosts([newPost, ...posts]);
    setUsers(users.map(u => u.id === user.id ? { ...u, posts: [newPost, ...u.posts] } : u));
    setNotifications([{ id: String(notifications.length + 1), text: `${user.username} posted: ${content.slice(0, 20)}...`, timestamp: new Date().toISOString() }, ...notifications]);
  };

  const likePost = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    const post = posts.find(p => p.id === postId);
    if (post.user !== user.username) {
      setNotifications([{ id: String(notifications.length + 1), text: `${user.username} liked ${post.user}'s post`, timestamp: new Date().toISOString() }, ...notifications]);
    }
  };

  const commentPost = (postId, comment) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, `${user.username}: ${comment}`] } : p));
    const post = posts.find(p => p.id === postId);
    if (post.user !== user.username) {
      setNotifications([{ id: String(notifications.length + 1), text: `${user.username} commented on ${post.user}'s post`, timestamp: new Date().toISOString() }, ...notifications]);
    }
  };

  const sendMessage = (to, text) => {
    const newMessage = { id: String(messages.length + 1), from: user.username, to, text, timestamp: new Date().toISOString() };
    setMessages([...messages, newMessage]);
    setNotifications([{ id: String(notifications.length + 1), text: `${user.username} sent a message to ${to}`, timestamp: new Date().toISOString() }, ...notifications]);
  };

  const followUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, followers: u.followers + 1 } : 
      u.id === user.id ? { ...u, following: u.following + 1 } : u
    ));
    const followedUser = users.find(u => u.id === userId);
    setNotifications([{ id: String(notifications.length + 1), text: `${user.username} followed ${followedUser.username}`, timestamp: new Date().toISOString() }, ...notifications]);
  };

  const unfollowUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, followers: u.followers - 1 } : 
      u.id === user.id ? { ...u, following: u.following - 1 } : u
    ));
  };

  return (
    <AppContext.Provider value={{ user, setUser, login, signup, posts, createPost, likePost, commentPost, users, messages, sendMessage, notifications, followUser, unfollowUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Login & Signup Screen
const AuthScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useContext(AppContext);

  const handleAuth = () => {
    if (isSignup) {
      if (signup(username, password)) navigation.replace('Feed');
      else alert('Username already exists!');
    } else {
      if (login(username, password)) navigation.replace('Feed');
      else alert('Invalid credentials!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFD1DC' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={isSignup ? 'Sign Up' : 'Login'} color="#FF69B4" onPress={handleAuth} />
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.switchText}>{isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Feed Screen
const FeedScreen = ({ navigation }) => {
  const { posts, likePost, commentPost, user, users } = useContext(AppContext);
  const [comment, setComment] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: '#E6E6FA' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.postHeader}>
              <Image source={{ uri: users.find(u => u.username === item.user).avatar }} style={styles.avatar} />
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: users.find(u => u.username === item.user).id })}>
                <Text style={styles.postUser}>{item.user}</Text>
              </TouchableOpacity>
            </View>
            {item.image && <Image source={{ uri: item.image }} style={styles.postMedia} />}
            {item.video && <Image source={{ uri: item.video }} style={styles.postMedia} />}
            <Text style={styles.postContent}>{item.content}</Text>
            <Text style={styles.postTags}>{item.tags.map(tag => `#${tag}`).join(' ')}</Text>
            <Text style={styles.postLikes}>{item.likes} Likes</Text>
            <View style={styles.postActions}>
              <Button title="Like" color="#FF4500" onPress={() => likePost(item.id)} />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={() => { commentPost(item.id, comment); setComment(''); }}
              />
            </View>
            {item.comments.map((c, idx) => <Text key={idx} style={styles.comment}>{c}</Text>)}
          </View>
        )}
      />
      <View style={styles.footer}>
        <Button title="Home" color="#FF69B4" onPress={() => navigation.navigate('Feed')} />
        <Button title="Post" color="#FF4500" onPress={() => navigation.navigate('CreatePost')} />
        <Button title="Profile" color="#32CD32" onPress={() => navigation.navigate('Profile')} />
        <Button title="Chat" color="#1E90FF" onPress={() => navigation.navigate('Chat')} />
        <Button title="Notifications" color="#FFD700" onPress={() => navigation.navigate('Notifications')} />
      </View>
    </View>
  );
};

// Create Post Screen
const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [tags, setTags] = useState('');
  const { createPost } = useContext(AppContext);

  const handlePost = () => {
    if (content || mediaUrl) {
      const tagArray = tags.split(' ').map(tag => tag.replace('#', '').trim()).filter(tag => tag);
      createPost(content, { type: mediaType, url: mediaUrl || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300' }, tagArray);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFACD' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <Text style={styles.title}>Create Post</Text>
      <TextInput style={styles.input} placeholder="What's on your mind?" value={content} onChangeText={setContent} multiline />
      <TextInput style={styles.input} placeholder="Media URL (optional)" value={mediaUrl} onChangeText={setMediaUrl} />
      <TextInput style={styles.input} placeholder="Tags (e.g., #fun #life)" value={tags} onChangeText={setTags} />
      <View style={styles.mediaType}>
        <Button title="Image" color={mediaType === 'image' ? '#FF4500' : '#CCC'} onPress={() => setMediaType('image')} />
        <Button title="Video" color={mediaType === 'video' ? '#FF4500' : '#CCC'} onPress={() => setMediaType('video')} />
      </View>
      <Button title="Post" color="#FF4500" onPress={handlePost} />
    </ScrollView>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation, route }) => {
  const { user, users, followUser, unfollowUser } = useContext(AppContext);
  const profileUser = route.params?.userId ? users.find(u => u.id === route.params.userId) : user;
  const isFollowing = user && profileUser && users.find(u => u.id === user.id).following > 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#98FB98' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <View style={styles.profileHeader}>
        <Image source={{ uri: profileUser.avatar }} style={styles.profileAvatar} />
        <Text style={styles.title}>{profileUser.username}</Text>
      </View>
      <Text style={styles.bio}>{profileUser.bio || 'No bio yet'}</Text>
      <Text style={styles.stats}>Following: {profileUser.following} | Followers: {profileUser.followers}</Text>
      {user && user.id !== profileUser.id && (
        <Button
          title={isFollowing ? 'Unfollow' : 'Follow'}
          color={isFollowing ? '#FF4500' : '#32CD32'}
          onPress={() => isFollowing ? unfollowUser(profileUser.id) : followUser(profileUser.id)}
        />
      )}
      <Button title="Message" color="#1E90FF" onPress={() => navigation.navigate('Chat', { username: profileUser.username })} />
      <FlatList
        data={profileUser.posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            {item.image && <Image source={{ uri: item.image }} style={styles.postMedia} />}
            {item.video && <Image source={{ uri: item.video }} style={styles.postMedia} />}
            <Text style={styles.postContent}>{item.content}</Text>
            <Text style={styles.postTags}>{item.tags.map(tag => `#${tag}`).join(' ')}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

// Chat Screen
const ChatScreen = ({ navigation, route }) => {
  const { messages, sendMessage, user } = useContext(AppContext);
  const [text, setText] = useState('');
  const toUser = route.params?.username || 'Alice';
  const userMessages = messages.filter(m => (m.from === user.username && m.to === toUser) || (m.from === toUser && m.to === user.username));

  return (
    <View style={[styles.container, { backgroundColor: '#B0E0E6' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <Text style={styles.title}>Chat with {toUser}</Text>
      <FlatList
        data={userMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, { alignSelf: item.from === user.username ? 'flex-end' : 'flex-start', backgroundColor: item.from === user.username ? '#1E90FF' : '#ADD8E6' }]}>
            <Text style={{ color: item.from === user.username ? '#FFF' : '#333' }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.chatInput}>
        <TextInput style={styles.input} placeholder="Type a message..." value={text} onChangeText={setText} />
        <Button title="Send" color="#FF4500" onPress={() => { sendMessage(toUser, text); setText(''); }} />
      </View>
    </View>
  );
};

// Notifications Screen
const NotificationsScreen = () => {
  const { notifications } = useContext(AppContext);

  return (
    <View style={[styles.container, { backgroundColor: '#FFDAB9' }]}>
      <Text style={styles.appName}>ConnectSphere</Text>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Navigation Setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Feed" component={FeedScreen} options={{ headerStyle: { backgroundColor: '#FF69B4' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerStyle: { backgroundColor: '#FF4500' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerStyle: { backgroundColor: '#32CD32' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ headerStyle: { backgroundColor: '#1E90FF' }, headerTintColor: '#FFF' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerStyle: { backgroundColor: '#FFD700' }, headerTintColor: '#FFF' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#FFF' },
  switchText: { color: '#FF69B4', marginTop: 10, textAlign: 'center' },
  post: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#DDD', backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postUser: { fontWeight: 'bold', color: '#FF69B4', fontSize: 16 },
  postMedia: { width: '100%', height: 200, borderRadius: 10, marginVertical: 10 },
  postContent: { color: '#555', marginBottom: 5 },
  postTags: { color: '#1E90FF', marginBottom: 5 },
  postLikes: { color: '#FF4500', marginVertical: 5 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
  commentInput: { flex: 1, height: 30, borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 5, borderRadius: 5, marginLeft: 10 },
  comment: { color: '#777', marginLeft: 10, marginTop: 5 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  bio: { color: '#555', marginBottom: 10, fontStyle: 'italic' },
  stats: { color: '#333', marginBottom: 15, fontWeight: 'bold' },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  chatInput: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  notification: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#DDD', backgroundColor: '#FFF', borderRadius: 5, marginBottom: 5 },
  notificationText: { color: '#333', fontSize: 16 },
  timestamp: { color: '#777', fontSize: 12, marginTop: 5 },
  mediaType: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#FFF', elevation: 5 },
});
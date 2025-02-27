import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>

      <TouchableOpacity
        style={styles.touchableButton} onPress={() => navigation.navigate('FirebaseSignup')}
      >
        <Text style={styles.touchableText}>Firebase SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.touchableButton1} onPress={() => navigation.navigate("FirebaseLogin")}
      >
        <Text style={styles.touchableText1}>Firebase Login</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  touchableButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  touchableText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchableButton1: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  touchableText1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
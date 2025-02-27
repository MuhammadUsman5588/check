import React, { useState } from "react";
import {
  View, Text, StyleSheet, Button, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Get screen width
const { width } = Dimensions.get("window");

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: "513366539683-e89o6fg0b310fb5hbkhsa8hms5lif7gv.apps.googleusercontent.com",
  offlineAccess: true,
});

const FirebaseSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const navigation = useNavigation();

  // ✅ Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Ensure fresh login

      const { idToken, user } = await GoogleSignin.signIn();
      if (!idToken) {
        throw new Error("Google Sign-In failed: Missing token");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      // ✅ Manually update Firebase user profile
      await auth().currentUser.updateProfile({
        displayName: user.name,
        photoURL: user.photo,
      });

      // ✅ Ensure the email is stored in Firebase Authentication
      console.log("Google User Registered:", userCredential.user);

      Alert.alert("Success", "You have signed in with Google!", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);
    } catch (error) {
      console.log("Google Sign-In Error:", error);
      setError(error.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Email & Password Signup
  const handleSignUp = async () => {
    if (!email || !password || !confirmpassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      Alert.alert("Success", "Your account has been created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);

      console.log("Email User Registered:", userCredential.user);

      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Sign Out
  const handleSignOut = async () => {
    try {
      const user = auth().currentUser;

      if (!user) {
        Alert.alert("No User", "No user is currently signed in.");
        return;
      }

      // Check if user signed in with Google
      const googleUser = await GoogleSignin.getCurrentUser();
      if (googleUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      await auth().signOut();

      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.replace("FirebaseLogin");
    } catch (error) {
      console.error("Sign-Out Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmpassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Signup Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign Up" onPress={handleSignUp} disabled={loading} />
      )}

      {/* Google Signup Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Ionicons name="logo-google" size={24} color="#fff" />
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  inputField: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 10,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: width * 0.9,
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: width * 0.9,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FirebaseSignup;
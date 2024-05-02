import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import firebase from "firebase/compat/app";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User signed up successfully!");
        navigation.navigate("Login");
      })
      .catch(error => {
        console.error("Error signing up:", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headingText}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          cursorColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          cursorColor="#000"
        />
        <TouchableOpacity onPress={handleSignup} style={styles.loginBtn}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 0.8,
    borderColor: "#BACD92",
    backgroundColor: "#FCFFE0",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headingText: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "800",
    color: "#a3d8ff",
    textTransform: "uppercase",
    marginBottom: 20,
    textShadowColor: "#a3d8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  loginBtn: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#A3D8FF",
    borderRadius: 6,
    marginBottom: 12,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});

export default SignupScreen;

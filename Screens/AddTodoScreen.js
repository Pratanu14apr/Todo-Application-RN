// AddTodoScreen.js

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
// import firebase from "firebase/app";
import { firebase } from "../config";
// import "@firebase/firestore";
// import "firebase/compat/firestore";

const AddTodoScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");

  const handleAddTodo = () => {
    firebase
      .firestore()
      .collection("todos")
      .add({
        title,
        completed: false,
      })
      .then(() => {
        console.log("Todo added successfully!");
        // Navigate back to the TodoList screen
        navigation.goBack();
      })
      .catch(error => {
        console.error("Error adding todo:", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Todo Title"
        onChangeText={setTitle}
        value={title}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default AddTodoScreen;

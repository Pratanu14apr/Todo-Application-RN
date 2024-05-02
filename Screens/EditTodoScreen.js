// EditTodoScreen.js

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
// import firebase from "firebase/app";
import { firebase } from "../config";

// import "@firebase/firestore";
// import "firebase/compat/firestore";

const EditTodoScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [title, setTitle] = useState("");

  const handleEditTodo = () => {
    firebase
      .firestore()
      .collection("todos")
      .doc(id)
      .update({ title })
      .then(() => {
        console.log("Todo edited successfully!");
        // Navigate back to the TodoList screen
        navigation.goBack();
      })
      .catch(error => {
        console.error("Error editing todo:", error.message);
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
      <Button title="Edit Todo" onPress={handleEditTodo} />
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

export default EditTodoScreen;

// TodoListScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
// import firebase from "firebase/app";
import { firebase } from "../config";

// import "@firebase/firestore";
// import "firebase/compat/firestore";
const TodoListScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch todos from Firestore
    const unsubscribe = firebase
      .firestore()
      .collection("todos")
      .onSnapshot(snapshot => {
        const updatedTodos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(updatedTodos);
      });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Logged out successfully!");
        // Navigate to the Login screen
        navigation.navigate("Login");
      })
      .catch(error => {
        console.error("Error logging out:", error.message);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text>{item.title}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditTodo", { id: item.id })}
      />
      <Button title="Delete" onPress={() => deleteTodo(item.id)} />
      <Button title="Complete" onPress={() => markAsComplete(item.id)} />
    </View>
  );

  const deleteTodo = id => {
    firebase
      .firestore()
      .collection("todos")
      .doc(id)
      .delete()
      .then(() => console.log("Todo deleted successfully!"))
      .catch(error => console.error("Error deleting todo:", error.message));
  };

  const markAsComplete = id => {
    firebase
      .firestore()
      .collection("todos")
      .doc(id)
      .update({ completed: true })
      .then(() => console.log("Todo marked as complete!"))
      .catch(error =>
        console.error("Error marking todo as complete:", error.message)
      );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Add Todo" onPress={() => navigation.navigate("AddTodo")} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default TodoListScreen;

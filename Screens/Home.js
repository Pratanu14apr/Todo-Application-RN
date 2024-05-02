import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const todoRef = firebase.firestore().collection("todos");
  const [addData, setAddData] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    todoRef.orderBy("createdAt", "desc").onSnapshot(querySnapshot => {
      const todos = [];
      querySnapshot.forEach(doc => {
        const { heading, completed } = doc.data();
        todos.push({
          id: doc.id,
          heading,
          completed,
        });
      });
      console.log("Fetched todos:", todos);
      setTodos(todos);
    });
  }, []);

  const deleteTodo = todos => {
    todoRef
      .doc(todos.id)
      .delete()
      .then(() => {
        alert("Delete Successfully");
      })
      .catch(error => {
        alert(error);
      });
  };

  const addTodo = () => {
    if (addData && addData.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      const data = {
        heading: addData,
        createdAt: timestamp,
        completed: false,
      };
      todoRef
        .add(data)
        .then(docRef => {
          setTodos(prevTodos => [
            ...prevTodos,
            {
              id: docRef.id,
              heading: addData,
              completed: false,
            },
          ]);
          setAddData("");
          Keyboard.dismiss();
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  const markTodoAsCompleted = todoId => {
    const todo = todos.find(item => item.id === todoId);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      todoRef
        .doc(todoId)
        .update({
          completed: !todo.completed,
        })
        .then(() => {
          console.log("Todo marked as completed successfully!");
          setTodos(prevTodos =>
            prevTodos.map(item => (item.id === todoId ? updatedTodo : item))
          );
        })
        .catch(error => {
          console.error("Error marking todo as completed:", error.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Add a New Todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={heading => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          cursorColor="#000"
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        numColumns={1}
        renderItem={({ item }) => {
          return (
            <View>
              <Pressable
                style={[
                  styles.outerContainer,
                  item.completed && styles.completedContainer,
                ]}
                onPress={() => navigation.navigate("Details", { item })}
              >
                <MaterialIcon
                  name="trash-can-outline"
                  color="red"
                  onPress={() => deleteTodo(item)}
                  style={styles.todoIcon}
                />

                <View style={styles.innerContainer}>
                  <Text
                    style={[
                      styles.itemHeading,
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                  </Text>
                </View>

                {/* {!item.completed && (
                  <TouchableOpacity
                    onPress={() => markTodoAsCompleted(item.id)}
                  >
                    <MaterialIcon
                      name="check"
                      color="purple"
                      size={24}
                      style={styles.completeIcon}
                    />
                  </TouchableOpacity>
                )} */}
                <TouchableOpacity onPress={() => markTodoAsCompleted(item.id)}>
                  {item.completed ? (
                    <MaterialIcon
                      name="checkbox-marked"
                      color="black"
                      size={24}
                      style={styles.completeIcon}
                    />
                  ) : (
                    <MaterialIcon
                      name="checkbox-blank-outline"
                      color="purple"
                      size={24}
                      style={styles.completeIcon}
                    />
                  )}
                </TouchableOpacity>
              </Pressable>
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingHorizontal: 16 },
  container: {
    flexDirection: "row",
    height: 80,
    marginTop: 100,
  },
  outerContainer: {
    backgroundColor: "#e5e5e5",
    padding: 16,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "column",
    marginLeft: 45,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 22,
  },
  input: {
    height: 48,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    paddingRight: 5,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 6,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  todoIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  completeIcon: {
    marginRight: 10,
  },
  completedContainer: {
    backgroundColor: "#A3D8FF",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#fff",
  },
});

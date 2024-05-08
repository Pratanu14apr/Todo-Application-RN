import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { firebase } from "../config";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [height, setHeight] = useState(48);

  const todoRef = firebase.firestore().collection("todos");
  const [addData, setAddData] = useState("");
  const navigation = useNavigation();

  const onContentSizeChange = event => {
    setHeight(event.nativeEvent.contentSize.height);
  };

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

  const deleteTodo = todo => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete the todo?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            todoRef
              .doc(todo.id)
              .delete()
              .then(() => {
                alert("Delete Successfully");
              })
              .catch(error => {
                alert(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
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
          alert("Todo is completed");
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
          style={[styles.input, { height }]}
          placeholder="Add a New Todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={heading => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          cursorColor="#000"
          multiline={true}
          numberOfLines={5}
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
            <View key={item.id}>
              <Pressable
                style={[
                  styles.outerContainer,
                  item.completed && styles.completedContainer,
                ]}
                onPress={() => navigation.navigate("Details", { item })}
              >
                <TouchableOpacity
                  onPress={() => markTodoAsCompleted(item.id)}
                  style={{ flex: 0.15 }}
                >
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

                <View style={styles.innerContainer}>
                  <Text
                    style={[
                      styles.itemHeading,
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item)}
                    style={{ marginLeft: "auto" }}
                  >
                    <MaterialIcon
                      name="trash-can-outline"
                      color="red"
                      style={styles.todoIcon}
                    />
                  </TouchableOpacity>
                </View>
              </Pressable>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    borderTopColor: "#e5e5e5",
    borderTopWidth: 0.8,
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    height: 80,
    marginTop: 20,
  },
  outerContainer: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 0.9,
  },
  input: {
    height: 48,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 5,
    flex: 1,
    marginRight: 5,
    borderColor: "#e5e5e5",
    borderWidth: 0.8,
    alignItems: "center",
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
    textTransform: "uppercase",
  },
  todoIcon: {
    fontSize: 20,
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

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../config";
import { useNavigation } from "@react-navigation/native";

const Details = ({ route }) => {
  const todoRef = firebase.firestore().collection("todos");

  const [textHeading, onChangeHeadingText] = useState(
    route.params.item.heading
  );
  const navigation = useNavigation();

  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading,
        })
        .then(() => {
          Alert.alert("Success", "Todo has been updated successfully", [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home"),
            },
          ]);
        })
        .catch(error => {
          alert(error.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.textField}
          onChangeText={onChangeHeadingText}
          value={textHeading}
          placeholder="Update Todo"
          cursorColor="#000"
          multiline={true}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.buttonUpdate}
          onPress={() => {
            updateTodo();
          }}
        >
          <Text style={{ fontWeight: 600 }}>UPDATE TODO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    padding: 10,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: "#0de065",
  },
});

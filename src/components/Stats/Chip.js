import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

export default function Chip({ message }) {
  return (
    <Text
      style={{
        borderRadius: "20%",
        marginTop: heightPercentageToDP("2%"),
        backgroundColor: "#d9d9d9",
        fontSize: "1%",
        textAlign: "center",
        fontWeight: "bold",
        padding: "10%",
      }}>
      {message}
    </Text>
  );
}

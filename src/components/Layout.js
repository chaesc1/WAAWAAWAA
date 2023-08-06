import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import isTablet from "../utils/validationSize";

function StatsPage({ children, setIsTabletScreen }) {
  useEffect(() => {
    const updateScreenSize = () => {
      setIsTabletScreen(isTablet());
    };

    Dimensions.addEventListener("change", updateScreenSize);

    return () => {
      Dimensions.removeEventListener("change", updateScreenSize);
    };
  }, []);

  return <View style={styles.container}>{children}</View>;
}

export default StatsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E99F",
    padding: wp("5%"),
  },
});

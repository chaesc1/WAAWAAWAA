import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Chip from "./Chip";

const Danger = () => {
  const renderViews = ({ count }) => {
    const views = [];

    for (let i = 0; i < count ?? 0; i++) {
      views.push(
        <View
          key={i}
          style={{
            width: "100%",
            height: heightPercentageToDP("4%"),
            backgroundColor: "#d9d9d9",
          }}></View>
      );
    }

    return views;
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#FDFBEC",
        padding: widthPercentageToDP("4%"),
      }}>
      <Text style={{ fontWeight: "bold", fontSize: widthPercentageToDP("8%") }}>
        Top 4
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            padding: widthPercentageToDP("5%"),
            justifyContent: "flex-end",
          }}>
          {renderViews({ count: 5 })}
          <Chip message="유치원" />
        </View>
        <View
          style={{
            flex: 1,
            padding: widthPercentageToDP("5%"),
            justifyContent: "flex-end",
          }}>
          {renderViews({ count: 5 })}
          <Chip message="사람" />
        </View>
        <View
          style={{
            flex: 1,
            padding: widthPercentageToDP("5%"),
            justifyContent: "flex-end",
          }}>
          {renderViews({ count: 5 })}
          <Chip message="초코파이" />
        </View>
        <View
          style={{
            flex: 1,
            padding: widthPercentageToDP("5%"),
            justifyContent: "flex-end",
          }}>
          {renderViews({ count: 10 })}
          <Chip message="민지" />
        </View>
      </View>
      <View style={{ marginTop: "10%", fontWeight: "700" }}>
        <Text>gpt 코멘트</Text>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            flex: 1,
            fontSize: "1%",
            fontWeight: "bold",
            padding: "5%",
            marginTop: "5%",
          }}>
          당신은 민지라는 사람으로부터 괴롭힘을 받고 있고, 초코파이를 뺏겨서
          분노스러운 상황에 처해 있습니다. 이에 대한 대처 방안을 함께 찾아보고자
          하셨습니다.
        </View>
      </View>
    </ScrollView>
  );
};

export default Danger;

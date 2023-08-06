import { Dimensions } from "react-native";

const isTablet = () => {
  const width = Dimensions.get("window").width;
  return width > 600;
};

export default isTablet;

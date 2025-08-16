import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: COLORS.background,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;

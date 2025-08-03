import { View, Text, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-react";
import React, { useState } from "react";

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!code)
      return Alert.alert("Error", "Please enter the verification code");
    if (!isLoaded) return;

    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert("Success", "Email verified successfully");
      } else {
        Alert.alert("Error", "Verification failed. Please try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2)); // Navigate back to the sign-up screen
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.erros?.[0]?.message || "Verification failed. Please try again."
      );
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>VerifyEmailScreen</Text>
    </View>
  );
};

export default VerifyEmail;

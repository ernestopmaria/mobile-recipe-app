import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSignUp } from "@clerk/clerk-react";
import React, { useState } from "react";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

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
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/i3.png")}
            style={authStyles.image}
            contentFit="contain"
          />
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We have sent a verification code to {email}. Please enter the code
            below to verify your email address.
          </Text>
          <View style={authStyles.formContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleVerification}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>← Back to Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;

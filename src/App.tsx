import { useEffect, useState, ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import StoreProvider from "./config/StoreProvider";
import { PermissionsScreen, CameraScreen, ResultsScreen } from "./screens";
import type { Routes } from "./types";

const Stack = createNativeStackNavigator<Routes>();

const Navigator = (): ReactElement | null => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  if (cameraPermission === null) {
    // still loading
    return null;
  }

  const showPermissionsScreen = cameraPermission !== "authorized";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          showPermissionsScreen ? "PermissionsScreen" : "CameraScreen"
        }
        screenOptions={{
          headerShown: false,
          statusBarStyle: "dark",
          animationTypeForReplace: "push"
        }}
      >
        <Stack.Screen component={PermissionsScreen} name="PermissionsScreen" />
        <Stack.Screen component={CameraScreen} name="CameraScreen" />
        <Stack.Screen component={ResultsScreen} name="ResultsScreen" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <StoreProvider>
    <Navigator />
  </StoreProvider>
);

export { App };
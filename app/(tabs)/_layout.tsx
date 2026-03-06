import { HapticTab } from '@/components/haptic-tab';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.85;
const TAB_BAR_LEFT = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2;

export default function TabLayout() {
  
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20 + insets.bottom,
          marginLeft: TAB_BAR_LEFT,
          width: TAB_BAR_WIDTH,
          backgroundColor: '#ffffff44',
          borderRadius: 29,
          height: 58,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="sound" size={24} color={color} />,
        }}
      />
        
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

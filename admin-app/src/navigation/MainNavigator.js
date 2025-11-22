import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, FolderKanban, Tags, Image, Settings } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AssetsScreen from '../screens/AssetsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#111827', // gray-900
                    borderTopColor: '#374151', // gray-700
                },
                tabBarActiveTintColor: '#3B82F6', // blue-500
                tabBarInactiveTintColor: '#9CA3AF', // gray-400
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Tags color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Assets"
                component={AssetsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Image color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;

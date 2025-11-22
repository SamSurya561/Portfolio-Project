import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const DashboardScreen = () => {
    const handleLogout = () => {
        signOut(auth).catch(error => console.error('Logout error:', error));
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-2xl font-bold text-white">Dashboard</Text>
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-semibold">Logout</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400 text-lg">Welcome to Admin Panel</Text>
            </View>
        </SafeAreaView>
    );
};

export default DashboardScreen;

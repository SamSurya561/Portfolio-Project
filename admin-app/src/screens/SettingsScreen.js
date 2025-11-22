import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const SettingsScreen = () => {
    const handleLogout = () => {
        signOut(auth).catch(error => console.error('Logout error:', error));
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <Text className="text-2xl font-bold text-white mb-8">Settings</Text>

            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-600 p-4 rounded-xl"
            >
                <Text className="text-white text-center font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SettingsScreen;

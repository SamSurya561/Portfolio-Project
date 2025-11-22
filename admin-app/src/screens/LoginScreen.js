import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigation will be handled by the auth state listener in App.js
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center p-4">
            <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 1000 }}
                className="w-full max-w-sm"
            >
                <Text className="text-4xl font-bold text-white text-center mb-8">
                    Admin Portal
                </Text>

                <View className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
                    <View>
                        <Text className="text-gray-400 mb-2">Email</Text>
                        <TextInput
                            className="bg-gray-700 text-white p-4 rounded-xl"
                            placeholder="admin@example.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mt-4">
                        <Text className="text-gray-400 mb-2">Password</Text>
                        <TextInput
                            className="bg-gray-700 text-white p-4 rounded-xl"
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 p-4 rounded-xl mt-6"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-semibold text-lg">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </MotiView>
        </SafeAreaView>
    );
};

export default LoginScreen;

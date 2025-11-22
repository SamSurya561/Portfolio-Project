import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AssetsScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <Text className="text-2xl font-bold text-white mb-4">Assets</Text>
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400">Asset Manager will go here</Text>
            </View>
        </SafeAreaView>
    );
};

export default AssetsScreen;

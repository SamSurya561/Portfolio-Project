import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Tags } from 'lucide-react-native';

const CategoryCard = ({ category, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gray-800 p-4 rounded-xl mb-3 flex-row items-center shadow-sm"
        >
            <View className="bg-blue-900/30 p-3 rounded-lg mr-4">
                <Tags color="#60A5FA" size={24} />
            </View>
            <View className="flex-1">
                <Text className="text-white text-lg font-semibold">{category.name}</Text>
                <Text className="text-gray-400 text-sm">{category.projectCount || 0} Projects</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CategoryCard;

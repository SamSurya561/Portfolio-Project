import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const ProjectCard = ({ project, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gray-800 rounded-xl overflow-hidden mb-4 shadow-sm"
        >
            <Image
                source={{ uri: project.image }}
                className="w-full h-48 bg-gray-700"
                resizeMode="cover"
            />
            <View className="p-4">
                <Text className="text-white text-xl font-bold mb-1">{project.title}</Text>
                <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
                    {project.description}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                    {project.technologies?.map((tech, index) => (
                        <View key={index} className="bg-gray-700 px-2 py-1 rounded-md">
                            <Text className="text-gray-300 text-xs">{tech}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProjectCard;

```
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus } from 'lucide-react-native';
import { db } from '../lib/firebase';
import ProjectCard from '../components/ProjectCard';

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Projects</Text>
        <TouchableOpacity 
          className="bg-blue-600 p-2 rounded-full"
          onPress={() => console.log('Add Project')}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProjectCard 
              project={item} 
              onPress={() => console.log('Edit Project', item.id)} 
            />
          )}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-10">No projects found</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProjectsScreen;
```

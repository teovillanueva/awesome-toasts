import React from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import tw from 'tailwind-rn';

import { useToasts } from '../hooks/toasts';

export const MainScreen: React.FC = () => {
  const { showToast } = useToasts();

  return (
    <View style={tw('bg-indigo-900 flex-1 justify-center items-center')}>
      <Text style={tw('text-white text-4xl font-bold mb-4')}>
        Awesome toasts!
      </Text>
      <TouchableOpacity
        onPress={() =>
          showToast({
            props: {
              title: 'Hey!',
              description: 'These toasts are really awesome!',
            },
            duration: 4000,
          })
        }
        style={tw('px-3 py-4 bg-indigo-500 rounded-md')}
      >
        <Text style={tw('text-white')}>Show me</Text>
      </TouchableOpacity>
    </View>
  );
};

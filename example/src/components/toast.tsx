import React from 'react';

import { Text, View } from 'react-native';

import tw from 'tailwind-rn';

type ToastProps = {
  title?: string;
  description: string;
};

export const Toast: React.FC<ToastProps> = ({ title, description }) => (
  <View style={tw('px-3 py-4 m-4 bg-indigo-500 rounded-md')}>
    <Text style={tw('font-bold text-white mb-1')}>{title}</Text>
    <Text style={tw('text-white')}>{description}</Text>
  </View>
);

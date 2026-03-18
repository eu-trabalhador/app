import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  editable: boolean;
  press?: (it: boolean) => void;
};

export const ButtonEdit = ({ editable, press }: Props) => {

  const [iconName, setIconName] = useState<'edit' | 'save'>('edit');

  useEffect(() => {
    setIconName(editable ? 'save' : 'edit');
  }, [editable]);

  const handleButton = () => {
    const newEditable = !editable;

    setIconName(newEditable ? 'save' : 'edit');

    if (press) {
      press(newEditable);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleButton}>
      <MaterialIcons name={iconName} size={40} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
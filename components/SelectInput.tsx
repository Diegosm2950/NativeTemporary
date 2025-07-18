import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ViewStyle,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { ChevronDown, Check, X } from 'lucide-react-native';

type SelectInputProps = {
  label?: string;
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
};

export default function SelectInput({
  label,
  value,
  onSelect,
  options,
  placeholder = 'Select an option',
  isRequired = false,
  error,
  containerStyle,
}: SelectInputProps) {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find(option => option === value);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    closeModal();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
          {label}
          {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={openModal}
      >
        <View style={[
          styles.selectContainer, 
          { backgroundColor: Colors[colorScheme].inputBackground },
        ]}>
          <Text 
            style={[
              styles.selectText, 
              { 
                color: selectedOption 
                  ? Colors[colorScheme].text 
                  : Colors[colorScheme].textSecondary 
              }
            ]}
          >
            {selectedOption ? selectedOption : placeholder}
          </Text>
          <ChevronDown size={20} color={Colors[colorScheme].textSecondary} />
        </View>
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          {error}
        </Text>
      )}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={[
              styles.modalContent, 
              { backgroundColor: Colors[colorScheme].cardBackground }
            ]}>
              <View style={styles.modalHeader}>
                <Text style={[
                  styles.modalTitle,
                  { color: Colors[colorScheme].text }
                ]}>
                  {label || 'Select an option'}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <X size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: Colors[colorScheme].text }
                    ]}>
                      {item}
                    </Text>
                    
                    {item === value && (
                      <Check size={20} color={Colors[colorScheme].tint} />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.optionsList}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.m,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: Layout.spacing.xs,
  },
  required: {
    color: Colors.light.error,
  },
  selectContainer: {
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: Layout.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: Layout.spacing.m,
    paddingBottom: Layout.spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingHorizontal: Layout.spacing.l,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});
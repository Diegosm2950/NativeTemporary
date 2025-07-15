import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface TeamSelectorProps {
  equipo: 'A' | 'B';
  setEquipo: (team: 'A' | 'B') => void;
  equipoLocalNombre?: string; 
  equipoVisitanteNombre?: string; 
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  equipo,
  setEquipo,
  equipoLocalNombre = 'Equipo A',  
  equipoVisitanteNombre = 'Equipo B',
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.teamSwitch}>
      <TouchableOpacity
        style={[
          styles.teamButton,
          { backgroundColor: Colors[colorScheme].cardBackground },
          equipo === 'A' && {
            backgroundColor: Colors[colorScheme].buttonSelected
          }
        ]}
        onPress={() => setEquipo('A')}
      >
        <Text style={[
          styles.teamText,
          { color: Colors[colorScheme].text },
          equipo === 'A' && {
            color: Colors[colorScheme].buttonText
          }
        ]}>
          {equipoLocalNombre}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.teamButton,
          { backgroundColor: Colors[colorScheme].cardBackground },
          equipo === 'B' && {
            backgroundColor: Colors[colorScheme].buttonSelected
          }
        ]}
        onPress={() => setEquipo('B')}
      >
        <Text style={[
          styles.teamText,
          { color: Colors[colorScheme].text },
          equipo === 'B' && {
            color: Colors[colorScheme].buttonText
          }
        ]}>
          {equipoVisitanteNombre}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  teamSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  teamText: {
    fontWeight: '500',
  },
});

export default TeamSelector;
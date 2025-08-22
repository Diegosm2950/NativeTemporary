import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import useColorScheme from "@/hooks/useColorScheme";
import { useCedula } from "@/context/CedulaContext";

const Stopwatch = () => {
  const { cronometro, setCronometro } = useCedula();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);
  const colorScheme = useColorScheme();
  
  const time = cronometro !== undefined ? cronometro : 0;
  
  const setTime = setCronometro || (() => {});

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000);
    const mins = Math.floor((milliseconds % 3600000) / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      interval = setInterval(() => {
        const now = Date.now();
        const newTime = now - (startTimeRef.current || 0);
        setTime(newTime);
      }, 1000); 
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time, setTime]);

  return (
    <View style={[styles.cronometroContainer, { backgroundColor: Colors[colorScheme].cardBackground }]}>
        <Text style={[styles.cronometroTiempo, { color: Colors[colorScheme].text }]}>{formatTime(time)}</Text>

        <View style={styles.cronoButtonGroup}>
            <TouchableOpacity 
              onPress={() => setIsRunning(!isRunning)} 
              style={[styles.cronoButton, { 
                backgroundColor: isRunning 
                  ? Colors[colorScheme].buttonSecondary 
                  : Colors[colorScheme].buttonPrimary 
              }]}
            >
                <Text style={[styles.cronoButtonText, { color: Colors[colorScheme].buttonText }]}>
                  {isRunning ? "Pausar" : "Iniciar"}
                </Text>
            </TouchableOpacity>

        </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  cronometroContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cronometroTiempo: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    fontVariant: ['tabular-nums'], 
  },
  cronoButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cronoButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  cronoButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
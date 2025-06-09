import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ page, totalPages, onNext, onPrevious }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious} disabled={page <= 1} style={styles.button}>
        <Text style={styles.text}>← Anterior</Text>
      </TouchableOpacity>
      <Text style={styles.pageText}>Página {page} de {totalPages}</Text>
      <TouchableOpacity onPress={onNext} disabled={page >= totalPages} style={styles.button}>
        <Text style={styles.text}>Siguiente →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 16,
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: "#53F29D",
  },
  pageText: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default PaginationControls;

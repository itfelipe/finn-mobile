import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

const mockCategories: { id: string; name: string }[] = [
  { id: "1", name: "Alimentação" },
  { id: "2", name: "Transporte" },
  { id: "3", name: "Educação" },
  { id: "4", name: "Lazer" },
  { id: "5", name: "Saúde" },
  { id: "6", name: "Outros" },
];

export default function NewTransactionScreen() {
  const [type, setType] = useState("entrada");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova transação</Text>

      <View style={styles.radioRow}>
        <Text style={styles.label}>Entrada</Text>
        <TouchableOpacity onPress={() => setType("entrada")}>
          <View
            style={[styles.radio, type === "entrada" && styles.selectedRadio]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.radioRow}>
        <Text style={styles.label}>Saída</Text>
        <TouchableOpacity onPress={() => setType("saida")}>
          <View
            style={[
              styles.radio,
              type === "saida" && styles.selectedRadio,
              !type && styles.unselectedRadio,
            ]}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Categoria</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: category ? "#000" : "#888" }}>
          {category ? category.name : "Selecione..."}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#007bff", marginTop: 12 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="R$"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedede",
    padding: 24,
    borderRadius: 24,
    margin: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
  },
  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  label: { fontSize: 18, marginRight: 10 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
    marginRight: 14,
    backgroundColor: "#fff",
  },
  selectedRadio: { backgroundColor: "#111" },
  unselectedRadio: { backgroundColor: "#fff", borderColor: "#999" },
  input: {
    backgroundColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  dropdown: {
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

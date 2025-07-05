import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateTransaction } from "../../hooks/useTransactionApi";
import { useCategories } from "../../hooks/useCategoryApi";
import { useNavigation } from "@react-navigation/native";

export default function NewTransactionScreen() {
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<{ id: string; name: string } | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useAuth();
  const token = user?.accessToken || null;
  const navigation = useNavigation();
  // Hooks
  const { createTransaction, loading, error } = useCreateTransaction(token);
  const {
    categories,
    loading: loadingCategories,
    fetchCategories,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!amount || !category) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    try {
      await createTransaction({
        title: category.name, // Você pode permitir customizar depois
        amount: parseFloat(amount.replace(",", ".")),
        type,
        categoryId: Number(category.id),
      });
      Alert.alert("Sucesso", "Transação adicionada com sucesso!");
      setAmount("");
      navigation.goBack();
      setCategory(null);
      setType("entrada");
    } catch (err: any) {
      Alert.alert("Erro", error || "Falha ao adicionar transação");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova transação</Text>

      {/* Entrada/Saída */}
      <View style={styles.radioRow}>
        <Text style={styles.label}>Entrada</Text>
        <TouchableOpacity onPress={() => setType("entrada")}>
          <View
            style={[styles.radio, type === "entrada" && styles.selectedRadio]}
          />
        </TouchableOpacity>
        <Text style={[styles.label, { marginLeft: 30 }]}>Saída</Text>
        <TouchableOpacity onPress={() => setType("saida")}>
          <View
            style={[styles.radio, type === "saida" && styles.selectedRadio]}
          />
        </TouchableOpacity>
      </View>

      {/* Categoria */}
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
            {loadingCategories ? (
              <ActivityIndicator size="large" color="#4caf50" />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => String(item.id)}
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
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#007bff", marginTop: 12 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Valor */}
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="R$"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: !amount || !category ? "#eee" : "#4caf50" },
        ]}
        onPress={handleAdd}
        disabled={loading || !amount || !category}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: !amount || !category ? "#aaa" : "#fff" }}>
            Adicionar
          </Text>
        )}
      </TouchableOpacity>
      {error ? (
        <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedede",
    padding: 24,
    borderRadius: 24,
    margin: 16,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    marginBottom: 18,
    gap: 10,
  },
  label: { fontSize: 18, marginRight: 10 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  selectedRadio: { backgroundColor: "#111" },
  input: {
    backgroundColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
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

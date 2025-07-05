import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import {
  useTransactions,
  useUpdateTransaction,
  useDeleteTransaction,
} from "../../hooks/useTransactionApi";
import dayjs from "dayjs";
import { useCategories } from "../../hooks/useCategoryApi";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const TransactionsScreen: React.FC = () => {
  const monthFlatListRef = useRef<FlatList>(null);

  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);

  const { user } = useAuth();
  const token = user?.accessToken || null;

  const {
    fetchTransactions,
    transactions,
    loading: loadingTransactions,
  } = useTransactions(token);

  const { updateTransaction, loading: loadingUpdate } =
    useUpdateTransaction(token);
  const { deleteTransaction, loading: loadingDelete } =
    useDeleteTransaction(token);
  const {
    fetchCategories,
    categories,
    loading: loadingCategories,
  } = useCategories(token);

  // Filtro de categoria
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  // Modal de edição
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"entrada" | "saida">("entrada");
  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Puxa as transações ao mudar o mês
  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]);

  // Busca categorias ao abrir tela
  useEffect(() => {
    fetchCategories();
  }, []);

  // Carrega categorias ao abrir modal de edição
  useEffect(() => {
    if (editModal) fetchCategories();
  }, [editModal]);

  // Scrolla para o mês atual ao abrir
  useEffect(() => {
    setTimeout(() => {
      monthFlatListRef.current?.scrollToIndex({
        index: currentMonthIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 200);
  }, []);

  // Filtra transações pelo mês selecionado
  const transactionsOfMonth = transactions.filter((t) => {
    const transactionMonth = dayjs(t.createdAt).month();
    console.log(transactionMonth);
    const matchesMonth = transactionMonth === months.indexOf(selectedMonth);
    return matchesMonth;
  });

  // Abrir modal de edição
  const handleEdit = (item: any) => {
    setEditData(item);
    setEditTitle(item.title);
    setEditAmount(String(item.amount));
    setEditType(item.type);
    setEditCategory(item.category || null);
    setEditModal(true);
  };

  // Salvar edição
  const handleSave = async () => {
    if (!editData) return;
    if (!editCategory) return Alert.alert("Selecione uma categoria!");
    try {
      await updateTransaction(editData.id, {
        title: editTitle,
        amount: Number(editAmount),
        type: editType,
        categoryId: editCategory.id,
      });
      setEditModal(false);
      fetchTransactions();
      Alert.alert("Sucesso", "Transação atualizada!");
    } catch {
      Alert.alert("Erro", "Falha ao editar transação.");
    }
  };

  // Deletar transação
  const handleDelete = () => {
    if (!editData) return;
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(editData.id);
              setEditModal(false);
              fetchTransactions();
              Alert.alert("Removido", "Transação excluída.");
            } catch {
              Alert.alert("Erro", "Falha ao excluir transação.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <Header month={selectedMonth} userName={user?.name || "Usuário"} />

        {/* Navegação dos meses */}
        <FlatList
          ref={monthFlatListRef}
          data={months}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthNav}
          contentContainerStyle={{ alignItems: "center" }}
          initialScrollIndex={currentMonthIndex}
          getItemLayout={(_, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
          renderItem={({ item: month }) => (
            <TouchableOpacity
              onPress={() => setSelectedMonth(month)}
              style={[
                styles.monthTab,
                selectedMonth === month && styles.selectedMonthTab,
              ]}
            >
              <Text
                style={[
                  styles.monthTabText,
                  selectedMonth === month && styles.selectedMonthTabText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Filtro de categorias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 12,
            gap: 8,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={[
              styles.categoryFilter,
              !selectedCategory && styles.selectedCategoryFilter,
            ]}
          >
            <Text
              style={{
                color: !selectedCategory ? "#fff" : "#222",
                fontWeight: !selectedCategory ? "bold" : "normal",
              }}
            >
              Todas
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryFilter,
                selectedCategory?.id === cat.id &&
                  styles.selectedCategoryFilter,
              ]}
            >
              <Text
                style={{
                  color: selectedCategory?.id === cat.id ? "#fff" : "#222",
                  fontWeight:
                    selectedCategory?.id === cat.id ? "bold" : "normal",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ fontSize: 20, padding: 12, paddingBottom: 0 }}>
          Transações
        </Text>

        <FlatList
          data={transactionsOfMonth}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshing={loadingTransactions}
          onRefresh={fetchTransactions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleEdit(item)}
            >
              <View>
                <Text style={styles.itemDate}>
                  {dayjs(item.createdAt).format("DD/MM HH:mm")}
                </Text>
                <Text style={styles.itemValue}>R${item.amount.toFixed(2)}</Text>
                <Text style={styles.itemDesc}>{item.title}</Text>
              </View>
              <View
                style={[
                  styles.typeTag,
                  item.type === "entrada" ? styles.entrada : styles.saida,
                ]}
              >
                <Text style={styles.typeTagText}>
                  {item.type === "entrada" ? "Entrada" : "Saída"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#999", padding: 18, textAlign: "center" }}>
              Nenhuma transação neste mês.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Modal de editar/deletar */}
        <Modal visible={editModal} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar transação</Text>
              <TextInput
                value={editAmount}
                onChangeText={setEditAmount}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Valor"
              />
              {/* Seleção de categoria */}
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text>
                  {editCategory ? editCategory.name : "Selecione a categoria"}
                </Text>
                <Text style={{ color: "#2196F3", fontWeight: "bold" }}>▼</Text>
              </TouchableOpacity>
              {/* Modal de categorias */}
              <Modal
                visible={showCategoryModal}
                transparent
                animationType="fade"
              >
                <View style={styles.modalBg}>
                  <View
                    style={[styles.modalContent, { width: "80%", padding: 10 }]}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Selecione a categoria
                    </Text>
                    {loadingCategories ? (
                      <ActivityIndicator />
                    ) : (
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              padding: 12,
                              borderBottomWidth: 1,
                              borderBottomColor: "#eee",
                            }}
                            onPress={() => {
                              setEditCategory(item);
                              setShowCategoryModal(false);
                            }}
                          >
                            <Text>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    <TouchableOpacity
                      onPress={() => setShowCategoryModal(false)}
                    >
                      <Text
                        style={{
                          color: "#2196F3",
                          marginTop: 12,
                          alignSelf: "center",
                        }}
                      >
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/* Tipo */}
              <View style={{ flexDirection: "row", marginBottom: 12, gap: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.radio,
                    editType === "entrada" && styles.selectedRadio,
                  ]}
                  onPress={() => setEditType("entrada")}
                >
                  <Text
                    style={{
                      color: editType === "entrada" ? "#fff" : "#222",
                      fontWeight: "bold",
                    }}
                  >
                    Entrada
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radio,
                    editType === "saida" && styles.selectedRadio,
                  ]}
                  onPress={() => setEditType("saida")}
                >
                  <Text
                    style={{
                      color: editType === "saida" ? "#fff" : "#222",
                      fontWeight: "bold",
                    }}
                  >
                    Saída
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#2196F3" }]}
                  onPress={handleSave}
                  disabled={loadingUpdate}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {loadingUpdate ? "Salvando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#f59e42" }]}
                  onPress={() => setEditModal(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ef4444" }]}
                  onPress={handleDelete}
                  disabled={loadingDelete}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {loadingDelete ? "Excluindo..." : "Excluir"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f2f2f2" },
  monthNav: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
    paddingVertical: 8,
  },
  monthTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  selectedMonthTab: {
    backgroundColor: "#2196F3",
  },
  monthTabText: {
    fontSize: 15,
    color: "#222",
  },
  selectedMonthTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: { padding: 12, height: "100%" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
  },
  itemDate: { fontSize: 13, color: "#666" },
  itemValue: { fontSize: 17, fontWeight: "600", marginTop: 2 },
  itemDesc: { fontSize: 13, color: "#444", marginTop: 2 },
  typeTag: {
    minWidth: 68,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: "center",
    marginLeft: 16,
  },
  entrada: { backgroundColor: "#22c55e" },
  saida: { backgroundColor: "#ef4444" },
  typeTagText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  // Filtro de categoria
  categoryFilter: {
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
  },
  selectedCategoryFilter: {
    backgroundColor: "#2196F3",
  },
  // Modal styles
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.30)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    width: 200,
    fontSize: 18,
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 6,
  },
  radio: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    backgroundColor: "#2196F3",
  },
});

export default TransactionsScreen;

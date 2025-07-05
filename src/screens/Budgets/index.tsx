import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import {
  useBudgets,
  useUpdateBudget,
  useDeleteBudget,
  useCreateBudget,
} from "../../hooks/useBudgetApi";
import { useCategories } from "../../hooks/useCategoryApi"; // supondo que você tenha esse hook
import { useFocusEffect } from "@react-navigation/native";

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

const BudgetsScreen: React.FC = () => {
  const { user } = useAuth();
  const token = user?.accessToken || null;
  const monthsListRef = useRef<FlatList>(null);

  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Novo budget
  const [createModal, setCreateModal] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState<any>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refreshBudgets = async () => {
    setRefreshing(true);
    const year = new Date().getFullYear();
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const monthString = `${year}-${monthIndex.toString().padStart(2, "0")}`;
    await fetchBudgets({ month: monthString });
    setRefreshing(false);
  };
  // Hooks
  const { fetchBudgets, budgets, loading: loadingBudgets } = useBudgets(token);
  const { updateBudget, loading: loadingUpdate } = useUpdateBudget(token);
  const { deleteBudget, loading: loadingDelete } = useDeleteBudget(token);
  const { createBudget, loading: loadingCreate } = useCreateBudget(token);
  const {
    fetchCategories,
    categories,
    loading: loadingCategories,
  } = useCategories(token);

  // Atualiza budgets ao trocar de mês
  useEffect(() => {
    const year = new Date().getFullYear();
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const monthString = `${year}-${monthIndex.toString().padStart(2, "0")}`;
    fetchBudgets({ month: monthString });
  }, [selectedMonth]);

  useFocusEffect(
    useCallback(() => {
      const year = new Date().getFullYear();
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const monthString = `${year}-${monthIndex.toString().padStart(2, "0")}`;
      fetchBudgets({ month: monthString });
    }, [])
  );
  // Busca categorias (só na primeira vez)
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  // Scrolla pro mês atual ao abrir
  useEffect(() => {
    const currentIndex = months.indexOf(selectedMonth);
    setTimeout(() => {
      monthsListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 350);
  }, []);

  // Para FlatList
  const getItemLayout = (_: any, index: number) => ({
    length: 90,
    offset: 90 * index,
    index,
  });

  // Modal edição
  const handleEdit = (budget: any) => {
    setSelectedBudget(budget);
    setEditAmount(String(budget.limit));
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedBudget) return;
    try {
      await updateBudget(selectedBudget.id, { limit: Number(editAmount) });
      setModalVisible(false);
      fetchBudgets();
      Alert.alert("Sucesso", "Orçamento atualizado!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao atualizar orçamento.");
    }
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;
    Alert.alert(
      "Excluir orçamento",
      "Tem certeza que deseja excluir este orçamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBudget(selectedBudget.id);
              setModalVisible(false);
              fetchBudgets();
              Alert.alert("Removido", "Orçamento excluído.");
            } catch {
              Alert.alert("Erro", "Falha ao excluir orçamento.");
            }
          },
        },
      ]
    );
  };

  // Modal de criação
  const handleCreate = async () => {
    if (!newBudgetCategory || !newBudgetAmount) {
      Alert.alert("Preencha todos os campos!");
      return;
    }
    try {
      const year = new Date().getFullYear();
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const monthString = `${year}-${monthIndex.toString().padStart(2, "0")}`;

      await createBudget({
        categoryId: newBudgetCategory.id,
        limit: Number(newBudgetAmount),
        month: monthString,
      });

      setCreateModal(false);
      setNewBudgetCategory(null);
      setNewBudgetAmount("");
      fetchBudgets({ month: monthString });
      Alert.alert("Sucesso", "Orçamento criado!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao criar orçamento.");
    }
  };

  const renderBudgetItem = ({ item }: { item: any }) => {
    const percentUsed =
      item.totalUsed && item.limit
        ? Math.min(100, Math.round((item.totalUsed / item.limit) * 100))
        : 0;
    return (
      <TouchableOpacity
        style={styles.budgetItem}
        onPress={() => handleEdit(item)}
      >
        <View>
          <Text style={styles.budgetCategory}>
            {item.category?.name || item.categoryName}
          </Text>
          <Text style={styles.budgetAmount}>
            Limite:{" "}
            <Text style={{ fontWeight: "bold" }}>
              R${item.limit.toFixed(2)}
            </Text>
          </Text>
          {item.totalUsed !== undefined && (
            <Text style={styles.budgetUsed}>
              Usado: R${item.totalUsed?.toFixed(2)} ({percentUsed}%)
            </Text>
          )}
        </View>
        <View
          style={[
            styles.budgetStatus,
            percentUsed >= 100
              ? styles.exceeded
              : percentUsed >= 80
              ? styles.warning
              : styles.normal,
          ]}
        >
          <Text style={styles.budgetStatusText}>
            {percentUsed >= 100 ? "Estourou" : `${percentUsed}% usado`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header month={selectedMonth} userName={user?.name || "Usuário"} />

      {/* Navegação de meses */}
      <FlatList
        ref={monthsListRef}
        data={months}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthNav}
        contentContainerStyle={{ alignItems: "center" }}
        getItemLayout={getItemLayout}
        initialScrollIndex={months.indexOf(selectedMonth)}
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

      {/* Botão de criar novo orçamento */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setCreateModal(true)}
      >
        <Text style={styles.createButtonText}>+ Novo orçamento</Text>
      </TouchableOpacity>

      {/* Lista de orçamentos */}
      {loadingBudgets ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderBudgetItem}
          refreshing={loadingBudgets}
          onRefresh={fetchBudgets}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
              Nenhum orçamento encontrado para este mês.
            </Text>
          }
        />
      )}

      {/* Modal de edição */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Editar orçamento
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 4 }}>
              Categoria:{" "}
              {selectedBudget?.category?.name || selectedBudget?.categoryName}
            </Text>
            <Text style={{ fontSize: 16 }}>Limite</Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholder="R$"
            />

            <View style={{ flexDirection: "row", marginTop: 16 }}>
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
                onPress={() => setModalVisible(false)}
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

      {/* Modal de criação */}
      <Modal visible={createModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Novo orçamento
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 4 }}>Categoria</Text>
            {loadingCategories ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={categoryList}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      newBudgetCategory?.id === item.id && {
                        backgroundColor: "#2196F3",
                      },
                    ]}
                    onPress={() => setNewBudgetCategory(item)}
                  >
                    <Text
                      style={{
                        color:
                          newBudgetCategory?.id === item.id ? "#fff" : "#222",
                        fontWeight:
                          newBudgetCategory?.id === item.id ? "bold" : "normal",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 12 }}
              />
            )}
            <Text style={{ fontSize: 16 }}>Limite</Text>
            <TextInput
              value={newBudgetAmount}
              onChangeText={setNewBudgetAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholder="R$"
            />
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#22c55e" }]}
                onPress={handleCreate}
                disabled={loadingCreate}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {loadingCreate ? "Criando..." : "Criar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f59e42" }]}
                onPress={() => setCreateModal(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f2f2f2" },
  monthNav: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
    paddingVertical: 0,
    height: 44,
  },
  monthTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
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
  list: { padding: 12 },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 14,
    marginBottom: 14,
    elevation: 1,
  },
  budgetCategory: {
    fontSize: 17,
    fontWeight: "600",
  },
  budgetAmount: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
  },
  budgetUsed: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  budgetStatus: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  budgetStatusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  exceeded: {
    backgroundColor: "#ef4444",
  },
  warning: {
    backgroundColor: "#f59e42",
  },
  normal: {
    backgroundColor: "#22c55e",
  },
  createButton: {
    backgroundColor: "#2196F3",
    margin: 14,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    width: 160,
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
  categoryOption: {
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
  },
});

export default BudgetsScreen;

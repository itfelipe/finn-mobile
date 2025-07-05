import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import Header from "../../components/Header";

type Budget = {
  id: string;
  category: string;
  amount: number;
  period: string; // pode ser o mês/ano: "07/2024"
  totalUsed?: number; // se quiser mostrar quanto já usou
};

const months = ["Maio", "Junho", "Julho", "Agosto", "Setembro"];

const BudgetsScreen: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("Junho");
  const [user, setUser] = useState({ name: "Felipe" });

  useEffect(() => {
    // Aqui você puxa os orçamentos filtrando pelo mês, se sua API aceitar filtro
    // Exemplo: axios.get(`/api/budgets?month=${selectedMonth}`)
    setBudgets([
      // Mock de exemplo:
      {
        id: "1",
        category: "Alimentação",
        amount: 600,
        period: "Junho",
        totalUsed: 410,
      },
      {
        id: "2",
        category: "Lazer",
        amount: 200,
        period: "Junho",
        totalUsed: 100,
      },
    ]);
  }, [selectedMonth]);

  // Para criar novo orçamento (pode abrir modal, navegar para tela, etc.)
  const handleAddBudget = () => {
    // Navegar para tela de adicionar, abrir modal, etc.
    // navigation.navigate('AddBudget');
    alert("Adicionar novo orçamento");
  };

  // Item do orçamento
  const renderBudgetItem = ({ item }: { item: Budget }) => {
    // Calcular percentual usado, evitar divisão por zero:
    const percentUsed =
      item.totalUsed && item.amount
        ? Math.min(100, Math.round((item.totalUsed / item.amount) * 100))
        : 0;
    return (
      <View style={styles.budgetItem}>
        <View>
          <Text style={styles.budgetCategory}>{item.category}</Text>
          <Text style={styles.budgetAmount}>
            Limite:{" "}
            <Text style={{ fontWeight: "bold" }}>
              R${item.amount.toFixed(2)}
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header month={selectedMonth} userName={user.name} />
      <FlatList
        data={months}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthNav}
        contentContainerStyle={{ alignItems: "center" }}
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

      {/* Botão de adicionar orçamento */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBudget}>
        <Text style={styles.addButtonText}>+ Novo Orçamento</Text>
      </TouchableOpacity>

      {/* Lista de orçamentos */}
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
            Nenhum orçamento encontrado para este mês.
          </Text>
        }
      />
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
  addButton: {
    backgroundColor: "#2196F3",
    margin: 14,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
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
});

export default BudgetsScreen;

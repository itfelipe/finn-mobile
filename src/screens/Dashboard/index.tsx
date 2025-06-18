import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockBudgets = [
  { id: "1", name: "Mercado", used: 320, limit: 500 },
  { id: "2", name: "Farmácia", used: 150, limit: 200 },
  { id: "3", name: "Transporte", used: 180, limit: 300 },
];

export default function Dashboard() {
  const totalIncome = 4500;
  const totalExpense = 2300;
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Felipe 👋</Text>
          <Text style={styles.subtitle}>Aqui está o seu resumo</Text>
        </View>
        <Ionicons name="person-circle-outline" size={48} color="#555" />
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Entradas</Text>
          <Text style={styles.income}>R$ {totalIncome}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Saídas</Text>
          <Text style={styles.expense}>R$ {totalExpense}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={styles.balance}>R$ {balance}</Text>
        </View>
      </View>

      {/* Orçamentos */}
      <View style={styles.budgetSection}>
        <Text style={styles.sectionTitle}>Orçamentos</Text>
        <FlatList
          data={mockBudgets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const percent = Math.min((item.used / item.limit) * 100, 100);
            return (
              <View style={styles.budgetItem}>
                <Text style={styles.budgetTitle}>{item.name}</Text>
                <Text style={styles.budgetUsage}>
                  R$ {item.used} / {item.limit}
                </Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[styles.progressBarFill, { width: `${percent}%` }]}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#666" },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  summaryBox: { alignItems: "center", flex: 1 },
  summaryLabel: { fontSize: 14, color: "#999" },
  income: { fontSize: 18, color: "green", fontWeight: "bold" },
  expense: { fontSize: 18, color: "red", fontWeight: "bold" },
  balance: { fontSize: 18, color: "#000", fontWeight: "bold" },

  budgetSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  budgetItem: { marginBottom: 16 },
  budgetTitle: { fontSize: 16 },
  budgetUsage: { fontSize: 14, color: "#666" },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginTop: 4,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: { color: "#fff", marginLeft: 8, fontWeight: "bold" },
});

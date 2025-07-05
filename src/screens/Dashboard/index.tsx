import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionsSummary } from "../../hooks/useTransactionApi";
import { useBudgets } from "../../hooks/useBudgetApi";
import { useTransactions } from "../../hooks/useTransactionApi"; // Adicione aqui
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const token = user?.accessToken || null;

  // Resumo de transações
  const {
    fetchSummary,
    summary,
    loading: loadingSummary,
  } = useTransactionsSummary(token);

  // Orçamentos
  const { fetchBudgets, budgets, loading: loadingBudgets } = useBudgets(token);

  // Últimas transações
  const {
    fetchTransactions,
    transactions,
    loading: loadingTransactions,
  } = useTransactions(token);

  useEffect(() => {
    fetchSummary();
    fetchBudgets();
    fetchTransactions();
  }, []);

  const totalIncome = summary?.entradas || 0;
  const totalExpense = summary?.saidas || 0;
  const balance = totalIncome - totalExpense;
  console.log(summary);

  // Pega as 10 últimas transações
  const last10Transactions = transactions.slice(0, 10);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.name?.split(" ")[0] || "Usuário"} 👋
            </Text>
            <Text style={styles.subtitle}>Aqui está o seu resumo</Text>
          </View>
          <Ionicons name="person-circle-outline" size={48} color="#555" />
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Entradas</Text>
            <Text style={styles.income}>
              {loadingSummary ? <ActivityIndicator /> : `R$ ${totalIncome}`}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Saídas</Text>
            <Text style={styles.expense}>
              {loadingSummary ? <ActivityIndicator /> : `R$ ${totalExpense}`}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={styles.balance}>
              {loadingSummary ? <ActivityIndicator /> : `R$ ${balance}`}
            </Text>
          </View>
        </View>

        {/* Orçamentos */}
        <View style={styles.budgetSection}>
          <Text style={styles.sectionTitle}>Orçamentos</Text>
          {loadingBudgets ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={budgets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const percent = Math.min(
                  (item.totalUsed / item.limit) * 100,
                  100
                );
                return (
                  <TouchableOpacity
                    style={styles.budgetItem}
                    onPress={() => console.log(item)}
                  >
                    <Text style={styles.budgetTitle}>{item.name}</Text>
                    <Text style={styles.budgetUsage}>
                      R$ {item.totalUsed} / {item.limit}
                    </Text>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${percent}%` },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={{ color: "#999" }}>
                  Nenhum orçamento cadastrado ainda.
                </Text>
              }
            />
          )}
        </View>

        {/* Últimas transações */}
        <View style={styles.lastTransactionsSection}>
          <Text style={styles.sectionTitle}>Últimas Transações</Text>
          {loadingTransactions ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={last10Transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.transactionItem}
                  onPress={() => console.log(item)}
                >
                  <Text style={styles.transactionDesc}>{item.title}</Text>
                  <Text
                    style={[
                      styles.transactionValue,
                      item.type === "entrada"
                        ? { color: "#22c55e" }
                        : { color: "#ef4444" },
                    ]}
                  >
                    {item.type === "entrada" ? "+" : "-"}R${item.amount}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#999" }}>
                  Nenhuma transação registrada ainda.
                </Text>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
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
  budgetSection: { marginBottom: 32 },
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
  lastTransactionsSection: {
    marginTop: 24,
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  transactionDesc: { fontSize: 15, color: "#222" },
  transactionValue: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

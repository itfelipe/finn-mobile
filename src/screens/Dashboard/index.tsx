import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, BarChart } from "react-native-chart-kit";
import {
  useTransactionsSummary,
  useTransactions,
} from "../../hooks/useTransactionApi";
import { useBudgets } from "../../hooks/useBudgetApi";
import { useAuth } from "../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

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

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
      fetchBudgets();
      fetchTransactions();
    }, [])
  );

  const totalIncome = summary?.entradas || 0;
  const totalExpense = summary?.saidas || 0;
  const balance = totalIncome - totalExpense;

  // PieChart: entradas x saídas
  const pieData = [
    {
      name: "Entradas",
      population: totalIncome,
      color: "#22c55e",
      legendFontColor: "#222",
      legendFontSize: 14,
    },
    {
      name: "Saídas",
      population: totalExpense,
      color: "#ef4444",
      legendFontColor: "#222",
      legendFontSize: 14,
    },
  ].filter((item) => item.population > 0);

  // BarChart: uso dos orçamentos (até 5 primeiros)
  const barData = {
    labels: budgets
      .slice(0, 5)
      .map((b) => b.category?.name || b.name || "Categoria"),
    datasets: [
      {
        data: budgets
          .slice(0, 5)
          .map((b) => Math.round((b.totalUsed / b.limit) * 100) || 0),
      },
    ],
  };

  // Últimas transações
  const lastTransactions = transactions.slice(0, 8);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
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

          {/* Cards de saldo */}
          <View style={styles.cardContainer}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Entradas</Text>
                <Text style={[styles.cardValue, { color: "#22c55e" }]}>
                  {loadingSummary ? (
                    <ActivityIndicator />
                  ) : (
                    `R$ ${totalIncome.toFixed(2)}`
                  )}
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Saídas</Text>
                <Text style={[styles.cardValue, { color: "#ef4444" }]}>
                  {loadingSummary ? (
                    <ActivityIndicator />
                  ) : (
                    `R$ ${totalExpense.toFixed(2)}`
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Saldo</Text>
              <Text style={[styles.cardValue, { color: "#111" }]}>
                {loadingSummary ? (
                  <ActivityIndicator />
                ) : (
                  `R$ ${balance.toFixed(2)}`
                )}
              </Text>
            </View>
          </View>

          {/* Gráfico de pizza */}
          <View style={styles.graphSection}>
            <Text style={styles.sectionTitle}>
              Distribuição Entradas/Saídas
            </Text>
            {loadingSummary ? (
              <ActivityIndicator />
            ) : pieData.length > 0 ? (
              <PieChart
                data={pieData}
                width={width - 40}
                height={160}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                  labelColor: () => "#444",
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"20"}
                absolute
              />
            ) : (
              <Text style={{ color: "#999", textAlign: "center" }}>
                Nenhum dado para exibir.
              </Text>
            )}
          </View>

          {/* Gráfico de barras de orçamentos */}
          <View style={styles.graphSection}>
            <Text style={styles.sectionTitle}>Uso dos Orçamentos</Text>
            {loadingBudgets ? (
              <ActivityIndicator />
            ) : barData.labels.length === 0 ? (
              <Text style={{ color: "#999" }}>
                Nenhum orçamento cadastrado.
              </Text>
            ) : (
              <BarChart
                data={barData}
                width={width - 40}
                height={150}
                yAxisSuffix="%"
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(60,60,60,${opacity})`,
                  propsForBackgroundLines: { stroke: "#eee" },
                }}
                fromZero
                showValuesOnTopOfBars
                style={{ borderRadius: 10 }}
              />
            )}
            <View style={{ marginTop: 10 }}>
              {budgets.slice(0, 5).map((d, idx) => (
                <View key={idx} style={styles.barLegendRow}>
                  <Text style={{ flex: 1 }}>
                    {d.category?.name || d.name || "Categoria"}
                  </Text>
                  <Text style={{ color: "#555" }}>
                    {d.totalUsed?.toFixed(0)}/{d.limit?.toFixed(0)} (
                    {Math.round((d.totalUsed / d.limit) * 100) || 0}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Últimas transações */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.sectionTitle}>Últimas Transações</Text>
            {loadingTransactions ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={lastTransactions}
                keyExtractor={(item, idx) => item.id?.toString() ?? String(idx)}
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
                      {item.type === "entrada" ? "+" : "-"}R$
                      {item.amount.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ color: "#999" }}>
                    Nenhuma transação registrada ainda.
                  </Text>
                }
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#666" },
  cardContainer: {
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardLabel: { fontSize: 14, color: "#888" },
  cardValue: { fontSize: 19, fontWeight: "bold", marginTop: 2 },
  graphSection: {
    marginVertical: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  barLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    marginBottom: 1,
    gap: 6,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  transactionDesc: { fontSize: 15, color: "#222", flex: 1 },
  transactionValue: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

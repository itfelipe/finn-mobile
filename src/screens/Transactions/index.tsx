import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import Header from "../../components/Header";

type Transaction = {
  id: string;
  date: string;
  value: number;
  description: string;
  type: "entrada" | "saida";
};

const months = ["Maio", "Junho", "Julho", "Agosto", "Setembro"];

const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("Junho");
  const [user, setUser] = useState({ name: "Luis" }); // Pega do contexto/auth depois

  useEffect(() => {
    // Exemplo: buscar as transações do mês selecionado
    // Ajuste a chamada conforme sua API espera o filtro de mês!
    // axios.get('/api/transactions?month=06').then...
    setTransactions([
      // Mock de exemplo:
      {
        id: "1",
        date: "14/05 16:53",
        value: 234.45,
        description: "Compras na americanas",
        type: "saida",
      },
      {
        id: "2",
        date: "14/05 16:53",
        value: 1200,
        description: "Pagamento freelancer",
        type: "entrada",
      },
      // Repita conforme necessário
    ]);
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <Header month="Julho" userName="Felipe" />
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

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemDate}>{item.date}</Text>
              <Text style={styles.itemValue}>R${item.value.toFixed(2)}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
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
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f2f2f2" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#bbb",
  },
  username: {
    fontWeight: "600",
    fontSize: 18,
    marginHorizontal: 10,
  },
  monthSelector: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "500",
  },
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
  itemDate: {
    fontSize: 13,
    color: "#666",
  },
  itemValue: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 2,
  },
  itemDesc: {
    fontSize: 13,
    color: "#444",
    marginTop: 2,
  },
  typeTag: {
    minWidth: 68,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: "center",
    marginLeft: 16,
  },
  entrada: {
    backgroundColor: "#22c55e",
  },
  saida: {
    backgroundColor: "#ef4444",
  },
  typeTagText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default TransactionsScreen;

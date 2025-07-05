import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButtonHeader from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";

const BirthDateScreen: React.FC<{ onContinue?: (date: Date) => void }> = ({
  onContinue,
}) => {
  const [date, setDate] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const navigation = useNavigation();

  const handleContinue = () => {
    if (onContinue) onContinue(date);
    navigation.navigate("GoalsScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <BackButtonHeader />
      <View style={styles.container}>
        <View style={{ marginTop: 32, width: "100%" }}>
          <View style={styles.row}>
            <Text style={styles.title}>Qual a sua data de nascimento?</Text>
            <TouchableOpacity>
              <Text style={styles.info}>?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{ marginTop: 24 }}
          >
            <View style={styles.labelRow}>
              <Text style={styles.dueLabel}>Due Date</Text>
              <Text style={styles.dateValue}>
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </TouchableOpacity>

          {(showPicker || Platform.OS === "ios") && (
            <DateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              value={date}
              maximumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              style={styles.picker}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  logoText: {
    marginTop: 10,
    fontSize: 18,
    color: "#222",
    alignSelf: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    color: "#111",
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginLeft: 6,
    backgroundColor: "#eee",
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  dueLabel: {
    color: "#888",
    fontSize: 14,
  },
  dateValue: {
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "500",
  },
  picker: {
    alignSelf: "center",
    width: 280,
    marginTop: 0,
  },
  button: {
    width: 260,
    height: 48,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});

export default BirthDateScreen;

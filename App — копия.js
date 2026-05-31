import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";

// Импорт нашей базы данных элементов из папки assets
import DATA_ELEMENTS from "./assets/elements.json";

const CATEGORIES = [
  "Все",
  "Неметаллы",
  "Инертные газы",
  "Щелочные металлы",
  "Щелочноземельные",
  "Полуметаллы",
  "Галогены",
];

const QUIZ_QUESTIONS = [
  {
    question: "Какой элемент является самым легким?",
    options: ["Гелий", "Водород", "Литий", "Кислород"],
    answer: "Водород",
  },
  {
    question: "Химический символ лития — это...",
    options: ["Le", "Lt", "Li", "L"],
    answer: "Li",
  },
  {
    question: "Какой газ составляет 78% атмосферы Земли?",
    options: ["Кислород", "Азот", "Неон", "Углерод"],
    answer: "Азот",
  },
  {
    question: "Что является основой алмаза и графита?",
    options: ["Бор", "Магний", "Углерод", "Бериллий"],
    answer: "Углерод",
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [activeElement, setActiveElement] = useState(null);

  // Состояния для викторины
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Логика фильтрации и поиска
  const filteredElements = DATA_ELEMENTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Все" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAnswer = (selectedOption) => {
    const isCorrect =
      selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer;
    let nextScore = score;

    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
    }

    if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizFinished(true);
      if (nextScore > highScore) {
        setHighScore(nextScore);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Навигационные вкладки */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === "table" && styles.activeTabButton,
          ]}
          onPress={() => setCurrentTab("table")}
        >
          <Text style={styles.tabText}>Таблица элементов</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === "quiz" && styles.activeTabButton,
          ]}
          onPress={() => setCurrentTab("quiz")}
        >
          <Text style={styles.tabText}>Викторина</Text>
        </TouchableOpacity>
      </View>

      {/* Модуль таблицы */}
      {currentTab === "table" && (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по названию или символу..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={{ height: 45, marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catButton,
                    selectedCategory === cat && styles.activeCatButton,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={styles.catButtonText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredElements}
            keyExtractor={(item) => item.number.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setActiveElement(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.elementNumber}>{item.number}</Text>
                  <Text style={styles.elementMass}>{item.mass}</Text>
                </View>
                <Text style={styles.elementSymbol}>{item.symbol}</Text>
                <Text style={styles.elementName}>{item.name}</Text>
                <Text style={styles.elementCategory}>{item.category}</Text>
              </TouchableOpacity>
            )}
          />

          {activeElement && (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>
                  {activeElement.name} ({activeElement.symbol})
                </Text>
                <TouchableOpacity onPress={() => setActiveElement(null)}>
                  <Text style={styles.closeButton}>✕ Закрыть</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.previewText}>
                <Text style={{ fontWeight: "bold" }}>Атомный номер:</Text>{" "}
                {activeElement.number}
              </Text>
              <Text style={styles.previewText}>
                <Text style={{ fontWeight: "bold" }}>Масса:</Text>{" "}
                {activeElement.mass} а.е.м.
              </Text>
              <Text style={styles.previewText}>
                <Text style={{ fontWeight: "bold" }}>Группа:</Text>{" "}
                {activeElement.category}
              </Text>
              <Text style={styles.previewDescription}>
                {activeElement.info}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Модуль викторины */}
      {currentTab === "quiz" && (
        <View style={styles.quizContainer}>
          <Text style={styles.highScoreText}>
            ⭐ Текущий рекорд: {highScore} очков
          </Text>

          {!quizFinished ? (
            <View style={{ width: "100%" }}>
              <Text style={styles.quizProgress}>
                Вопрос {currentQuestionIdx + 1} из {QUIZ_QUESTIONS.length}
              </Text>
              <Text style={styles.quizQuestion}>
                {QUIZ_QUESTIONS[currentQuestionIdx].question}
              </Text>

              {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(opt)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.finishedText}>Тест завершен!</Text>
              <Text style={styles.scoreText}>
                Результат: {score} из {QUIZ_QUESTIONS.length}
              </Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={restartQuiz}
              >
                <Text style={styles.restartButtonText}>Пройти заново</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: 15,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: { backgroundColor: "#00adb5" },
  tabText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  searchInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  catButton: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height: 35,
  },
  activeCatButton: { backgroundColor: "#00adb5" },
  catButtonText: { color: "#fff", fontSize: 13 },
  card: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  elementNumber: { color: "#888", fontSize: 11 },
  elementMass: { color: "#888", fontSize: 11 },
  elementSymbol: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 2,
  },
  elementName: { color: "#fff", fontSize: 14, fontWeight: "500" },
  elementCategory: { color: "#00adb5", fontSize: 11, marginTop: 4 },
  previewContainer: {
    backgroundColor: "#1e1e1e",
    borderTopWidth: 3,
    borderTopColor: "#00adb5",
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    left: -10,
    right: -10,
    zIndex: 999,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  previewTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  closeButton: { color: "#ff5a5f", fontWeight: "bold" },
  previewText: { color: "#ccc", fontSize: 14, marginBottom: 3 },
  previewDescription: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
    backgroundColor: "#252525",
    padding: 10,
    borderRadius: 6,
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  highScoreText: {
    color: "#ffd700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
  },
  quizProgress: { color: "#888", fontSize: 14, marginBottom: 5 },
  quizQuestion: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  optionButton: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  optionText: { color: "#fff", fontSize: 16, textAlign: "center" },
  finishedText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreText: { color: "#00adb5", fontSize: 18, marginBottom: 20 },
  restartButton: {
    backgroundColor: "#00adb5",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restartButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

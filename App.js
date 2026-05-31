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

// Импорт нашей офлайн базы данных элементов (36 элементов)
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

// БАЗА ДАННЫХ ВОПРОСОВ ПО УРОВНЯМ СЛОЖНОСТИ
const QUIZ_DATA = {
  easy: [
    {
      question: "Какой химический символ у Лития?",
      options: ["Le", "Li", "Lt", "L"],
      answer: "Li",
    },
    {
      question: 'Какому элементу принадлежит символ "He"?',
      options: ["Водород", "Азот", "Гелий", "Неон"],
      answer: "Гелий",
    },
    {
      question: 'Символ "O" — это...',
      options: ["Олово", "Кислород", "Углерод", "Фтор"],
      answer: "Кислород",
    },
  ],
  medium: [
    {
      question: "Какой элемент имеет атомную массу примерно 1.008 а.е.м.?",
      options: ["Гелий", "Литий", "Водород", "Бор"],
      answer: "Водород",
    },
    {
      question: "Какой газ составляет около 78% атмосферы Земли?",
      options: ["Кислород", "Азот", "Неон", "Углерод"],
      answer: "Азот",
    },
    {
      question: "Какая из этих групп элементов является основой аккумуляторов?",
      options: ["Галогены", "Инертные газы", "Щелочные металлы", "Полуметаллы"],
      answer: "Щелочные металлы",
    },
  ],
  hard: [
    {
      question: "Что произойдет при горении Магния на воздухе?",
      options: [
        "Выделение фиолетового газа",
        "Ослепительная белая вспышка",
        "Образование жидкого осадка",
        "Реакция не идет",
      ],
      answer: "Ослепительная белая вспышка",
    },
    {
      question: "Какова аллотропная модификация Углерода?",
      options: [
        "Гранит и мрамор",
        "Алмаз и графит",
        "Кварц и слюда",
        "Белый и красный фосфор",
      ],
      answer: "Алмаз и графит",
    },
  ],
};

// БАЗА ВСЕХ ВОЗМОЖНЫХ РЕЦЕПТОВ ДЛЯ ЛАБОРАТОРИИ (12 СОЕДИНЕНИЙ)
const LAB_RECIPES = [
  {
    id: "H2O",
    h: 2,
    o: 1,
    c: 0,
    n: 0,
    formula: "H₂O",
    name: "Вода",
    desc: "Важнейшее вещество на Земле, универсальный растворитель.",
  },
  {
    id: "H2O2",
    h: 2,
    o: 2,
    c: 0,
    n: 0,
    formula: "H₂O₂",
    name: "Перекись водорода",
    desc: "Сильный окислитель, используется как антисептик.",
  },
  {
    id: "CO2",
    h: 0,
    o: 2,
    c: 1,
    n: 0,
    formula: "CO₂",
    name: "Углекислый газ",
    desc: "Продукт дыхания и горения, необходим растениям.",
  },
  {
    id: "CO",
    h: 0,
    o: 1,
    c: 1,
    n: 0,
    formula: "CO",
    name: "Угарный газ",
    desc: "Токсичный газ без цвета и запаха, опасен при неполном сгорании.",
  },
  {
    id: "CH4",
    h: 4,
    o: 0,
    c: 1,
    n: 0,
    formula: "CH₄",
    name: "Метан",
    desc: "Простейший углеводород, основа природного газа.",
  },
  {
    id: "NH3",
    h: 3,
    o: 0,
    c: 0,
    n: 1,
    formula: "NH₃",
    name: "Аммиак",
    desc: "Газ с резким запахом, сырье для удобрений.",
  },
  {
    id: "N2O",
    h: 0,
    o: 1,
    c: 0,
    n: 2,
    formula: "N₂O",
    name: "Закись азота",
    desc: "Знаменитый «веселящий газ», используется в медицине для наркоза.",
  },
  {
    id: "NO2",
    h: 0,
    o: 2,
    c: 0,
    n: 1,
    formula: "NO₂",
    name: "Диоксид азота",
    desc: "Бурый ядовитый газ («лисий хвост»), загрязнитель атмосферы.",
  },
  {
    id: "HNO3",
    h: 1,
    o: 3,
    c: 0,
    n: 1,
    formula: "HNO₃",
    name: "Азотная кислота",
    desc: "Сильная коррозионная кислота, применяется в производстве взрывчатки.",
  },
  {
    id: "H2CO3",
    h: 2,
    o: 3,
    c: 1,
    n: 0,
    formula: "H₂CO₃",
    name: "Угольная кислота",
    desc: "Неустойчивая кислота, образуется при растворении CO₂ в воде (в газировках).",
  },
  {
    id: "C2H2",
    h: 2,
    o: 0,
    c: 2,
    n: 0,
    formula: "C₂H₂",
    name: "Ацетилен",
    desc: "Горючий газ, используется для высокотемпературной сварки и резки металлов.",
  },
  {
    id: "CH4O",
    h: 4,
    o: 1,
    c: 1,
    n: 0,
    formula: "CH₃OH",
    name: "Метанол",
    desc: "Простейший одноатомный спирт. Сильнейший яд!",
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState("table");

  // СОСТОЯНИЯ ДЛЯ ТАБЛИЦЫ
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [activeElement, setActiveElement] = useState(null);

  // СОСТОЯНИЯ ДЛЯ ВИКТОРИНЫ
  const [quizDifficulty, setQuizDifficulty] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // СОСТОЯНИЯ ДЛЯ ЛАБОРАТОРИИ
  const [labH, setLabH] = useState(0);
  const [labO, setLabO] = useState(0);
  const [labC, setLabC] = useState(0);
  const [labN, setLabN] = useState(0);

  // Список ID угаданных формул
  const [discoveredMolecules, setDiscoveredMolecules] = useState([]);

  // Фильтрация элементов в таблице
  const filteredElements = DATA_ELEMENTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Все" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Логика викторины
  const handleAnswer = (selectedOption) => {
    const questions = QUIZ_DATA[quizDifficulty];
    const isCorrect = selectedOption === questions[currentQuestionIdx].answer;
    let nextScore = score;

    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
    }

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setQuizFinished(false);
    setQuizDifficulty(null);
  };

  // ЛОГИКА ПРОВЕРКИ РЕЦЕПТОВ
  const checkSynthesis = () => {
    const match = LAB_RECIPES.find(
      (r) => r.h === labH && r.o === labO && r.c === labC && r.n === labN,
    );

    if (match) {
      // Если нашли формулу и её еще нет в списке угаданных — добавляем
      if (!discoveredMolecules.includes(match.id)) {
        setDiscoveredMolecules([...discoveredMolecules, match.id]);
      }
      return {
        formula: match.formula,
        name: match.name,
        description: match.desc,
        isCorrect: true,
      };
    }

    // Генерация дефолтной формулы, если собрали что-то не то
    if (labH > 0 || labO > 0 || labC > 0 || labN > 0) {
      let f = "";
      if (labC > 0) f += `C${labC > 1 ? labC : ""}`;
      if (labH > 0) f += `H${labH > 1 ? labH : ""}`;
      if (labN > 0) f += `N${labN > 1 ? labN : ""}`;
      if (labO > 0) f += `O${labO > 1 ? labO : ""}`;
      return {
        formula: f,
        name: "Нестабильное состояние",
        description:
          "Такое соотношение атомов не образует устойчивого вещества.",
        isCorrect: false,
      };
    }
    return null;
  };

  const currentResult = checkSynthesis();
  const isAllDiscovered = discoveredMolecules.length === LAB_RECIPES.length;

  const clearLab = () => {
    setLabH(0);
    setLabO(0);
    setLabC(0);
    setLabN(0);
  };

  const resetAllProgress = () => {
    clearLab();
    setDiscoveredMolecules([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* НАВИГАЦИЯ */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === "table" && styles.activeTabButton,
          ]}
          onPress={() => setCurrentTab("table")}
        >
          <Text style={styles.tabText}>Таблица</Text>
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
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === "lab" && styles.activeTabButton,
          ]}
          onPress={() => setCurrentTab("lab")}
        >
          <Text style={styles.tabText}>Лаборатория</Text>
        </TouchableOpacity>
      </View>

      {/* 1. ТАБЛИЦА */}
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
                <Text style={{ fontWeight: "bold" }}>Номер:</Text>{" "}
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

      {/* 2. ВИКТОРИНА */}
      {currentTab === "quiz" && (
        <View style={styles.centerContainer}>
          {quizDifficulty === null && (
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.mainTitle}>Выберите уровень сложности</Text>
              <TouchableOpacity
                style={[styles.diffButton, { backgroundColor: "#2e7d32" }]}
                onPress={() => setQuizDifficulty("easy")}
              >
                <Text style={styles.diffButtonText}>🟢 Легкий</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.diffButton, { backgroundColor: "#ef6c00" }]}
                onPress={() => setQuizDifficulty("medium")}
              >
                <Text style={styles.diffButtonText}>🟠 Средний</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.diffButton, { backgroundColor: "#c62828" }]}
                onPress={() => setQuizDifficulty("hard")}
              >
                <Text style={styles.diffButtonText}>🔴 Хардкор</Text>
              </TouchableOpacity>
            </View>
          )}
          {quizDifficulty !== null && !quizFinished && (
            <View style={{ width: "100%" }}>
              <Text style={styles.quizProgress}>
                Сложность: {quizDifficulty.toUpperCase()} | Вопрос{" "}
                {currentQuestionIdx + 1} из {QUIZ_DATA[quizDifficulty].length}
              </Text>
              <Text style={styles.quizQuestion}>
                {QUIZ_DATA[quizDifficulty][currentQuestionIdx].question}
              </Text>
              {QUIZ_DATA[quizDifficulty][currentQuestionIdx].options.map(
                (opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.optionButton}
                    onPress={() => handleAnswer(opt)}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}
          {quizFinished && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.finishedText}>Уровень пройден!</Text>
              <Text style={styles.scoreText}>
                Ваш результат: {score} из {QUIZ_DATA[quizDifficulty].length}
              </Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={restartQuiz}
              >
                <Text style={styles.restartButtonText}>В меню сложности</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* 3. ОФИГЕННАЯ ЛАБОРАТОРИЯ С ДОСТИЖЕНИЯМИ */}
      {currentTab === "lab" && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ flex: 1 }}
        >
          {/* УВЕДОМЛЕНИЕ ДЛЯ НАСТОЯЩЕГО ДОДЯНА */}
          {isAllDiscovered && (
            <View style={styles.easterEggAlert}>
              <Text style={styles.easterEggEmoji}>🏆👑🎉</Text>
              <Text style={styles.easterEggTitle}>Поздравляем!</Text>
              <Text style={styles.easterEggText}>
                Вы открыли абсолютно все скрытые молекулы. Вы настоящий додян
                химических наук!
              </Text>
              <TouchableOpacity
                style={styles.resetAllBtn}
                onPress={resetAllProgress}
              >
                <Text style={styles.resetAllBtnText}>
                  Сбросить прогресс игры
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.labMainTitle}>Синтез химических формул</Text>
          <Text style={styles.labCounterTitle}>
            Открыто соединений:{" "}
            <Text style={{ color: "#ffd700", fontWeight: "bold" }}>
              {discoveredMolecules.length} из {LAB_RECIPES.length}
            </Text>
          </Text>

          {/* Сетка атомов */}
          <View style={styles.atomsGrid}>
            <View style={styles.atomsRow}>
              <TouchableOpacity
                style={[styles.atomCircle, { backgroundColor: "#00adb5" }]}
                onPress={() => setLabH(labH + 1)}
              >
                <Text style={styles.atomCircleText}>H</Text>
                <Text style={styles.atomCircleSub}>Водород</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.atomCircle, { backgroundColor: "#ff5a5f" }]}
                onPress={() => setLabO(labO + 1)}
              >
                <Text style={styles.atomCircleText}>O</Text>
                <Text style={styles.atomCircleSub}>Кислород</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.atomsRow}>
              <TouchableOpacity
                style={[styles.atomCircle, { backgroundColor: "#4e342e" }]}
                onPress={() => setLabC(labC + 1)}
              >
                <Text style={styles.atomCircleText}>C</Text>
                <Text style={styles.atomCircleSub}>Углерод</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.atomCircle, { backgroundColor: "#1565c0" }]}
                onPress={() => setLabN(labN + 1)}
              >
                <Text style={styles.atomCircleText}>N</Text>
                <Text style={styles.atomCircleSub}>Азот</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Колба */}
          <View style={styles.beakerContainer}>
            <Text style={styles.beakerTitle}>
              Содержимое реакционной колбы:
            </Text>
            <View style={styles.beakerStatsRow}>
              <Text style={styles.beakerText}>
                H:{" "}
                <Text style={{ fontWeight: "bold", color: "#00adb5" }}>
                  {labH}
                </Text>
              </Text>
              <Text style={styles.beakerText}>
                O:{" "}
                <Text style={{ fontWeight: "bold", color: "#ff5a5f" }}>
                  {labO}
                </Text>
              </Text>
              <Text style={styles.beakerText}>
                C:{" "}
                <Text style={{ fontWeight: "bold", color: "#a1887f" }}>
                  {labC}
                </Text>
              </Text>
              <Text style={styles.beakerText}>
                N:{" "}
                <Text style={{ fontWeight: "bold", color: "#64b5f6" }}>
                  {labN}
                </Text>
              </Text>
            </View>
          </View>

          {/* Результат */}
          {currentResult && (
            <View
              style={[
                styles.resultBox,
                {
                  borderLeftColor: currentResult.isCorrect
                    ? "#4caf50"
                    : "#ff9800",
                },
              ]}
            >
              <Text
                style={[
                  styles.resultFormula,
                  { color: currentResult.isCorrect ? "#4caf50" : "#ff9800" },
                ]}
              >
                {currentResult.formula}
              </Text>
              <Text style={styles.resultName}>{currentResult.name}</Text>
              <Text style={styles.resultDesc}>{currentResult.description}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.resetLabButton} onPress={clearLab}>
            <Text style={styles.resetLabButtonText}>Очистить колбу</Text>
          </TouchableOpacity>

          {/* СПИСОК ОТКРЫТЫХ ФОРМУЛ */}
          <View style={styles.collectionContainer}>
            <Text style={styles.collectionTitle}>
              Ваша коллекция открытых веществ:
            </Text>
            {LAB_RECIPES.map((recipe) => {
              const isOpened = discoveredMolecules.includes(recipe.id);
              return (
                <View
                  key={recipe.id}
                  style={[
                    styles.collectionCard,
                    isOpened ? styles.cardOpened : styles.cardClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.collFormula,
                      { color: isOpened ? "#ffd700" : "#555" },
                    ]}
                  >
                    {isOpened ? recipe.formula : "???"}
                  </Text>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text
                      style={{
                        color: isOpened ? "#fff" : "#555",
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      {isOpened ? recipe.name : "Заблокировано"}
                    </Text>
                    {isOpened && (
                      <Text
                        style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}
                      >
                        {recipe.desc}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  mainTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
  tabText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
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
  diffButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  diffButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  quizProgress: { color: "#888", fontSize: 13, marginBottom: 10 },
  quizQuestion: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  restartButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  // Специфичные стили для новой лаборатории
  labMainTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  labCounterTitle: {
    color: "#aaa",
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  atomsGrid: { width: "100%", marginBottom: 10 },
  atomsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 6,
  },
  atomCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  atomCircleText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  atomCircleSub: { color: "#fff", fontSize: 10, opacity: 0.8 },
  beakerContainer: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  beakerTitle: {
    color: "#888",
    fontSize: 13,
    marginBottom: 5,
    textAlign: "center",
  },
  beakerStatsRow: { flexDirection: "row", justifyContent: "space-around" },
  beakerText: { color: "#fff", fontSize: 16 },
  resultBox: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderLeftWidth: 5,
    marginVertical: 10,
  },
  resultFormula: { fontSize: 32, fontWeight: "bold" },
  resultName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 3,
  },
  resultDesc: { color: "#bbb", fontSize: 13, textAlign: "center" },
  resetLabButton: {
    backgroundColor: "#2d2d2d",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  resetLabButtonText: { color: "#ff5a5f", fontWeight: "bold" },

  // Стили коллекции
  collectionContainer: { width: "100%", marginTop: 10 },
  collectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  collectionCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
    borderWidth: 1,
  },
  cardOpened: { backgroundColor: "#1e1e1e", borderColor: "#ffd700" },
  cardClosed: { backgroundColor: "#151515", borderColor: "#222" },
  collFormula: {
    fontSize: 20,
    fontWeight: "bold",
    width: 70,
    textAlign: "center",
  },

  // Пасхалка / Ачивка
  easterEggAlert: {
    backgroundColor: "#2e2541",
    borderWidth: 2,
    borderColor: "#9c27b0",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15,
  },
  easterEggEmoji: { fontSize: 40, marginBottom: 5 },
  easterEggTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  easterEggText: {
    color: "#d1c4e9",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
  },
  resetAllBtn: {
    marginTop: 15,
    backgroundColor: "#7b1fa2",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resetAllBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});

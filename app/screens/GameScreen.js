import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import onepiece from './assets/quizs/onepiece.json';
import naruto from './assets/quizs/naruto.json';

const QuizPage = ({ quizName, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [correctSound, setCorrectSound] = useState(null);

  const quizzes = { onepiece, naruto };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = quizzes[quizName];
        const randomQuestions = data.sort(() => Math.random() - 0.5).slice(0, 5);
        setQuestions(randomQuestions);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les questions.');
      }
    };

    loadQuestions();
    return () => unloadSounds(); 
  }, [quizName]);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/correct.wav'));
      setCorrectSound(sound);
    };

    loadSounds();
  }, []);

  const unloadSounds = async () => {
    if (correctSound) {
      await correctSound.unloadAsync();
    }
  };

  const handleAnswer = async (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.reponse) {
      setScore((prev) => prev + 1);
      if (correctSound) {
        await correctSound.replayAsync(); 
      }
    } else {
      Vibration.vibrate(500);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const replayQuiz = () => {
    setQuizEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      {!quizEnded ? (
        questions.length > 0 ? (
          <>
            <Text style={styles.quizTitle}>{quizName}</Text>
            <Text style={styles.question}>
              {questions[currentQuestionIndex].question}
            </Text>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.answerButton}
                onPress={() => handleAnswer((index + 1).toString())} // Comparer avec "reponse"
              >
                <Text style={styles.answerText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <Text style={styles.loadingText}>Chargement des questions...</Text>
        )
      ) : (
        <Modal
          transparent={true}
          visible={quizEnded}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.scoreText}>Votre score : {score} / 5</Text>
              <TouchableOpacity style={styles.modalButton} onPress={replayQuiz}>
                <Text style={styles.modalButtonText}>Rejouer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={onExit}
              >
                <Text style={styles.modalButtonText}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151692',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: '#17c983',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#17c983',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizPage;

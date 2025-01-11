import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ConnexionScreen from './screens/ConnexionScreen';
import SinscrireScreen from './screens/SinscrireScreen';
import QuizPage from './screens/GameScreen';
import MainScreen from './screens/MainScreen';

const App = () => {
  // Écran initial
  const [currentScreen, setCurrentScreen] = useState('Connexion'); 
  const [pseudo, setPseudo] = useState<string>('');
  const [quizName, setQuizName] = useState('');
  const [userUID, setUserUID] = useState<string>('');


  const navigateToScreen = (screen: string, data: { quizName?: string } = {}) => {
    if (screen === 'QuizPage') {
      setQuizName(data.quizName || ''); // Enregistrer le quiz sélectionné
    }
    setCurrentScreen(screen);
  };


  const renderScreen = () => {
    switch (currentScreen) {
      case 'Connexion':
        return (
          <ConnexionScreen
            onSignUpClick={() => navigateToScreen('Sinscrire')}
            onNavigateToMain={(newPseudo: string, uid: string) => {
              setPseudo(newPseudo);
              setUserUID(uid);
              navigateToScreen('MainScreen');
            }}
          />
        );
      case 'Sinscrire':
        return (
          <SinscrireScreen
          onNavigateToMain={(newPseudo: string, uid: string) => {
            setPseudo(newPseudo);
            setUserUID(uid);
            navigateToScreen('MainScreen');
          }}
            onNavigateToConnexion={() => navigateToScreen('Connexion')}/>);
            case 'MainScreen':
              console.log('UID:', userUID);
              return (
                <MainScreen
                  pseudo={pseudo}
                  onLogout={() => navigateToScreen('Connexion')}
                  onStartQuiz={(quizName: any) => navigateToScreen('QuizPage', { quizName })}
                  uid={userUID} 
                />
              );
      case 'QuizPage':
        return <QuizPage quizName={quizName} onExit={() => navigateToScreen('MainScreen')} />;
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

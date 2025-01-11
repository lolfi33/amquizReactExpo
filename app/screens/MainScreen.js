import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firestore = getFirestore();

const MainScreen = ({ pseudo, onLogout, onStartQuiz, uid }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nbPartieJoues, setNbPartieJoues] = useState(0);

  useEffect(() => {
    const fetchNbPartieJoues = async () => {
      if (!uid) {
        console.error('UID non défini');
        return;
      }
  
      try {
        const userDoc = await getDoc(doc(firestore, 'Users', uid));
        if (userDoc.exists()) {
          setNbPartieJoues(userDoc.data().nbPartieJoues || 0);
        } else {
          console.error(`Le document pour l'utilisateur avec UID ${uid} n'existe pas.`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de parties jouées :', error);
      }
    };
  
    fetchNbPartieJoues();
  }, [uid]);
  

  const handleStartQuiz = async (quizName) => {
    setModalVisible(false);

    try {
      const userRef = doc(firestore, 'Users', uid);
      await updateDoc(userRef, {
        nbPartieJoues: nbPartieJoues + 1,
      });
      setNbPartieJoues((prev) => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de nbPartieJoues :', error);
    }

    onStartQuiz(quizName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Image
          source={require('./assets/img/logout.png')}
          style={styles.logo}
        />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Bienvenue {pseudo}</Text>
      <Text style={styles.nbPartiesText}>Nombre de parties jouées : {nbPartieJoues}</Text>
      <TouchableOpacity style={styles.mainButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.mainButtonText}>Choisir un quiz</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choisissez un thème</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleStartQuiz('onepiece')}
              >
                <Text style={styles.modalButtonText}>One Piece</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleStartQuiz('naruto')}
              >
                <Text style={styles.modalButtonText}>Naruto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Annuler</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151692',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#17c983',
    padding: 10,
    borderRadius: 5,
  },
  logo: {
    width: 20,
    height: 20, 
    resizeMode: 'contain', 
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nbPartiesText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
  },
  mainButton: {
    backgroundColor: '#17c983',
    padding: 20,
    borderRadius: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#17c983',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#17c983',
    fontSize: 16,
  },
});

export default MainScreen;

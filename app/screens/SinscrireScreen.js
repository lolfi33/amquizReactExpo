import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig'; 

const SinscrireScreen = ({ onNavigateToMain, onNavigateToConnexion }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const handleSignUp = async () => {
    if (!email || !password || !pseudo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      // Créer user dans FireAuth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Créer user dans FireBase
      await setDoc(doc(firestore, 'Users', uid), {
        pseudo,
        nbPartieJoues: 0,
      });
      setLoading(false);
      
      onNavigateToMain(pseudo, uid);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Email déjà utilisé ou incorrect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer votre compte</Text>

      {/* Mail */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Pseudo */}
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor="gray"
        value={pseudo}
        onChangeText={setPseudo}
      />

      {/* Mdp */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="gray"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToConnexion}>
        <Text style={styles.link}>Revenir à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151692',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#17c983',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#17c983',
    borderRadius: 5,
    color: '#fff',
  },
  button: {
    backgroundColor: '#17c983',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default SinscrireScreen;

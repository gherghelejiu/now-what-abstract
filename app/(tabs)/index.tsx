import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import TranscriberView from '@/components/transcriber/TranscriberView';
import { api } from '@/convex/_generated/api';
import { getDeviceFingerprint } from '@/utils/device';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';

export default function HomeScreen() {
  
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [docModalVisible, setDocModalVisible] = useState(false);
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const { signIn } = useAuthActions();
  // const { isAuthenticated } = useConvexAuth();
  // console.log('isAuthenticated: ', isAuthenticated);
  const user = useQuery(api.users.getCurrentUser);
  console.log('user from query: ', JSON.stringify(user));


  const handleCreateDoc = () => {
    setDocModalVisible(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setAuthModalVisible(true);
  };

  const handleSubmit = async () => {
    console.log({ authMode, email, password });
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const fingerprint = await getDeviceFingerprint();

      await signIn('password', {
        flow: authMode === 'signup' ? 'signUp' : 'signIn',
        password,
        username: email,
        email,
        fingerprint,
        // loginType: 'email',
      });
    } catch (error: any) {
      console.log('');
      Alert.alert("Registration Failed", error.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }

    setAuthModalVisible(false);
  };

  const handleCloseAuthModal = () => {
    setAuthModalVisible(false);
    setEmail('');
    setPassword('');
  };

  const handleCloseDocModal = () => {
    setDocModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <TranscriberView onCreateDoc={handleCreateDoc} onLogin={handleLogin} />

      {/** Auth Modal */}
      <Modal
        visible={authModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAuthModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          {/* Backdrop */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseAuthModal} />

          <View style={styles.modal}>
            <Text style={styles.title}>
              {authMode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={styles.subtitle}>
              {authMode === 'login'
                ? 'Sign in to continue'
                : 'Sign up to get started'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {loading ? <View>
              
            </View> : <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>}

            <TouchableOpacity
              style={styles.switchMode}
              onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              <Text style={styles.switchModeText}>
                {authMode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancel} onPress={handleCloseAuthModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/** Create Doc Modal */}
      <Modal
        visible={docModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDocModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          {/* Backdrop */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseDocModal} />

        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#222',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  switchMode: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#888',
    fontSize: 13,
  },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#444',
    fontSize: 13,
  },
});
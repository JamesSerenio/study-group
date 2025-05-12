import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      return setToast({ show: true, msg: 'All fields are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToast({ show: true, msg: error.message });
    } else if (data?.user) {
      localStorage.setItem('user_id', String(data.user.id)); // Store user ID in localStorage
      history.push('/dashboard'); // Redirect to the dashboard or group page
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Login</h2>
        <IonInput placeholder="Email" onIonChange={(e) => setEmail(e.detail.value!)} />
        <IonInput placeholder="Password" type="password" onIonChange={(e) => setPassword(e.detail.value!)} />
        <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
        <IonText>
          Don't have an account?{' '}
          <IonText color="primary" onClick={() => history.push('/signup')} style={{ cursor: 'pointer' }}>
            Sign Up
          </IonText>
        </IonText>
        <IonToast
          isOpen={toast.show}
          message={toast.msg}
          duration={2000}
          onDidDismiss={() => setToast({ show: false, msg: '' })}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;

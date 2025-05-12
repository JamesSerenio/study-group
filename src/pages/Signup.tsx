import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const history = useHistory();

  const handleSignup = async () => {
    if (!email || !username || !password) {
      return setToast({ show: true, msg: 'All fields are required' });
    }

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setToast({ show: true, msg: error.message });
    } else if (user) {
      // You can update the user profile to store the username after sign up
      const { error: profileError } = await supabase
        .from('users')
        .upsert([{ user_email: email, username, user_id: user.id }]);

      if (profileError) {
        setToast({ show: true, msg: profileError.message });
      } else {
        history.push('/login'); // Redirect to login after successful sign-up
      }
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Sign Up</h2>
        <IonInput placeholder="Email" onIonChange={(e) => setEmail(e.detail.value!)} />
        <IonInput placeholder="Username" onIonChange={(e) => setUsername(e.detail.value!)} />
        <IonInput placeholder="Password" type="password" onIonChange={(e) => setPassword(e.detail.value!)} />
        <IonButton expand="block" onClick={handleSignup}>Sign Up</IonButton>
        <IonText>
          Already have an account?{' '}
          <IonText color="primary" onClick={() => history.push('/login')} style={{ cursor: 'pointer' }}>
            Login
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

export default Signup;

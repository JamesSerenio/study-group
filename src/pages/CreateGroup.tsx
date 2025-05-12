import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const history = useHistory();

  const handleCreate = async () => {
    const uid = Number(localStorage.getItem('user_id'));
    if (!name || !subject || !uid) {
      return setToast({ show: true, msg: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('groups')
      .insert([{ name, subject, created_by: uid }])
      .select(); // remove .single() for compatibility

    if (error || !data || data.length === 0) {
      return setToast({ show: true, msg: error?.message || 'Failed to create group' });
    }

    const group = data[0]; // safely access first inserted row

    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{ group_id: group.group_id, user_id: uid }]);

    if (memberError) {
      return setToast({ show: true, msg: memberError.message });
    }

    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Create Group</h2>
        <IonInput
          placeholder="Group Name"
          value={name}
          onIonChange={e => setName(e.detail.value!)}
        />
        <IonInput
          placeholder="Subject"
          value={subject}
          onIonChange={e => setSubject(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleCreate}>
          Create
        </IonButton>
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

export default CreateGroup;

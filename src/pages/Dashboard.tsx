import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonList, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface Group {
  group_id: number;
  name: string;
  subject: string;
  member_count: number;
}

const Dashboard: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const history = useHistory();

  async function fetchGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`group_id, name, subject, group_members(count) as member_count`)
      .order('date_created', { ascending: false });
    if (!error && data) setGroups(data);
  }

  useEffect(() => {
    async function load() {
      await fetchGroups();
    }
    load();
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Study Groups</h2>
        <IonButton onClick={() => history.push('/create')}>Create Group</IonButton>
        <IonList>
          {groups.map(g => (
            <IonCard key={g.group_id} routerLink={`/group/${g.group_id}`}>
              <IonCardHeader>
                <IonCardTitle>{g.name}</IonCardTitle>
                <IonCardSubtitle>
                  {g.subject} — {g.member_count} members
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

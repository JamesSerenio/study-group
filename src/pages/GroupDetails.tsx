import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface Member {
  user_id: number;
  username: string;
}

interface Group {
  group_id: number;
  name: string;
  subject: string;
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [joined, setJoined] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const fetchDetails = async () => {
    const groupId = Number(id);

    // Fetch group info
    const { data: grp, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('group_id', groupId)
      .single();

    if (groupError || !grp) {
      console.error('Group Error: ', groupError?.message);
      return;
    }

    setGroup(grp);

    // Fetch members with joined user data
    const { data: mems, error: membersError } = await supabase
      .from('group_members')
      .select('user_id, users ( username )')
      .eq('group_id', groupId);

    if (membersError || !mems) {
      console.error('Members Error: ', membersError?.message);
      return;
    }

    const formattedMembers: Member[] = mems.map((m: any) => ({
      user_id: m.user_id,
      username: m.users?.username || 'Unknown',
    }));

    setMembers(formattedMembers);

    // Get the current session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session Error: ', sessionError.message);
      return;
    }

    if (!session) {
      console.log('No session found. User not logged in.');
      return setToast({ show: true, msg: 'User not logged in' });
    }

    // Check if current user is already joined
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log('User Error: ', userError?.message);
      return setToast({ show: true, msg: 'User not logged in' });
    }

    const alreadyJoined = mems.some((m: any) => m.user_id === user.id);
    setJoined(alreadyJoined);
  };

  const handleJoin = async () => {
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session Error: ', sessionError.message);
      return setToast({ show: true, msg: 'Error checking session' });
    }

    if (!session) {
      console.log('No session found. User not logged in.');
      return setToast({ show: true, msg: 'User not logged in' });
    }

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log('User Error: ', userError?.message);
      return setToast({ show: true, msg: 'User not logged in' });
    }

    const uid = user.id;
    if (!uid) {
      return setToast({ show: true, msg: 'User ID not found' });
    }

    // Insert new row in group_members table
    const { error } = await supabase.from('group_members').insert([
      { group_id: Number(id), user_id: uid },
    ]);

    if (error) {
      console.error('Error inserting group member: ', error.message);
      return setToast({ show: true, msg: error.message });
    }

    setToast({ show: true, msg: 'Joined group successfully!' });
    fetchDetails(); // Refresh the group details after joining
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!group) {
    return (
      <IonPage>
        <IonContent className="ion-padding">Loading group details...</IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>{group.name}</h2>
        <p><strong>Subject:</strong> {group.subject}</p>
        <p><strong>Members:</strong> {members.map(m => m.username).join(', ')}</p>
        {!joined && (
          <IonButton expand="block" onClick={handleJoin}>Join Group</IonButton>
        )}
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

export default GroupDetails;

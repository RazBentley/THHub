import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { Subscription } from '../types';

export function useSubscription() {
  const { profile, isOwner } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    if (isOwner) {
      setLoading(false);
      return;
    }
    loadSubscription();
  }, [profile, isOwner]);

  async function loadSubscription() {
    if (!profile) return;
    try {
      const subDoc = await getDoc(
        doc(db, 'users', profile.uid, 'subscription', 'current')
      );
      if (subDoc.exists()) {
        setSubscription(subDoc.data() as Subscription);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const isActive = isOwner || subscription?.status === 'active';

  return { subscription, isActive, loading };
}

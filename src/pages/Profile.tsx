import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Pencil, Check, X } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  nickname: string | null;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      setUser(user);

      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(data);
      setNickname(data.nickname || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ nickname })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, nickname } : null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <div className="mt-1 text-lg">{user?.email}</div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-400">Nickname</label>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Pencil size={16} />
                <span>Edit</span>
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-grow px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNickname(profile?.nickname || '');
                }}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="mt-1 text-lg">
              {profile?.nickname || 'No nickname set'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Member Since</label>
          <div className="mt-1 text-lg">
            {new Date(profile?.created_at || '').toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
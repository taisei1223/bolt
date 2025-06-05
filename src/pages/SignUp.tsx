import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nickname = formData.get('nickname') as string;

    try {
      // メールアドレスとパスワードでサインアップ
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message === 'User already registered' 
          ? 'このメールアドレスは既に登録されています'
          : signUpError.message);
      }

      if (!authData.user) {
        throw new Error('ユーザー登録に失敗しました');
      }

      // ユーザープロフィールの作成
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            user_id: authData.user.id,
            nickname: nickname || null
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('プロフィールの作成に失敗しました');
      }

      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'アカウント作成中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <UserPlus size={48} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold">アカウント作成</h1>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-2">
            ニックネーム（任意）
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'アカウント作成中...' : 'アカウント作成'}
        </button>

        <p className="text-center text-gray-400">
          すでにアカウントをお持ちですか？{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            ログイン
          </Link>
        </p>
      </form>
    </div>
  );
}
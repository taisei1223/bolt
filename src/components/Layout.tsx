import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const showHeader = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showHeader && (
        <header className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/profile" className="text-xl font-bold flex items-center gap-2">
              <User size={24} />
              <span>プロフィール</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>ログアウト</span>
            </button>
          </div>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
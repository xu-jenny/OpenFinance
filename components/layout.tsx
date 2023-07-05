import { supabaseClient } from '@/utils/supabase-client';
import Login from './home/Login';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Account } from './home/Account';

interface LayoutProps {
  children?: React.ReactNode;
}

function Signout() {
  const handleSignout = async () => {
    try {
      console.log('invoking signout');
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return <button onClick={handleSignout}>Sign Out</button>;
}

export default function Layout({ children }: LayoutProps) {
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const user = await supabaseClient.auth.getUser();
  //       setUser(user['data']['user']);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   };

  //   fetchUser();
  // }, []);
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4 flex justify-between">
          <nav className="ml-4 pl-6">
            <a href="#" className="hover:text-slate-600 cursor-pointer">
              Home
            </a>
          </nav>
          {/* <div className="mr-4 pr-6">
            <Account name={user?.email} />
          </div> */}
        </div>
      </header>
      <div className="container">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {/* {user != null ? <>{children}</> : <Login />} */}
          {children}
        </main>
      </div>
    </div>
  );
}

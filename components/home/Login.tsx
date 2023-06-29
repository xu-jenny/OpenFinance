import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseClient } from '@/utils/supabase-client';

export default function Login() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen -mt-12">
        <div className="border border-grey-300 p-3 w-1/3">
          <h3 className="items-center justify-center">Sign in</h3>
          <Auth
            supabaseClient={supabaseClient}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
          />
        </div>
      </div>
    );
  } else {
    return <div>Logged in!</div>;
  }
}

// import { useState } from 'react'
// import { supabaseClient } from '@/utils/supabase-client';

// export default function Login() {
//   const [loading, setLoading] = useState(false)
//   const [email, setEmail] = useState('')

//   const handleLogin = async (event: any) => {
//     event.preventDefault()

//     setLoading(true)
//     const { error } = await supabaseClient.auth.signInWithOtp({ email })

//     if (error) {
//       alert(error.message)
//     } else {
//       alert('Check your email for the login link!')
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="row flex flex-center">
//       <div className="col-6 form-widget">
//         <form className="form-widget" onSubmit={handleLogin}>
//           <div>
//             <input
//               className="inputField"
//               type="email"
//               placeholder="Your email"
//               value={email}
//               required={true}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <button className={'button block'} disabled={loading}>
//               {loading ? <span>Loading</span> : <span>Send magic link</span>}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

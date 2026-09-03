import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertCircle } from 'lucide-react';

const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // Fetch the user's role from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching role:', profileError);
            setError('Could not verify admin privileges.');
          } else {
            setRole(profileData?.role);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndRole();

    // Listen for auth changes (login, logout, etc)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no session exists, redirect to login page
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // If session exists but role is not admin, show Access Denied
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/20 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            You do not have the required administrator privileges to view this page.
          </p>
          <p className="text-sm text-red-400">{error}</p>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // If session exists AND role is admin, render the child routes (e.g., AdminDashboard)
  return <Outlet />;
};

export default ProtectedRoute;

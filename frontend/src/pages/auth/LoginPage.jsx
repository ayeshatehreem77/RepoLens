import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = (e) => {
    e.preventDefault();
    login({ name: 'Ayesha Tehreem', email: 'ayesha@repolens.dev', role: 'Lead Engineer' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050B1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#101B35] p-8 rounded-lg border border-[rgba(216,193,138,0.20)] shadow-2xl">
        <h2 className="text-2xl font-bold text-[#F2F0E8] mb-4 text-center">RepoLens Authentication</h2>
        <button
          onClick={handleMockLogin}
          className="w-full py-2.5 px-4 bg-[#D8C18A] hover:bg-[#E8D9A9] text-[#050B1C] font-semibold rounded-md transition-colors"
        >
          Enter Dashboard (Mock Auth)
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
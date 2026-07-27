import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLogin, useRegister } from '../api/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();

  const loading = login.isPending || register.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login.mutateAsync({ email, password });
        toast.success('Access granted');
      } else {
        if (!name.trim()) {
          toast.error('Name is required');
          return;
        }
        await register.mutateAsync({ name, email, password });
        toast.success('Admin account created');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="terminal-bg relative flex min-h-screen items-center justify-center p-4">
      <div className="glow-card pulse-glow relative w-full max-w-md rounded-lg p-8">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Terminal className="text-neon-green" size={36} />
          <h1 className="font-mono text-2xl font-bold tracking-[0.3em] text-neon-green">HEXA</h1>
          <p className="font-mono text-xs text-gray-500">
            {mode === 'login' ? '> authenticate to continue' : '> initialize admin account'}
            <span className="cursor-blink">_</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Operator name"
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hexa.local"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          <Button type="submit" variant="solid" className="w-full" loading={loading}>
            {mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-gray-500">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-neon-cyan hover:underline"
              >
                Register admin
              </button>
            </>
          ) : (
            <>
              Have access?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-neon-cyan hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

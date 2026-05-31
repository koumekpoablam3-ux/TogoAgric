'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { tValue, Language } from '@/lib/i18n';
import { LogIn, UserPlus, X, Eye, EyeOff, Info } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export default function AuthDialog({ isOpen, onClose, lang }: AuthDialogProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const ok = login(email, password);
      if (ok) {
        setSuccess(lang === 'fr' ? 'Connexion réussie !' : 'Login successful!');
        setTimeout(() => onClose(), 800);
      } else {
        setError(lang === 'fr' ? 'Email ou mot de passe incorrect. Vérifiez vos identifiants.' : 'Incorrect email or password.');
      }
    } else {
      if (!name || !email || !password) {
        setError(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill all required fields.');
        return;
      }
      register(name, email, password, role);
      setSuccess(lang === 'fr' ? 'Compte créé avec succès !' : 'Account created successfully!');
      setTimeout(() => onClose(), 800);
    }
  };

  const fillDemo = (email: string, pwd: string) => {
    setEmail(email);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white text-center">
          <div className="text-4xl mb-2">🌿</div>
          <h2 className="text-xl font-bold">
            {mode === 'login' ? 'Se connecter à TogoAgric' : 'Créer un compte TogoAgric'}
          </h2>
          <p className="text-green-100 text-sm mt-1">
            {mode === 'login'
              ? (lang === 'fr' ? 'Accédez à votre espace agricole' : 'Access your agricultural space')
              : (lang === 'fr' ? 'Rejoignez la communauté agricole du Togo' : 'Join Togo\'s agricultural community')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">{success}</div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Register fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('name', lang)} *</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={tValue('namePlaceholder', lang)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('phone', lang)}</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+228 90 00 00 00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('role', lang)}</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm">
                  <option value="farmer">🌾 {tValue('farmer', lang)}</option>
                  <option value="buyer">🛒 {tValue('buyer', lang)}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('email', lang)} *</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('password', lang)} *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm pr-10"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm">
            {mode === 'login'
              ? <><LogIn className="w-4 h-4" /> {tValue('loginButton', lang)}</>
              : <><UserPlus className="w-4 h-4" /> {tValue('registerButton', lang)}</>}
          </button>

          {/* Demo accounts (login mode only) - passwords hidden */}
          {mode === 'login' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 text-blue-700 text-xs font-medium mb-2">
                <Info className="w-3 h-3" />
                {lang === 'fr' ? 'Comptes de démonstration' : 'Demo accounts'}
              </div>
              <div className="space-y-1">
                <button type="button" onClick={() => fillDemo('admin@togoagric.tg', 'admin123')}
                  className="w-full text-left text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition">
                  🔑 <strong>Admin</strong> : admin@togoagric.tg
                </button>
                <button type="button" onClick={() => fillDemo('kossi@togoagric.tg', 'password123')}
                  className="w-full text-left text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition">
                  🔑 <strong>Agriculteur</strong> : kossi@togoagric.tg
                </button>
                <button type="button" onClick={() => fillDemo('yao@togoagric.tg', 'password123')}
                  className="w-full text-left text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition">
                  🔑 <strong>Acheteur</strong> : yao@togoagric.tg
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 pt-2">
            {mode === 'login' ? (
              <p>
                {lang === 'fr' ? 'Pas encore de compte ?' : 'No account yet?'}{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); }}
                  className="text-green-600 hover:underline font-semibold">
                  {tValue('register', lang)}
                </button>
              </p>
            ) : (
              <p>
                {lang === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }}
                  className="text-green-600 hover:underline font-semibold">
                  {tValue('login', lang)}
                </button>
              </p>
            )}
          </div>
        </form>

        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

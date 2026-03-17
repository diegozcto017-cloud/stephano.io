'use client';

import { useState, ReactNode, useEffect, CSSProperties } from 'react';
import { Meteors } from '@/components/Meteors/Meteors';
import { BorderBeam } from '@/components/BorderBeam/BorderBeam';
import { verifyAdminPassword } from '@/server/actions/auth.action';
import { requestPasswordReset, verifyResetCode, resetAdminPassword } from '@/server/actions/reset-password.action';

type AuthStep = 'login' | 'forgot' | 'verify' | 'new' | 'success';

export default function AdminAuth({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [step, setStep] = useState<AuthStep>('login');
    const [password, setPassword] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem('stephano-admin');
        if (session === 'authenticated') {
            setAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // --- Inactivity Timeout Logica ---
    useEffect(() => {
        if (!authenticated) return;

        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            // 30 minutes of inactivity
            timeoutId = setTimeout(() => {
                sessionStorage.removeItem('stephano-admin');
                setAuthenticated(false);
                window.location.reload(); // Refresh to ensure state is clean
            }, 30 * 60 * 1000); 
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, resetTimer));

        resetTimer(); // Start the timer

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [authenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setActionLoading(true);

        const isValid = await verifyAdminPassword(password);

        if (isValid) {
            sessionStorage.setItem('stephano-admin', 'authenticated');
            setAuthenticated(true);
            // Ensure first page seen is the Dashboard
            window.location.href = '/admin';
        } else {
            setError('Contraseña incorrecta');
        }
        setActionLoading(false);
    };

    const handleRequestReset = async () => {
        setError('');
        setActionLoading(true);
        const res = await requestPasswordReset();
        if (res.success) {
            setStep('verify');
        } else {
            setError(res.error || 'Error al enviar el código');
        }
        setActionLoading(false);
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setActionLoading(true);
        const res = await verifyResetCode(resetCode);
        if (res.success) {
            setStep('new');
        } else {
            setError(res.error || 'Código incorrecto');
        }
        setActionLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setActionLoading(true);
        const res = await resetAdminPassword(resetCode, newPassword);
        if (res.success) {
            setStep('success');
            setTimeout(() => setStep('login'), 2000);
        } else {
            setError(res.error || 'Error al restablecer la contraseña');
        }
        setActionLoading(false);
    };

    if (loading) return null;

    if (authenticated) return <>{children}</>;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000208',
            padding: '20px'
        }}>
            <Meteors number={30} />
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '48px 40px',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(0, 102, 255, 0.12)',
                borderRadius: '28px',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 20px 50px rgba(0, 2, 8, 0.5)',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 10
            }}>
                <BorderBeam size={150} duration={12} delay={1} />

                <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src="/icon.png" alt="S" width={28} height={28} style={{ display: 'block' }} />
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
                            Stephano<span style={{ color: '#0066FF' }}>.io</span>
                        </span>
                    </div>
                </div>

                {step === 'login' && (
                    <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>Bienvenido</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '24px' }}>Panel de Administración</p>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {error && <p style={errorStyle}>{error}</p>}

                        <button type="submit" disabled={actionLoading} style={buttonStyle}>
                            {actionLoading ? 'Verificando...' : 'Acceder'}
                        </button>

                        <button
                            type="button"
                            onClick={handleRequestReset}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '13px',
                                width: '100%',
                                marginTop: '16px',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerifyCode} style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>Verificación</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '24px' }}>
                            Ingresa el código enviado a tu correo
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                                required
                            />
                        </div>

                        {error && <p style={errorStyle}>{error}</p>}

                        <button type="submit" disabled={actionLoading} style={buttonStyle}>
                            {actionLoading ? 'Verificando...' : 'Verificar Código'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('login')}
                            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', width: '100%', marginTop: '16px', cursor: 'pointer' }}
                        >
                            ← Volver al login
                        </button>
                    </form>
                )}

                {step === 'new' && (
                    <form onSubmit={handleResetPassword} style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>Nueva Contraseña</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '24px' }}>
                            Establece tu nueva contraseña de acceso
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nueva contraseña"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {error && <p style={errorStyle}>{error}</p>}

                        <button type="submit" disabled={actionLoading} style={buttonStyle}>
                            {actionLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px' }}>¡Éxito!</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Tu contraseña ha sido actualizada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
};

const buttonStyle: CSSProperties = {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #0066FF, #00C2FF)',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.25)',
};

const errorStyle: CSSProperties = {
    color: '#ff6b6b',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    background: 'rgba(255, 107, 107, 0.1)',
    padding: '10px',
    borderRadius: '8px'
};


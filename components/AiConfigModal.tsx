import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Globe, Laptop, X, Check, AlertTriangle } from 'lucide-react';
import { Button } from './common/Button';
import { aiConfigManager } from '../utils/aiConfigManager';
import { AiConfig, AiMode } from '../types';
import { testAiConnection, fetchLocalModels } from '../services/aiService';
import { Loader2, RefreshCw } from 'lucide-react';

interface AiConfigModalProps {
    onClose: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ onClose }) => {
    const [config, setConfig] = useState<AiConfig>(aiConfigManager.getConfig());
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [localModels, setLocalModels] = useState<string[]>([]);
    const [isFetchingModels, setIsFetchingModels] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        aiConfigManager.saveConfig(config);
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 500);
    };

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        try {
            const result = await testAiConnection(config);
            setTestResult(result);
        } catch (error) {
            setTestResult({ success: false, message: "Ocurrió un error inesperado al probar la conexión." });
        } finally {
            setIsTesting(false);
        }
    };

    const handleRefreshModels = async () => {
        if (!config.localEndpoint) return;
        setIsFetchingModels(true);
        try {
            const models = await fetchLocalModels(config.localEndpoint);
            setLocalModels(models);
            if (models.length > 0 && !config.localModel) {
                setConfig(prev => ({ ...prev, localModel: models[0] }));
            }
        } finally {
            setIsFetchingModels(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full border-4 border-indigo-500"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
                            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Configuración de IA</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Personaliza tu experiencia de tutoría</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                        {(['online', 'local', 'none'] as AiMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setConfig({ ...config, mode })}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                    config.mode === mode 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600' 
                                    : 'bg-slate-50 dark:bg-slate-700/50 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                {mode === 'online' && <Globe className="w-6 h-6 mb-2" />}
                                {mode === 'local' && <Laptop className="w-6 h-6 mb-2" />}
                                {mode === 'none' && <X className="w-6 h-6 mb-2" />}
                                <span className="text-xs font-bold uppercase">
                                    {mode === 'online' ? 'Online' : mode === 'local' ? 'Local' : 'Sin IA'}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl flex gap-3 border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                            {config.mode === 'online' && "Requiere una clave API de Google Gemini enviada a través de Internet."}
                            {config.mode === 'local' && "Usa una IA que se ejecuta en tu propia computadora. Privado y offline."}
                            {config.mode === 'none' && "La aplicación funcionará normalmente pero sin sugerencias ni explicaciones inteligentes."}
                        </p>
                    </div>

                    {config.mode === 'online' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Google Gemini API Key</label>
                            <input 
                                type="password"
                                value={config.apiKey || ''}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="Introduce tu clave API..."
                                className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
                            />
                        </motion.div>
                    )}

                    {config.mode === 'local' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                                <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-tight">
                                    <strong className="block mb-1">⚠️ Importante para Ollama:</strong>
                                    Para permitir la conexión desde el navegador, debes configurar la variable de entorno:
                                    <code className="block mt-1 p-1 bg-blue-100 dark:bg-blue-900/40 rounded">OLLAMA_ORIGINS="*"</code>
                                    y reiniciar Ollama.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Endpoint Local (ej. Ollama)</label>
                                <input 
                                    type="text"
                                    value={config.localEndpoint || ''}
                                    onChange={(e) => setConfig({ ...config, localEndpoint: e.target.value })}
                                    placeholder="http://localhost:11434"
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre del Modelo</label>
                                    {config.localEndpoint && (
                                        <button 
                                            onClick={handleRefreshModels}
                                            disabled={isFetchingModels}
                                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                                        >
                                            {isFetchingModels ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                            Listar modelos
                                        </button>
                                    )}
                                </div>
                                {localModels.length > 0 ? (
                                    <select
                                        value={config.localModel || ''}
                                        onChange={(e) => setConfig({ ...config, localModel: e.target.value })}
                                        className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
                                    >
                                        <option value="">Selecciona un modelo...</option>
                                        {localModels.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input 
                                        type="text"
                                        value={config.localModel || ''}
                                        onChange={(e) => setConfig({ ...config, localModel: e.target.value })}
                                        placeholder="llama3, mistral, gemma..."
                                        className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}

                    {config.mode !== 'none' && (
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="secondary"
                                onClick={handleTest}
                                disabled={isTesting}
                                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                            >
                                {isTesting ? "Probando conexión..." : "Probar Conexión"}
                            </Button>

                            <AnimatePresence>
                                {testResult && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-3 rounded-xl text-xs font-medium border ${
                                            testResult.success 
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {testResult.success ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {testResult.message}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <Button 
                        variant="secondary" 
                        onClick={onClose}
                        className="flex-1"
                    >
                        Saltar por ahora
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isSaving}
                    >
                        {isSaving ? "Guardando..." : "Guardar Configuración"}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

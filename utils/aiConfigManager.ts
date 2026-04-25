import { AiConfig } from "../types";

const AI_CONFIG_KEY = "tutor_ai_config";

const DEFAULT_CONFIG: AiConfig = {
    mode: 'none',
};

export const aiConfigManager = {
    getConfig(): AiConfig {
        const saved = localStorage.getItem(AI_CONFIG_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing AI config", e);
            }
        }
        return DEFAULT_CONFIG;
    },

    saveConfig(config: AiConfig) {
        localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
        // Force a reload or notify the aiService
        window.dispatchEvent(new Event('ai-config-updated'));
    },

    hasConfig(): boolean {
        const config = this.getConfig();
        return config.mode !== 'none' || (config.mode === 'online' && !!config.apiKey) || (config.mode === 'local' && !!config.localEndpoint);
    },

    isConfigured(): boolean {
        const config = this.getConfig();
        if (config.mode === 'none') return false;
        if (config.mode === 'online' && !config.apiKey) return false;
        if (config.mode === 'local' && !config.localEndpoint) return false;
        return true;
    }
};

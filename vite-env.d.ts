/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_FRONT_URL: string;
    readonly VITE_IMG_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
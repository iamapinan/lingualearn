declare module 'gracerai-sdk' {
  export class GracerAI {
    constructor(config: {
      apiKey: string;
      host?: string;
    });

    user: {
      login(username: string, password: string): Promise<any>;
      register(username: string, password: string): Promise<any>;
      getProfile(username: string): Promise<any>;
      getActivity(username: string, options?: { limit?: number; offset?: number }): Promise<any>;
      logActivity(username: string, type: string, description: string): Promise<any>;
    };

    ai: {
      chat(messages: Array<{ role: string; content: string }>, options?: { temperature?: number; maxTokens?: number }): Promise<any>;
      status(): Promise<any>;
    };

    fileManager: {
      listFiles(username: string, options?: { path?: string; search?: string }): Promise<any>;
      uploadFile(username: string, file: File, path: string): Promise<any>;
      downloadFile(username: string, path: string): Promise<any>;
      removeFile(username: string, path: string): Promise<any>;
      createFolder(username: string, name: string, path: string): Promise<any>;
      shareFile(path: string): Promise<any>;
      getSharedFile(shareCode: string, encryptedData: string, decrypt?: boolean): Promise<any>;
    };
  }
}
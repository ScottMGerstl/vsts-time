export class Config {
    public static instance: string;
    public static token: string;
    public static userEmail: string;

    public static getApiUrl(instance: string): string {
        return `https://${instance}.visualstudio.com/DefaultCollection/_apis/`;
    }
}
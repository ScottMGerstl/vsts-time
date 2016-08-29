export class Config {
    public static getApiUrl(instance: string): string {
        return `https://${instance}.visualstudio.com/DefaultCollection/_apis/`;
    }
}
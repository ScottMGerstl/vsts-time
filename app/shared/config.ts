export class Config {
    public getApiUrl(instance: string) {
        return `https://${instance}.visualstudio.com/Development/_apis/`;
    }
}
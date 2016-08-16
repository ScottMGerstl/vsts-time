export class Config {
    public static instance: string;
    public static token: string;
    public static userEmail: string;

    public static get apiUrl() {
        return `https://${this.instance}.visualstudio.com/DefaultCollection/_apis/`;
    }
}
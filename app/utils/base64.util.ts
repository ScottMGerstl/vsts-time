declare var java: any;
declare var android: any;

export function base64Encode(value: string) {
    let rawString = new java.lang.String(value);
    let encodedString = android.util.Base64.encodeToString(rawString.getBytes(), android.util.Base64.DEFAULT);

    return encodedString;
}
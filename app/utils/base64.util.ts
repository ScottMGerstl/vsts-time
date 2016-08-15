declare var java: any;
declare var android: any;

export function base64Encode(value: string) {
    let rawString = new java.lang.String(value);
    let encodedString = android.util.Base64.encodeToString(rawString.getBytes(), android.util.Base64.DEFAULT);

    if (encodedString.substr(encodedString.length - 1) === "\n") {
        encodedString = encodedString.substr(0, encodedString.length - 1);
    }

    return encodedString;
}
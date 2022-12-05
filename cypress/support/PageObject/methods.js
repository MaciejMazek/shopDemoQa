class Methods {
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    replaceStringWithPath(string) {

        string = string.toLowerCase();
        if (/\s$/.test(string)) {
            string = string.slice('0', '-1');
        }
        string = string.replace('\n', '');
        while (string.includes(' ')) {
            string = string.replace(' ', '-');
        }
        return string;
    }
}

export const methods = new Methods;
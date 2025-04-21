// @name Escape characters
// @id escapecharacters
// @description Be able to use escape character in name, tribe and chat
// @author noam

function unescapeString(input) {
    if (typeof input !== "string") return input;
    return input.replace(/\\(\\|n|r|t|b|f|v|\d{1,3}|x([\da-fA-F]{2})|u([\da-fA-F]{4})|u\{(0*[\da-fA-F]{1,6})\})/g, (match, sequence, hex, unicode, codepoint) => {
        switch (sequence[0]) {
            case "\\": return "\\";
            case "n": return "\n";
            case "r": return "\r";
            case "t": return "\t";
            case "b": return "\b";
            case "f": return "\f";
            case "v": return "\v";
            case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7":
                return String.fromCharCode(parseInt(sequence, 8) || 0);
            default:
                if (hex != null) {
                    return String.fromCharCode(parseInt(hex, 16) || 0)
                } else if (unicode != null) {
                    return String.fromCharCode(parseInt(unicode, 16) || 0);
                } else if (codepoint != null) {
                    const val = parseInt(codepoint, 16) || 0;
                    return val > 0x10FFFF ? match : String.fromCharCode(val)
                }
                return sequence
        }
    });
};

const SPAWN = 0, TRIBE = 1, CHAT = 2;
const limits = {
    spawn: 22,
    createTribe: 5,
    chat: 100
};

hook(TextEncoder.prototype, "encode", {
    apply(f, th, args) {
        try {
            const spawn = /^(\x14{3}\d+\|6\|)(.+)$/gm;
            const tribe = /^(\x14{3}\d+\|14\|)(.+)$/gm;
            const chat = /^(\x13{3}[01])(.+)$/gm;
            const resArr = [spawn.exec(args[0]), tribe.exec(args[0]), chat.exec(args[0])]
            const msgType = resArr.findIndex(v => v != null);
            const res = resArr[msgType]
            if (res != null && res.length == 3) {
                switch (msgType) {
                    case SPAWN:
                        args[0] = res[1] + unescapeString(res[2]).substr(0, limits.spawn);
                        break;
                    case TRIBE:
                        args[0] = res[1] + unescapeString(res[2]).substr(0, limits.createTribe);
                        break;
                    case CHAT:
                        args[0] = res[1] + unescapeString(res[2]).substr(0, limits.chat);
                        break;
                }
            }
        } catch { }
        return reflect.apply(f, th, args);
    }
});

setInterval(() => {
    try {
        document.querySelectorAll(".el-input__inner").forEach(v => {
            v.maxLength = 1000;
        });
        document.querySelector(".chat-input input")?.setAttribute("maxLength", 1000);
    } catch (e) { }
}, 10);
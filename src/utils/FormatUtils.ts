import fileSize from 'filesize';

export default class FormatUtils {

    public static convertSizeToReadable(size: number, withSizeIndicator: boolean) {
        const result = fileSize(size, {output: "object", standard: "jedec", pad: true});
        let value = `${result.value}`;
        if (withSizeIndicator) {
            value += ` ${result.symbol}`;
        }
        return value;
    }

}

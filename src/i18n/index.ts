import enUS from './en-us';

export default {
  'en-us': enUS,
};

// TODO - Use for language selection screens
export type MessageMetadata = {
    name: string;
    locale: string;
}

export type Message = {
    metadata: MessageMetadata;
    translations: {
        pages: {
            gameSelection: {
                platformModal: {
                    header: string;
                }
            }
        }
    }
}

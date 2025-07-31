import enUS from './en';

export default {
  'en': enUS,
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

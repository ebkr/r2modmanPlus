// This is just an example,
// so you can safely delete all default props below

import { Message } from '../index';

export default {
    metadata: {
        name: 'English',
        locale: 'enUS'
    },
    translations: {
        pages: {
            gameSelection: {
                platformModal: {
                    header: "Which store manages your game?"
                }
            }
        }
    }
} as Message;

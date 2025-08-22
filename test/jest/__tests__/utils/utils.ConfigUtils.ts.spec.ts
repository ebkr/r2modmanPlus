import FsProvider from '../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../stubs/providers/InMemory.FsProvider';
import {
    buildConfigurationFileFromPath,
    ConfigurationEntry, ConfigurationEntryDisplayType, ConfigurationFile,
    getSelectOptions, saveConfigurationFile
} from '../../../../src/utils/ConfigUtils';
import path from 'path';
import { test } from '@jest/globals';

describe('buildConfigurationFileFromPath', () => {

    beforeAll(() => {
        const fsProvider = new InMemoryFsProvider();
        FsProvider.provide(() => fsProvider);
    });

    beforeEach(() => {
        InMemoryFsProvider.clear();
    });

    test('Standard KeyValue with Section', async () => {
        const fileContent = [
            '[Section Name]',
            'FirstKey = Identifier',
            '',
            'SecondKey = 345',
            'ThirdKey = #AABBCC'
        ].join('\r\n');

        const pathToFileFolder = 'config';
        const fileName = 'standard_keyvalue_with_section.cfg';
        const filePath = path.join(pathToFileFolder, fileName);
        await FsProvider.instance.mkdirs(pathToFileFolder);
        await FsProvider.instance.writeFile(filePath, fileContent);

        const configurationFile = await buildConfigurationFileFromPath(filePath);

        expect(configurationFile.filename).toStrictEqual(fileName);
        expect(configurationFile.path).toStrictEqual(filePath);

        const sectionNames = configurationFile.sections.map((section) => section.sectionName);

        expect(sectionNames).toStrictEqual(['Section Name']);

        const section = configurationFile.sections[0];
        expect(section.entries).toMatchObject([
            {
                entryName: 'FirstKey',
                value: 'Identifier',
                cachedValue: 'Identifier',
                displayType: 'input',
                commentLines: []
            },
            {
                entryName: 'SecondKey',
                value: '345',
                cachedValue: '345',
                displayType: 'input',
                commentLines: []
            },
            {
                entryName: 'ThirdKey',
                value: '#AABBCC',
                cachedValue: '#AABBCC',
                displayType: 'input',
                commentLines: []
            }
        ] as ConfigurationEntry[]);
    });

    test('Entry comments', async () => {
        const fileContent = [
            '[Section Name]',
            '## This is a description comment',
            '# This is a metadata comment',
            '',
            '# A further metadata comment',
            'Key = Value'
        ].join('\r\n');

        const pathToFileFolder = 'config';
        const fileName = 'entry_comments.cfg';
        const filePath = path.join(pathToFileFolder, fileName);
        await FsProvider.instance.mkdirs(pathToFileFolder);
        await FsProvider.instance.writeFile(filePath, fileContent);

        const configurationFile = await buildConfigurationFileFromPath(filePath);

        expect(configurationFile.filename).toStrictEqual(fileName);
        expect(configurationFile.path).toStrictEqual(filePath);

        const sectionNames = configurationFile.sections.map((section) => section.sectionName);

        expect(sectionNames).toStrictEqual(['Section Name']);

        const section = configurationFile.sections[0];
        expect(section.entries).toMatchObject([
            {
                entryName: 'Key',
                value: 'Value',
                cachedValue: 'Value',
                displayType: 'input',
                commentLines: [
                    {
                        rawValue: '## This is a description comment',
                        displayValue: 'This is a description comment',
                        isDescription: true
                    },
                    {
                        rawValue: '# This is a metadata comment',
                        displayValue: 'This is a metadata comment',
                        isDescription: false
                    },
                    {
                        rawValue: '# A further metadata comment',
                        displayValue: 'A further metadata comment',
                        isDescription: false
                    }
                ]
            }
        ] as ConfigurationEntry[]);
    });

    describe('Additional input type identification', () => {

        test('Single select', async () => {
            const fileContent = [
                '[Section Name]',
                '# Acceptable values: a, b',
                'FirstKey = Identifier'
            ].join('\r\n');

            const pathToFileFolder = 'config';
            const fileName = 'single_selection_option.cfg';
            const filePath = path.join(pathToFileFolder, fileName);
            await FsProvider.instance.mkdirs(pathToFileFolder);
            await FsProvider.instance.writeFile(filePath, fileContent);

            const configurationFile = await buildConfigurationFileFromPath(filePath);
            const entry = configurationFile.sections[0].entries[0];

            expect(entry.displayType).toStrictEqual('single-select');
        });

        test('Multi select', async () => {
            const fileContent = [
                '[Section Name]',
                '# Multiple values can be set at the same time by separating them with commas',
                '# Acceptable values: a, b',
                'FirstKey = Identifier'
            ].join('\r\n');

            const pathToFileFolder = 'config';
            const fileName = 'multi_select_option.cfg';
            const filePath = path.join(pathToFileFolder, fileName);
            await FsProvider.instance.mkdirs(pathToFileFolder);
            await FsProvider.instance.writeFile(filePath, fileContent);

            const configurationFile = await buildConfigurationFileFromPath(filePath);
            const entry = configurationFile.sections[0].entries[0];

            expect(entry.displayType).toStrictEqual('multi-select');
        });

        test('Boolean', async () => {
            const fileContent = [
                '[Section Name]',
                '# Setting type: Boolean',
                '# Acceptable values: true, false',
                'FirstKey = Identifier'
            ].join('\r\n');

            const pathToFileFolder = 'config';
            const fileName = 'boolean_option.cfg';
            const filePath = path.join(pathToFileFolder, fileName);
            await FsProvider.instance.mkdirs(pathToFileFolder);
            await FsProvider.instance.writeFile(filePath, fileContent);

            const configurationFile = await buildConfigurationFileFromPath(filePath);
            const entry = configurationFile.sections[0].entries[0];

            expect(entry.displayType).toStrictEqual('boolean');
        });

    });

});

describe('getSelectOptions', () => {

    test('input', () => {
        const configurationEntry: ConfigurationEntry = {
            entryName: 'InputEntry',
            displayType: 'input',
            value: "value",
            cachedValue: "value",
            commentLines: [],
        };

        expect(() => getSelectOptions(configurationEntry)).toThrowError(
            new Error(`Invalid display type for select options. Got [input] for entry: InputEntry`)
        );
    });

    test.each([
        'single-select',
        'multi-select',
    ])("%s", (displayType) => {
        const configurationEntry: ConfigurationEntry = {
            entryName: 'Entry',
            displayType: displayType as ConfigurationEntryDisplayType,
            value: "value",
            cachedValue: "value",
            commentLines: [
                {
                    rawValue: '# Acceptable values: valueOne, valueTwo, valueThree',
                    displayValue: 'Acceptable values: valueOne, valueTwo, valueThree',
                    isDescription: false,
                }
            ],
        };

        expect(getSelectOptions(configurationEntry)).toMatchObject(['valueOne', 'valueTwo', 'valueThree']);
    });

    test('boolean', () => {
        const configurationEntry: ConfigurationEntry = {
            entryName: 'Entry',
            displayType: 'boolean',
            value: "value",
            cachedValue: "value",
            commentLines: [],
        };

        expect(getSelectOptions(configurationEntry)).toEqual(['true', 'false']);
    });

});

describe('saveConfigurationFile', () => {

    beforeAll(() => {
        const fsProvider = new InMemoryFsProvider();
        FsProvider.provide(() => fsProvider);
    });

    beforeEach(() => {
        InMemoryFsProvider.clear();
    });

    test('saves', async () => {
        const fileDirectory = path.join("config", "saved");
        const fileName = "configurationFileToSave.cfg";
        const configurationFile: ConfigurationFile = {
            filename: fileName,
            path: path.join(fileDirectory, fileName),
            sections: [
                {
                    sectionName: "First Section",
                    entries: [
                        {
                            entryName: "FirstSectionEntry",
                            value: "Saved value",
                            cachedValue: "Old value",
                            displayType: 'input',
                            commentLines: [],
                        }
                    ]
                },
                {
                    sectionName: "Second Section",
                    entries: [
                        {
                            entryName: "SecondSectionFirstEntry",
                            value: "First entry new value",
                            cachedValue: "First entry old value",
                            displayType: 'input',
                            commentLines: [
                                {
                                    rawValue: '## First comment line',
                                    displayValue: 'First comment line',
                                    isDescription: true,
                                },
                                {
                                    rawValue: '# Metadata comment line',
                                    displayValue: 'Metadata comment line',
                                    isDescription: false,
                                },
                            ],
                        },
                        {
                            entryName: "SecondSectionSecondEntry",
                            value: "Second entry new value",
                            cachedValue: "Second entry old value",
                            displayType: 'input',
                            commentLines: [],
                        }
                    ]
                }
            ]
        }

        await FsProvider.instance.mkdirs(fileDirectory);
        await saveConfigurationFile(configurationFile);

        const fileContent = (await FsProvider.instance.readFile(configurationFile.path)).toString();

        expect(fileContent).toEqual(
`[First Section]

FirstSectionEntry = Saved value

[Second Section]

## First comment line
# Metadata comment line
SecondSectionFirstEntry = First entry new value

SecondSectionSecondEntry = Second entry new value

`
        )
    })

});

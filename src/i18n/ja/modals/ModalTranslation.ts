import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Steamフォルダーの設定に失敗しました。',
        steamExecutableNotSelected: 'Steamを実行するファイルを選択されてませんでした。',
        solution: '実行ファイルに問題なくエラーが表示された場合は一度r2modmanを閉じて「管理者として実行」を選んで再度お試しください。'
    },
    failedToSetTheGameFolder: {
        title: '{gameName}フォルダーの設定に失敗しました。',
        listedExecutableNames: '以下の実行ファイルを選択してください:"{options}"',
        executableMustBeOneOf: 'いずれかの実行ファイルを選択してください:',
        solution: '実行ファイルに問題なくエラーが表示された場合は一度r2modmanを閉じて「管理者として実行」を選んで再度お試しください。'
    },
    clearingGameDirectory: {
        title: '{gameName}のゲームディレクトリを削除する',
        warning: '{gameName}のゲームディレクトリ内の全てのファイルが削除されます。よろしいですか？',
        steamWillBeStarted: `
            {gameName}のゲームディレクトリを削除しました。これにより、Steamクライアント内でゲームファイルの整合性の確認を開始します。
        `,
        checkSteamForProgress: `
            認証中の進行状況についてはSteamクライアントをご確認ください。
            まだウィンドウが表示されてない場合はもうしばらくお待ちください。
            `,
        confirmation: 'わかった'
    },
    dependencyStrings: {
        title: 'Dependency string list',
        dependency: '{modName}-{versionNumber}',
        close: '閉じる'
    },
    launchArguments: {
        title: 'カスタム起動オプションの設定',
        someProvidedByDefault: '以下の起動オプションの引数はデフォルトで設定されてます。:',
        moddedLabel: 'Modded:',
        availableAfterInstallingLoader: 'これらの引数は、Mod Loaderをインストールした後に適用可能になります。',
        vanillaLabel: 'Vanilla:',
        pleaseNote: `
            これらの設定はSteamの実行ファイルに対して呼び出されます。
            起動オプションの引数を入力する際は注意してください。
            `,
        placeholder: '引数を入力…',
        updateArguments: '起動オプションを更新する',
    },
    categorySelector: {
        selectCategory: 'カテゴリーを選択…',
        noCategoriesSelected: '選択されたカテゴリーはありません',
    },
    importLocalMod: {
        title: 'ファイルからModをインポートする',
        dialogTitle: 'ファイルからローカルModをインポートする',
        actions: {
            selectFile: 'ファイルを選択…',
            importLocalMod: 'ローカルModをインポート',
        },
        content: {
            instructToSelect: 'zipファイル又はDLLを選択してください。',
            dataEntryInfo: `
            Zipファイルには、一部の情報があらかじめ入力されています。(manifestファイルを含む)
            manifestファイルが見つからない場合は、手動で入力する必要があります。
            `,
            waitingForSelection: 'ファイルを読み込み中です。しばらくお待ちください。',
            form: {
                modName: {
                    label: 'Mod名',
                    placeholder: 'Mod名を入力…',
                },
                modAuthor: {
                    label: '製作者',
                    placeholder: '製作者名を入力…',
                },
                description: {
                    label: '説明(任意)',
                    placeholder: '説明を入力…'
                },
                version: {
                    label: 'バージョン',
                    majorLabel: 'メジャー',
                    minorLabel: 'マイナー',
                    patchLabel: 'パッチ'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Mod名が入力されていません。',
            authorNameEmpty: '製作者名が入力されていません。',
            invalidVersion: 'メジャー、マイナー、パッチの入力ボックスに0より大きい数値を設定してください。',
            nonNumericVersion: 'メジャー、マイナー、パッチの入力ボックスに数字を入力してください。',
            noProfileSelected: 'プロファイルが選択されていません。'
        }
    },
    concerningPackage: {
        title: '削除されたModの確認:{modName}',
        notFound: 'Thunderstore上でダウンロードしたModが見つかりません。',
        whyRemoved: '公開してるModは、製作者がModを削除(又は非公開に設定)した、もしくは利用規約に違反してるか、モデレーターによる審査によっては削除される可能性があります。',
        recommendation: 'Thunderstoreに削除されたModは一般的には削除する事をおすすめします。',
        exportWarning: 'また、削除されたModは、エクスポートされたプロファイルからこのModをインポートすることが出来なくなります。',
        actions: {
            markSafe: '安全なバージョンとしてマークする',
            remove: '削除する',
            review: '確認する',
        }
    },
    gameRunning: {
        starting: 'まもなく、{gameName}を起動します。',
        launchingViaSteam: 'まもなく、Steamから{gameName}を起動します。',
        closeToContinue: 'このメッセージを閉じてもゲームは続行しますのでご安心ください。',
        takingAWhile: 'ゲームの起動に時間がかかってる場合は、Steamクライアント側が起動処理をしてる可能性があります。',
        bePatient: 'ゲームを起動するまでがModding、楽しんでいってね！',
        close: '閉じる',
    },
    error: {
        title: 'エラーデス!!',
        suggestion: '提案',
        close: '閉じる',
    },
    disableMod: {
        title: '{modName}を無効にする',
        dependantsWarning: 'このModに依存してる(又は関連付けてる)Modがあります。依存してるModを無効するには{disableAllAction}ことをおすすめします。なお、単体で無効にすると(場合によっては)エラーが発生する可能性があります。',
        modsToBeDisabled: '以下のModが無効になります。',
        actions: {
            disableAll: '全部無効にする',
            disableAllRecommended: '全部無効にする(おすすめ)',
            disableOnly: '{modName}だけ無効にする',
        }
    },
    uninstallMod: {
        title: '{modName}をアンインストールする',
        dependantsWarning: 'このModに依存してる(又は関連付けてる)Modがあります。依存してるModをアンインストールするには{disableAllAction}ことをおすすめします。なお、単体でアンインストールすると(場合によっては)エラーが発生する可能性があります。',
        modsToBeUninstalled: '以下のModがアンインストールされます。',
        actions: {
            uninstallAll: '全てアンインストールする',
            uninstallAllRecommended: '全てアンインストールする(おすすめ)',
            uninstallOnly: '{modName}だけアンインストールする',
        }
    },
    associatedMods: {
        title: '{modName}に関連してるMod',
        dependencies: 'このModに関連付いたMod',
        dependants: 'このModを関連付いてるMod',
        none: 'このModに関連付けた(又は関連付いてる)Modはありません。',
        done: 'わかった',
    },
    codeExport: {
        title: 'プロファイルがエクスポートされました。',
        description: '生成されたコードはクリップボードにコピーされましたが、以下の欄からいつでもコピー出来ます。:',
        done: 'わかった',
        copied: 'クリップボードにコピーしました。',
    },
    downloadProgress: {
        states: {
            downloading: 'ダウンロード中 - {modName}',
            installing: 'インストール中 - {modName}',
        },
        complete: 'ダウンロード完了',
        close: '閉じる',
        downloadProgress: 'ダウンロード中: {progress}% [{totalSize}]',
        installProgress: 'インストール中: {progress}% [{totalSize}]',
        extractionProgress: 'ファイル展開中: {progress}% [{totalSize}]',
        waitingForDownload: 'インストール中: ダウンロードが完了したらインストールします。',
    },
    downloadModVersionSelect: {
        title: '{modName}をダウンロードするバージョンを選択してください。',
        content: {
            recommendedDisclaimer: '何かしらの理由もなければ最新のバージョンでダウンロードする事をおすすめします。',
            outdatedModsAdvice: 'なお、古いバージョンを使用すると問題が発生する可能性があります。',
        },
        tags: {
            select: 'バージョンを選択してください。',
            recommended: 'v{version} がおすすめです。',
            latest: '最新のバージョンです。(v{version})',
            outdated: '古いバージョンです。(v{version})'
        },
        download: 'ダウンロード(関連付けてるModも含む)',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: '使用してるModは全て最新バージョンです。',
            content: 'インストールされてるModは全て最新バージョンになってるか、もしくはインストールされているModが一つもないのでアップデートをする必要はありません。',
            close: '閉じる',
        },
        hasModsToUpdate: {
            title: '全てのModをアップデートする',
            content: {
                willBeUpdated: 'インストールされているModを全て最新バージョンにアップデートします。',
                missingDependenciesInstalled: 'なお、未導入の関連付けModも一緒にインストールします。',
                whatWillHappen: '以下のアプデ対象Modがダウンロードとインストールされます。:',
                modUpdatedTo: '{modName}のバージョンが {version} にアップデートします。',
            },
            updateAll: '全てアップデートする',
        }
    },
    launchType: {
        title: '起動時の動作設定',
        auto: {
            NATIVE: '設定を「ネイティブ」にしてゲームを起動します。',
            PROTON: '設定を「プロトン」にしてゲームを起動します。',
        },
        native: {
            unsureWrapperArgsPresent: '必要なwrapper引数の設定確認が出来ませんでした。',
            addArgumentsInfo: 'まだ手動で設定していない場合は、Steam内のプロパティに以下の起動オプションの引数を貼り付けてください。:',
        },
        actions: {
            copyLaunchArgs: '起動オプションの引数をコピーする',
            update: '更新'
        }
    },
    modFilter: {
        title: 'Modカテゴリーをフィルタリングする',
        languageDisclaimer: 'カテゴリーはThunderstoreから提供されてる物なので、それらの翻訳は未対応なので悪しからずに。',
        selectors: {
            atLeastOneCategory: '以下のカテゴリーで少なくとも1つは含む',
            allCategories: '以下のカテゴリーですべてを含む',
            noneCategories: '除外するカテゴリー'
        },
        allowNsfw: 'NSFW(過激な表現)なModを含む',
        showDeprecated: '非推奨のModを表示する',
        apply: 'フィルター適用'
    },
    sort: {
        title: 'Modのソート順を変更する',
        sortBehaviour: '並び替え順',
        sortDirection: '表示順',
        close: '閉じる',
    },
    createProfile: {
        title: 'プロファイル作成',
        description: '新しくプロファイルを作成します。',
        tagStates: {
            required: 'プロファイルの名前を入力してください。',
            valid: 'プロファイル名「{profileName}」は有効です。',
            error: 'プロファイル名「{profileName}」はすでに使用されているか、使用できない文字が含まれてます。'
        },
        actions: {
            create: '作成する'
        }
    },
    deleteProfile: {
        title: 'プロファイル削除',
        content: {
            resultingAction: '【注意！】このプロファイル内にインストールされてるすべてのModとコンフィグデータを削除します。',
            preventAction: 'もし間違ってこのウィンドウを開いてしまった場合は、暗くなってる部分か右上の×マークをクリックすれば戻れます。',
            confirmation: '消したプロファイルは二度と戻りません！！ こうかいしませんね？（戻せませんよ！）',
        },
        actions: {
            delete: 'こうかいしない！！！！',
        }
    },
    renameProfile: {
        title: 'プロファイル名変更',
        content: 'このプロファイルの名前を別の名前に変更します。',
        actions: {
            rename: '変更する',
        },
        tagStates: {
            required: 'プロファイルの名前を入力してください。',
            valid: 'プロファイル名「{profileName}」は有効です。',
            error: 'プロファイル名「{profileName}」はすでに使用されているか、使用できない文字が含まれてます。'
        },
    },
    importProfile: {
        dialogTitle: 'プロファイルをインポートする',
        dialogButton: 'インポート',
        states: {
            fileCodeSelection: {
                title: 'どの方法でインポートしますか？',
                actions: {
                    fromFile: 'ファイルから',
                    fromCode: 'コードから'
                }
            },
            fromFile: {
                title: 'ファイルを読み込んでます…',
                content: 'まもなく、ファイルを選択するウィンドウが表示されます。プロファイルを選択した後の処理するための時間が少しかかる場合があります。',
            },
            importCode: {
                title: 'プロファイルのコードを　いれてください',
                enterCodePlaceholder: '生成されたプロファイル用のコードを入力…',
                tagStates: {
                    invalid: 'プロファイルのコードがちがいます(入力してるコードに誤字が無いかご確認ください。)',
                },
                actions: {
                    loading: 'よみこみちゅうです',
                    proceed: 'おわり'
                }
            },
            refresh: {
                title: 'オンライン内のModリストを更新してます…',
                content: {
                    description: `
                    一部のパッケージがModマネージャーによって認証されません。
                    オンライン内のModリストを更新すれば問題が解決する可能性があるので、もうしばらくお待ちください。
                    `,
                    waitingForModDownloads: 'オンライン内のModリストを更新する前にダウンロード中のModが終わるまでお待ちください。',
                }
            },
            reviewImport: {
                title: 'インストールをするModの確認',
                content: {
                    notFoundDisclaimer: 'このプロファイルに含まれるModはThunderstoreに見つからない(又はローカルModな)ため、インストールされません。:',
                    ensureCorrectProfile: 'そのプロファイルが現在選択してるゲームに対応した物であることをご確認ください。',
                    packagesWillBeInstalled: '以下のModをインストールします。:',
                },
                actions: {
                    acknowledgement: 'インポート時に上記のModがインストールされない事を理解した',
                    proceed: 'インポートする'
                }
            },
            willImportOrUpdate: {
                title: 'どっちでインポートしますか？',
                actions: {
                    newProfile: '新しいプロファイルにインポートする',
                    existingProfile: '既存のプロファイルを更新してインポートする',
                }
            },
            addProfile: {
                title: 'プロファイルをインポートする',
                content: {
                    create: {
                        description: 'インポートをするプロファイルの名前を入力してください。'
                    },
                    update: {
                        contentsWillBeOverwritten: 'All contents of the profile will be overwritten with the contents of the code/file.',
                        selectProfile: 'Select a profile below:'
                    }
                },
                tagStates: {
                    required: 'プロファイルの名前を入力してください。',
                    valid: '"プロファイル名「{profileName}」は有効です。',
                    error: '"プロファイル名「{profileName}」はすでに使用されているか、使用できない文字が含まれてます。'
                },
                actions: {
                    create: '作成',
				update: '{profileName}のプロファイルを更新する'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Modをダウンロード中: {progress}%',
                    downloadingModsWithGoal: `Modをダウンロード中: {progress}% [{totalSize}]`,
                    cleaningUp: 'クリーンアップ中',
                    applyChanges: '更新されたプロファイルの変更を適用中',
                    copyingModsToProfile: 'Modをプロファイルにコピー中: {progress}%',
                    copyingConfigsToProfile: 'コンフィグデータをプロファイルにコピー中: {progress}%'

                },
                content: {
                    waitMessage: 'ファイルのダウンロードと展開とコピーをしてるため、しばらく時間がかかる可能性があります。',
                    doNotClose: '{appName}を閉じないでお待ちください。'
                }
            }
        }
    },
    platform: {
        header: "どのプラットフォームでModを管理しますか？",
        selectAction: "プラットフォームを選択",
    },
    settingsLoader: {
        managerProblem: '現在使用してるModマネージャーに問題が発生しました。新しいのバージョンが利用可能であれば、そのバージョンをインストールしてください。',
        loadFailed: 'まことに　ざんねんながら　ローカルユーザーせっていのよみこみにしっぱいしました　おきのどくのはなしになりますが…下のぼたんをクリックして、設定をりせっとする事が出来ます。その代わりにすべてのゲームの設定が初期化されます。（元に戻せないけど…しょうがない）',
        resetAction: '設定をリセットする',
        resetFailed: '設定のリセットに失敗しました。{instructionsLink}をアクセスした上で手順に従い、手動で設定をリセットしてみてください。(リセット方法のURLの言語は英語となります。) ',
        instructionsLinkText: '手動でリセットする方法のサイト',
        resetDidNotHelp: 'ローカルに保存されていた設定はリセットされましたが、設定の読み込みに関する問題は解決しませんでした。新しいのバージョンが利用可能であれば、そのバージョンをインストールしてください。'
    },
    actions: {
        close: '閉じる',
    },
}

export default {
    buttons: {
        tip: '支持模组作者',
        donate: '赞助'
    },
    config: {
        edit: {
            save: '保存',
            subtitle: '编辑配置文件',
            cancel: '取消',
            sections: '字段',
            more: '显示更多',
            less: '显示更少'
        },
        selection: {
            title: '配置编辑器',
            subtitle: '选择一个配置文件进行编辑',
            notification: '安装模组后至少启动一次游戏，才会生成配置文件。',
            search: '搜索',
            searchPH: '搜索配置文件',
            sort: '排序',
            edit: '编辑配置',
            open: '打开文件',
            delete: '删除',
            failed: '无法删除配置文件',
            try: '尝试以管理员身份运行 {appName}。',
            SortConfigFile: {
                'Name': '名称',
                'Last updated': '最近更新'
            },
            SortDirection: {
                'Standard': '升序',
                'Reverse': '降序'
            }
        }
    },
    importing: {
        title: '从文件导入模组',
        select: '选择文件',
        import: '导入本地模组',
        tip: '请选择一个 zip 或 DLL 文件进行导入。',
        desc: '包含清单文件的 zip 文件将预先填充一些信息。如果没有清单文件，则需要手动输入。',
        waiting: '加载文件中，这可能需要几分钟。',
        name: '模组名称',
        namePH: '输入模组名称',
        author: '作者',
        authorPH: '输入作者',
        modDesc: '描述（可选）',
        modDescPH: '输入描述',
        version: '版本',
        major: '主要',
        minor: '次要',
        patch: '补丁',
        selectFileButtonLabel: '选择文件',
        selectFileTitle: '从文件导入本地模组',
        modNameVM: '模组名称不能为空。',
        modAuthorVM: '模组作者不能为空。',
        versionVMAll: '主要、次要和补丁版本都必须是数字。',
        versionVM: '主要、次要和补丁版本必须是大于 0 的整数。',
        profileVM: '未选择配置文件'
    },
    mixins: {
        splash: {
            loadingText1: '正在连接到 GitHub 仓库',
            loadingText2: '正在下载排除列表',
            loadingText3: '正在连接到 Thunderstore',
            loadingText4: '正在从 Thunderstore 获取模组列表',
            loadingText5: '正在将模组列表存储到本地缓存',
            loadingText6: '正在获取模组列表',
            loadingText7: '正在从缓存获取模组列表',
            heroTitle: '未能获取到在线模组列表',
            loadingText8: '您仍然可以离线使用管理器，但某些功能可能不可用。'
        }
    },
    modals: {
        filter: {
            title: '筛选模组分类',
            allowNsfw: '允许 NSFW（可能不适宜）的模组',
            showDeprecated: '显示已弃用的模组',
            apply: '应用筛选器',
            categoryFilter: {
                'Mod has at least one of these categories':  '模组至少包含这些类别中的一个',
                'Mod has all of these categories': '模组包含所有这些类别',
                'Mod has none of these categories': '模组不包含任何这些类别'
            }
        },
        error: {
            title: '错误',
            solution: '建议'
        },
        running: {
            launching: '{displayName} 正在通过 Steam 启动',
            starting: '{displayName} 正在启动',
            close: '关闭此消息以继续调整模组。',
            SteamStarting: '如果载入很慢，很可能是因为 Steam 正在启动。',
            patient: '请耐心等待，玩得开心！'
        }
    },
    navigation: {
        menu: {
            modded: '启动模组',
            vanilla: '启动原版',
            mods: '模组',
            installed: '已安装',
            online: '在线',
            other: '其他',
            editor: '配置编辑器',
            settings: '设置',
            help: '帮助',
            language: '切换显示语言'
        }
    },
    settings: {
        view: {
            title: '设置',
            subtitle: '{name}: {version} 的高级选项 ',
            search: '搜索：',
            searchPH: '搜索设置',
            activeTab: '全部',
            tabs: {
                all: '全部',
                profile: '档案文件',
                locations: '文件位置',
                debugging: '调试选项',
                modpacks: '模组包',
                other: '其他'
            },
            actions: [
                '浏览数据文件夹',
                '更改 {name} 目录',
                '浏览档案文件夹',
                '更改数据文件夹目录',
                '将日志文件内容复制到剪贴板',
                '切换下载缓存',
                '运行预加载修复',
                '设置启动参数',
                '清除模组缓存',
                '更改档案文件',
                '启用全部模组',
                '禁用全部模组',
                '导入本地模组',
                '将档案导出为文件',
                '将档案导出为代码',
                '更新全部模组',
                '切换奇特模式',
                '切换主题',
                '切换卡片显示类型',
                '刷新在线模组列表',
                '更改游戏',
                '显示依赖字符串',
                '更改 Steam 目录',
                '语言'
            ],
            descriptions: [
                '打开存储所有游戏和档案的模组目录。',
                '更改 {appName} 使用的 {name} 目录位置。',
                '打开当前档案存储模组的文件夹。',
                '更改存储所有游戏和档案的模组目录。该文件夹不会被删除，现有档案也不会跨目录转移。',
                '将 LogOutput.log 文件中的文本复制到剪贴板，使用 Discord 格式。',
                '下载模组时将忽略缓存中的模组。模组仍将被放置在缓存中。',
                '运行此操作以修复大多数的预加载器或关于重复程序集的错误。',
                '提供用于启动游戏的自定义参数。',
                '释放由于当前档案中未使用的模组而占用的额外空间。',
                '更改模组档案。',
                '为当前档案启用全部模组',
                '为当前档案禁用全部模组',
                '从文件中离线安装模组。',
                '将您的模组列表和配置导出为文件。',
                '将您的模组列表和配置导出为代码。',
                '快速更新每个已安装的模组到它们的最新版本。',
                '启用/禁用奇特模式。',
                '在浅色和深色主题之间切换。',
                '在展开和折叠卡片之间切换。',
                '检查是否有任何新的模组发布。',
                '更改当前游戏（重启管理器）',
                '查看带有版本字符串的已安装模组列表。在 manifest.json 文件中的依赖数组内使用。',
                '更改 {name} 使用的 Steam 目录位置。',
                '更改显示语言'
            ],
            values: [
                '当前：已禁用缓存',
                '当前：已启用缓存（推荐）',
                '这将删除 {name}/Managed 文件夹，并通过 Steam 验证文件',
                '这些命令在游戏启动时针对 Steam 可执行文件使用',
                '检查所有档案中的未使用的模组并清除缓存',
                '当前档案：{name}',
                '已启用 {0}/{1}',
                '已禁用 {0}/{1}',
                '导出的文件可以与朋友共享，以便快速轻松地获得相同的档案',
                '导出的代码可以与朋友共享，以便快速轻松地获得相同的档案',
                '有 1 个模组有更新可用',
                '有 {0} 个模组有更新可用',
                '当前：已启用',
                '当前：已禁用（默认）',
                '当前：深色主题',
                '当前：浅色主题（默认）',
                '当前：展开',
                '当前：折叠（默认）',
                '正在检查新版本',
                '获取新模组时出错：{0}',
                '缓存日期：{0}',
                '没有可用的 API 信息',
                '显示 {0} 模组的依赖字符串',
                '请手动设置',
                '日志文件存在',
                '日志文件不存在',
                '不是所有模组都可以本地安装'
            ],
            returns: [
                '请手动设置'
            ]
        }
    },
    views: {
        associated: {
            title: '与 {name} 关联的模组',
            dependencies: '依赖',
            dependants: '依赖项',
            done: '完成'
        },
        disable: {
            title: '禁用 {name}',
            notification: '其他模组依赖于此模组。请选择',
            disableAll: '禁用全部',
            toDisable: '以禁用依赖模组，否则它们可能会导致错误。',
            subtitle: '将被禁用的模组',
            disabling: '正在禁用 {name}',
            All: '禁用全部（推荐）',
            Only: '仅禁用 {name}'
        },
        localMod: {
            deprecated: '已弃用',
            deprecatedTip: '此模组已弃用，可能已损坏',
            disabled: '已禁用',
            disabledTip: '此模组在游戏中不会被使用',
            donateTip: '支持模组作者',
            updateTip: '有可用更新',
            issueTip: '此模组的依赖存在问题',
            uninstall: '卸载',
            disable: '禁用',
            enable: '启用',
            associated: '关联',
            website: '网站',
            update: '更新',
            download: '下载依赖'
        },
        search: {
            search: '搜索',
            searchPH: '搜索已安装的模组',
            sort: '排序',
            disabled: '已禁用',
            orderOptions: {
                'Custom': '自定义',
                'Mod name': '模组名称',
                'Author name': '作者名称'
            },
            directionOptions: {
                'Standard': '升序',
                'Reverse': '降序'
            },
            disabledOptions: {
                'None': '无',
                'Custom': '自定义',
                'First': '首位',
                'Last': '末位'
            }
        },
        uninstall: {
            title: '卸载 {name}',
            notification: '其他模组依赖于此模组。请选择',
            uninstall: '全部卸载',
            toUninstall: '以卸载依赖模组，否则它们可能会导致错误。',
            subtitle: '将被卸载的模组',
            uninstalling: '正在卸载 {name}',
            all: '全部卸载（推荐）',
            only: '仅卸载 {name}'
        },
        download: {
            downloading: '正在下载 {name}',
            progress: '{progress}% 完成',
            selectVersion: '选择要下载的 {name} 版本',
            recommended: '建议选择所有模组的最新版本。',
            outdated: '使用过时版本可能会导致问题。',
            need: '您需要选择一个版本',
            recommendedVersion: '{version} 是推荐的版本',
            latestVersion: '{version} 是最新版本',
            outdatedVersion: '{version} 是过时版本',
            dependencies: '下载时包含依赖',
            updateAll: '更新全部已安装的模组',
            installed: '所有已安装的模组将被更新到它们的最新版本。',
            missing: '任何缺失的依赖都将被安装。',
            following: '将下载并安装以下模组：',
            updatedTo: '{name} 将更新至：{number}',
            update: '全部更新'
        },
        installed: {
            noInstall: '看起来您没有安装任何模组',
            click: '点击左侧的在线标签，或点击',
            here: '这里',
            available: '您有 {number} 个可用的模组更新。您想要',
            updateAll: '全部更新'
        },
        onlineList: {
            pinned: '已置顶',
            pinnedTip: '在 Thunderstore 上置顶',
            deprecated: '已弃用',
            by: '由',
            donateTip: '支持模组作者',
            installedTip: '模组已安装',
            lastUpdated: '最后更新：',
            categories: '分类：',
            download: '下载',
            website: '网站'
        },
        onlineView: {
            search: '搜索',
            searchPH: '搜索一个模组',
            sort: '排序',
            sortOptions: {
                'Default': '默认',
                'Last updated': '最近更新',
                'Alphabetical': '按字母顺序',
                'Download count': '下载次数',
                'Rating': '评分'
            },
            sortDirections: {
                'Standard': '升序',
                'Reverse': '降序'
            },
            additional: '其他筛选器',
            filterCategories: '筛选分类',
            pageNotification: '使用下面的数字来更改页面',
            noMod: '未找到匹配的模组',
            notAvailable: '没有可用的模组'
        }
    },
    card: {
        tip1: '拖动以重新排序',
        tip2: '展开',
        tip3: '折叠'
    },
    settingsLoader: {
        title: '错误',
        suggestion: '建议',
        gameFailed: '这是模组管理器本身的问题。如果有更新版本的管理器可用，请尝试安装它。',
        settingsFailed: '加载本地用户设置失败。您可以使用下面的按钮重置设置，但请注意，所有游戏的设置都将丢失，且无法撤销。',
        reset: '重置设置',
        resetFailed: '重置设置失败。您仍然可以通过遵循这些',
        instructions: '指示',
        retryFailed: '本地存储的设置已重置，但这并未解决加载设置的问题。如果有更新版本的管理器可用，请尝试安装它。'
    },
    pages: {
        download: {
            title: '下载',
            subtitle: '监控下载进度',
            nothing: '您没有任何正在下载的内容。',
            click: '点击',
            here: '这里',
            download: '下载某些内容。',
            downloading: '正在下载：',
            progress: '{progress}% 完成'
        },
        error: {
            nothing: '抱歉，这里没有内容...'
        },
        gameSelection: {
            whichStore: '哪个平台管理您的游戏？',
            platform: '选择一个平台：',
            selectPlatform: '选择平台',
            instanceTypes: {
                'Game': '游戏',
                'Server': '服务器'
            },
            selection: '选择{types}',
            whichGame: '您要管理哪个游戏的模组？',
            whichServer: '您要管理哪个专用服务器的模组？',
            updateOccurred: '管理器已更新，需要进行后台工作。',
            untilCompleted: '直到工作完成之前，选择游戏的选项将被禁用。',
            searchPH: '搜索游戏',
            selectTab: '选择{types}',
            default: '设为默认'
        },
        help: {
            title: '帮助',
            subtitle: '常见问题及其潜在解决方案',
            tabs: {
                'general': '通用',
                'game won\'t start': '游戏无法启动',
                'mods not appearing': '模组未显示',
                'updating': '更新'
            },
            startTitle: '开始安装模组',
            startInfo: '转到“在线”标签，找到模组，然后点击下载。它还会下载依赖项，为您节省时间。',
            startTip: '一旦您安装了所需的模组，只需点击左上角的{strong}。',
            strong: '启动模组',
            slowTitle: '模组游戏运行缓慢/卡顿？',
            slowInfo: '这很可能是因为某个模组抛出了错误。一种解决方案是尝试禁用一半的模组，然后检查问题是否仍然存在。如果问题仍然存在，则再禁用另一半。继续这样做，直到问题解决。在卡顿的情况下，可能有优化模组可以帮助解决这个问题。',
            dedicatedTitle: '专用服务器',
            dedicatedInfo: '专用服务器并不直接通过管理器支持，但解决方案是将您的配置文件文件夹的内容手动复制到您的专用服务器文件夹中。',
            launchingTitle: '从模组管理器外部启动游戏',
            launchingInfo: '按设计，通过 Steam 启动游戏的体验将是原版的（未模组化）。您需要在平台的相关启动参数区域放置相应的参数。对于 Steam，这将位于游戏的属性中。您的当前参数将是：{code}',
            codeElse: '这些参数将在安装 BepInEx 后可用。',
            failStartTitle1: '尝试启动游戏时出现红色框',
            failStartTip1: '阅读红色框底部的建议。',
            failStartTitle2: '我被带到 Steam 商店页面',
            failStartTip2: '那是因为您没有购买该游戏。管理器仅支持正版游戏。',
            failStartTitle3: '一个文本窗口出现并立即关闭。',
            failStartTip3: '尝试在设置屏幕上运行预加载器修复。',
            failStartTip4: '如果问题持续存在，请强制退出 Steam 并关闭 Steam 启动模组。',
            modsTitle: '潜在解决方案',
            modsInfo: '最常见的问题可按照 {link} 说明解决',
            here: '以下',
            updatingTitle1: '自动更新',
            updatingTip1: '管理器在关闭时自动更新，假设有可用的更新。',
            updatingTip2: '更新在后台下载。',
            updatingTip3: '您可能会收到一个提示，以管理员身份运行 {i}。这是更新程序。',
            old: '旧卸载程序',
            updatingTip4: '如果更新过程中出现问题，请下载并运行最新的安装程序。',
            updatingTitle2: '我不想要更新',
            updatingTip5: '在 GitHub 上有一个便携式版本，不会自动更新。不过，您会被提示有更新可用。'
        },
        linux: {
            title: '在 {name} 上开始',
            subtitle: '让我们正确配置游戏',
            copied: '已复制！',
            copyTo: '复制到剪贴板',
            continue: '继续',
            tip1: '为了能够在 Linux 上启动 {game}，您必须首先正确设置您的 Steam 启动选项。',
            tip2: '这是因为 Unix 系统上 BepInEx 注入的工作方式。',
            tip3: '请将以下内容复制并粘贴到您的 {game} 启动选项中：'
        },
        manager: {
            update: '有可用的更新。',
            clickHere: '点击这里转到发布页面。',
            steamIncorrectDir: '未能设置 Steam 目录',
            steamIncorrectDirTip1: '未选择 Steam 可执行文件。',
            steamIncorrectDirTip2: '如果出现此错误，但可执行文件是正确的，请以管理员身份运行。',
            IncorrectDir: '未能设置 {name} 目录',
            IncorrectDirTip1: '可执行文件必须如下："{name}"。',
            IncorrectDirTip2: '如果出现此错误，但可执行文件是正确的，请以管理员身份运行。',
            fixingPreloader: '尝试修复预加载器问题',
            fixingPreloaderTip1: '在 Steam 验证游戏完整性之前，您将无法启动游戏。',
            fixingPreloaderTip2: 'Steam 将启动，并尝试验证 {name} 的完整性。',
            fixingPreloaderTip3: '请检查 Steam 窗口以获取验证进度。如果窗口尚未出现，请耐心等待。',
            understand: '我明白',
            showDependencyStrings: '依赖字符串列表',
            parameters: '设置自定义启动参数',
            default: '默认提供一些参数：',
            modded: '模组：',
            moddedElse: '这些参数将在安装模组加载器后可用。',
            vanilla: '原版：',
            vanillaTip: '请注意，这些参数是针对 Steam 可执行文件调用的。输入自定义启动参数时要小心。',
            placeholder: '输入参数',
            updateParameters: '更新启动参数',
            exported: '档案已导出',
            exportedTip: '您的代码：{strong} 已复制到剪贴板。只需给朋友即可！',
            done: '完成',
            locate: '定位 {0} 可执行文件',
            selectExecutable: '选择可执行文件',
            selectNew: '选择一个新文件夹来存储 {0} 数据',
            selectFolder: '选择数据文件夹',
            selectLanguage: '选择语言',
            setLanguage: '设置语言'
        },
        profiles: {
            adding: '正在{0}档案',
            addingProfileType:{
                'Create': '创建',
                'Rename': '重命名'
            },
            renaming: '此档案将独立于其他档案存储其自己的模组。',
            required: '需要档案名称',
            available: '“{0}” 可用',
            exist: '“{0}” 已在使用中，或包含无效字符',
            updateTip: '档案中的所有内容将被代码/文件中的内容覆盖。',
            selectProfile: '在下方选择一个档案：',
            create: '创建',
            updateProfile: '更新档案：{0}',
            rename: '重命名',
            updating: '您是要更新现有档案还是创建一个新档案？',
            importNew: '导入新档案',
            updateExisting: '更新现有档案',
            importingProfile: '您是要如何导入档案的？',
            updatingProfile: '您是要如何更新您的档案的？',
            fromFile: '从文件',
            fromCode: '从代码',
            enterCode: '输入档案代码',
            noCode: '您尚未输入代码',
            mayImport: '您可以导入档案',
            fixIssues: '在导入前修复问题',
            import: '导入',
            delete: '删除档案',
            deleteTip1: '这将移除此档案中安装的所有模组及其配置文件。',
            deleteTip2: '如果这是意外，请单击变暗区域或右上角的十字。',
            deleteTip3: '您确定要删除此档案吗？',
            imported: '{0}% 已导入',
            importedTip1: '由于正在下载模组，这可能需要一些时间。',
            importedTip2: '请不要关闭 {0}。',
            loadingFile: '正在加载文件',
            loadingTip: '将出现文件选择窗口。选择档案后，可能需要几分钟时间。',
            title: '选择档案',
            subtitle: '档案有助于轻松管理模组',
            back: '返回游戏选择',
            select: '选择档案',
            createNew: '创建新的',
            IU: '导入/更新',
            removeProfile: '删除'
        },
        splash: {
            notification: '游戏更新可能会破坏模组。如果游戏发布了更新，请耐心等待。',
            help: '帮助',
            about: '关于',
            FAQ: '常见问题解答',
            offline: '离线模式',
            reconnect: '尝试重新连接',
            back: '返回',
            know: '你知道吗？',
            installTip: '您可以在 {link} 上使用 “Install with Mod Manager” 按钮与 r2modman 一起使用。',
            exportProfile: '您可以在设置屏幕上使用文件或代码导出所选档案。这样很容易与朋友分享您的模组列表！',
            trouble: '遇到麻烦？',
            troubleTip: '在 Thunderstore 的 Discord 服务器中发送错误截图。如果没有解决，请随时@我。',
            r2modman: '关于 r2modman',
            created: '由 Ebkr 创建，使用 Quasar。',
            quasar: 'Quasar 提供了以下开发工具，r2modman 是基于这些工具构建的：',
            questions: [
                '我该如何开始？',
                '如何使用模组启动游戏？'
            ],
            answers: [
                '前往在线标签，下载 BepInEx 和 R2API。',
                '您必须从管理器内部启动游戏。通过 Steam 启动将无法正常工作，除非采取手动步骤。'
            ],
            starting: '正在启动 r2modman',
            initialising: '初始化中',
            checking: '正在检查更新'
        }
    }
};

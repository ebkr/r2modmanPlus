export default {
    buttons: {
        tip: 'Donar al autor del mod',
        donate: 'Donar'
    },
    config: {
        edit: {
            save: 'Guardar',
            subtitle: 'Editando archivo config',
            cancel: 'Cancelar',
            sections: 'Secciones',
            more: 'Mostrar más',
            less: 'Mostrar menos'

        },
        selection: {
            title: 'Editor de configuración',
            subtitle: 'Selecciona un archivo de configuración para editar',
            notification: 'Los archivos de configuracion son generados despues de iniciar el juego, con los mods instalados, al menos una vez.',
            search: 'Buscar',
            searchPH: 'Buscar archivos config',
            sort: 'Ordenar',
            edit: 'Editar Config',
            open: 'Abrir archivo',
            delete: 'Borrar',
            failed: 'No se pudo elimiar el archivo config',
            try: 'Intenta ejecutar {appName} como administrador.',
            SortConfigFile: {
                'Name': 'Nombre',
                'Last updated': 'Última actualización'
            },
            SortDirection: {
                'Standard': 'Estándar',
                'Reverse': 'Invertido'
            }
        }
    },
    importing: {
        title: 'Importar mod desde archivo',
        select: 'Seleccionar archivo',
        import: 'Importar mod local',
        tip: 'Selecciona un archivo zip o DLL para ser importado.',
        desc: 'Archivos zip que contienen un manifesto tendrán la misma informacion pre-rellena. Si no hay un manifesto disponible, esto tendrá que ser ingresado manualmente.',
        waiting: 'Cargando archivo. Este proceso puede tardar un minuto.',
        name: 'Nombre del mod',
        namePH: 'Introduce el nombre del mod',
        author: 'Autor',
        authorPH: 'Introduce el nombre del autor',
        modDesc: 'Descripción (opcional)',
        modDescPH: 'Incluye una descripción',
        version: 'Versión',
        major: 'Mayor',
        minor: 'Menor',
        patch: 'Patch',
        selectFileButtonLabel: 'Selecciona un archivo',
        selectFileTitle: 'Importar mod local desde archivo',
        modNameVM: 'El nombre del mod no puede estar vacío.',
        modAuthorVM: 'El autor del mod no puede estar vacío.',
        versionVMAll: 'Mayor, menor y patch solo deben incluir números.',
        versionVM: 'Mayor, menor y patch deben ser números enteros mayores que 0.',
        profileVM: 'Perfil no esta seleccionado'
    },
    mixins: {
        splash: {
            loadingText1: 'Conectando al repositorio de GitHub',
            loadingText2: 'Descargando exclusiones',
            loadingText3: 'Conectandose a Thunderstore',
            loadingText4: 'Obteniendo lista de mods desde Thunderstore',
            loadingText5: 'Almacenando la lista de mods en caché local',
            loadingText6: 'Procesando la lista de mods',
            loadingText7: 'Procesando la lista de mods desde el caché',
            heroTitle: 'No se pudo obtener la lista de mods en línea',
            loadingText8: 'Todavia puedes usar el admnistrador de mods sin conexión. Algunas funciones no estaran disponible.'
        }
    },
    modals: {
        filter: {
            title: 'Filtrar categorías de mods',
            allowNsfw: 'Permitir mods NSFW (potencialmente explícitos)',
            showDeprecated: 'Mostrar mods obsoletos',
            apply: 'Aplicar filtros',
            categoryOption: 'Selecciona una categoría',
            noSelection: 'Ninguna categoría fue seleccionada',
            leastCategories: 'Mods deben contener al menos una de estas categorías',
            allCategories: 'leastOneCategories',
            noneCategories: 'El mod no tiene ninguna de estas categorías'
        },
        profile: {
            delete: 'Borrar perfil',
            deleteTip1: 'Esta acción eliminará todos los mods y archivos de configuración instalados en este perfil.',
            deleteTip2: 'Si esto fue un accidente, haz clic en el área oscura, o la cruz ubicada en la esquina superior derecha.',
            deleteTip3: '¿Estás seguro que quieres eliminar este perfil?',
        },
        rename: {
            title: 'Cambia el nombre de un perfil',
            rename: 'Cambiar nombre',
            available: '"{0}" está disponible',
            exist: '"{0}" ya está en uso o contiene caracters inválidos',
            required: 'Nombre de perfil requerido'
        },
        error: {
            title: 'Error',
            solution: 'Sugerencia'
        },
        running: {
            launching: '{displayName} esta iniciando via Steam',
            starting: '{displayName} esta comenzando',
            close: 'Cierra este mensaje para continuar con los mods.',
            SteamStarting: 'Si este proceso se esta tardando mucho, se debe a que Steam esta iniciando.',
            patient: 'Por favor se paciente y ¡disfrute!'
        }
    },
    navigation: {
        menu: {
            modded: 'Iniciar con mods',
            vanilla: 'Iniciar vanilla',
            mods: 'Mods',
            installed: 'Instalados',
            online: 'Online',
            other: 'Otras opciones',
            editor: 'Editor de Config',
            settings: 'Ajustes',
            help: 'Ayuda',
            language: 'Seleccionar idioma'
        }
    },
    settings: {
        view: {
            title: 'Ajustes',
            subtitle: 'Opciones avanzadas para {name}: {version}',
            search: 'Buscar:',
            searchPH: 'Buscar ajustes',
            activeTab: 'Todos',
            tabs: {
                all: 'Todos',
                profile: 'Perfil',
                locations: 'Ubicaciones',
                debugging: 'Depuración',
                modpacks: 'Modpacks',
                other: 'Otros'
            },
            actions: [
                'Explorar archivo de datos',
                'Cambiar directorio de {name}',
                'Explorar archivo del perfil',
                'Cambiar directorio del archivo de datos',
                'Copiar el contenido del archivo de registro',
                'Caché de descargas', /* Alternar for toggle? */
                'Ejecutar correción del preloader',
                'Ejecutar parámetros de inicio',
                'Limpiar caché de mod',
                'Cambiar perfil',
                'Habilitar todos los mods',
                'Deshabilitar todos los mods',
                'Importar mod local',
                'Exportar perfil como archivo',
                'Exportar perfil como codigo',
                'Actualizar todos los mods',
                'Modo funky', /* Alternar for toggle? */
                'Cambiar tema',
                'Cambiar tipo tipo de vizualizacion de tarjeta',
                'Actualizar lista de mods en línea',
                'Cambiar juego',
                'Mostrar dependencias',
                'Cambiar directorio de Steam',
                'Idioma'
            ],
            descriptions: [
                'Abre el directorio donde se almacenan los mods para todos los juegos y perfiles.',
                'Cambia la ubicación del directorio de {name} que utiliza {appName}.',
                'Abre el archivo donde se almacenan los mods de el perfil actual.',
                'Cambiar el directorio donde los mods estan almacenados para todos los juegos y perfiles. El archivo no se eliminará, y los perfiles existentes no se trasladarán',
                'Copiar el contenido del archivo de registro LogOutput.log, con formato para Discord.',
                'Al descargar un mod se ignorarán los mods almacenados en el caché. Los mods seguirán almacenados en el caché.',
                'Haz clic a esto para corregir la mayoria de los problemas que tengan que ver con el preloader, o sobre ensamblados duplicados.',
                'Establecer parametros de usuario para iniciar el juego.',
                'Eliminar archivos extra almacenados en caché que no están actualmente en un perfil .',
                'Cambiar perfil.',
                'Habilitar todos los mods para el perfil actual',
                'Deshabilitar todos los mods para el perfil actual',
                'Importar un mod offline desde tu archivos.',
                'Exportar todos los mods y configuraciones como archivo.',
                'Exportar todos los mods y configuraciones como codigo.',
                'Actualizar todos los mods instalados a sus últimas versiones.',
                'Activar/desactivar el modo funky.',
                'Cambiar entre temas claro y oscuro.',
                'Cambiar entre tarjetas expandidas o colapsadas.',
                'Verificar nuevas versiones de mods.',
                'Cambiar el juego actual (reinicia el administrador de mods)',
                'Ver una lista de mods instalados con sus cadenas de version. Usado dentro las cadenas de dependencia en el documento manifest.json.',
                'Cambiar la ubicacion del directorio de Steam que utiliza {name}.',
                'Cambiar el idioma de la aplicación'
            ],
            values: [
                'Selección actual: caché esta deshabilitado',
                'Selección actual: caché esta habilitado (recomendado)',
                'Esto eliminará el archivo {name}/Managed, y verificará los documentos a traves de Steam',
                'Estos comandos se utilizan contra el ejecutablede Steam al iniciar el juego',
                'Verifica todos los perfiles y borra los mods no utilizados y limpia el cache de juegos',
                'Perfil seleccionado: {name}',
                '{0}/{1} habilitado',
                '{0}/{1} deshabilitado',
                'El archivo exportado se puede compartir con amigos para obtener un perfil identico',
                'El codigo exportado se puede compartir con amigos para obtener un perfil identico',
                '1 mod tiene una actualización disponible',
                '{0} mods tienen actualizaciones disponibles',
                'Selección actual: habilitado',
                'Selección actual: deshabilitado (por defecto)',
                'Selección actual: tema oscuro',
                'Selección actual: tema claro (por defecto)',
                'Selección actual: expandido',
                'Selección actual: collapsado (por defecto)',
                'Verificando nuevas versiones',
                'Error obteniendo mods nuevos: {0}',
                'Fecha del caché: {0}',
                'No hay información de API disponible',
                'Mostrar dependecias para {0} mod(s)',
                'Por favor configurar manualmante',
                'Archivo de registro existe',
                'Archivo de registro no existe',
                'No todos los mods se pueden instalar localmente'
            ],
            returns: [
                'Por favor configurar manualmante'
            ]
        }
    },
    views: {
        associated: {
            title: 'Mods asociados con {name}',
            dependencies: 'Dependencias',
            dependants: 'Dependientes',
            done: 'Proceso realizado'
        },
        disable: {
            title: 'Deshabilitando {name}',
            notification: 'Otros mods son dependientes de este mod. Selecciona ',
            disableAll: 'Deshabilitar todos',
            toDisable: 'para deshabilitar los mods dependientes. Esto puede causar errores.',
            subtitle: 'Mods para deshabilitar',
            disabling: 'Deshabilitando {name}',
            All: 'Deshabilitar todo (recomendado)',
            Only: 'Deshabilitar solo {name}'
        },
        localMod: {
            deprecated: 'Obsoleto',
            deprecatedTip: '\'Este mod esta obsoloto y puede causar problemas\'',
            disabled: 'Deshabilitado',
            disabledTip: '\'Este mod no se utilizará en el juego\'',
            donateTip: '\'Donar al autor del mod\'',
            updateTip: '\'Una actualización esta disponible\'',
            issueTip: '`Hay un problema con las dependencias de este mod`',
            uninstall: 'Desinstalar',
            disable: 'Deshabilitar',
            enable: 'Habilitar',
            associated: 'Asociado',
            website: 'Pagina web',
            update: 'Actualizar',
            download: 'Descargar dependencia'

        },
        search: {
            search: 'Buscar',
            searchPH: 'Buscar un mod ya instalado',
            sort: 'Ordenar',
            disabled: 'Deshabilitado',
            orderOptions: {
                'Custom': 'Busca personalizada',
                'Mod name': 'Nombre del mod',
                'Author name': 'Nombre del autor'
            },
            directionOptions: {
                'Standard': 'Estandár',
                'Reverse': 'Invertido'
            },
            disabledOptions: {
                'None': 'Ninguno',
                'Custom': 'Personalizado',
                'First': 'Primero',
                'Last': 'Último'
            }
        },
        uninstall: {
            title: 'Desinstalando {name}',
            notification: 'Otros mods son dependientes de este mod. Selecciona ',
            uninstall: 'Desinstalar todos',
            toUninstall: 'para desinstalar mods dependientes que pueden causar problemas.',
            subtitle: 'Mods para desinstalar',
            uninstalling: 'Desinstalando {name}',
            all: 'Desinstalar todos (recomendado)',
            only: 'Desinstalar solo {name}'
        },
        download: {
            downloading: 'Descargando {name}',
            progress: '{progress}% completo',
            selectVersion: 'Seleciona una versión de {name} para descargar',
            recommended: 'Se recomienda usar la última versión de todos los mods.',
            outdated: 'El uso de versiones obsoletas puede causar problemas.',
            need: 'Necesitas seleccionar una versión',
            recommendedVersion: '{version} es la versión recomendada',
            latestVersion: '{version} es la última versión',
            outdatedVersion: '{version} es una versión obsoleta',
            dependencies: 'Descargar con dependencias',
            updateAll: 'Actualizar todos los mods instalados',
            installed: 'Todos los mods instalados van a ser actualizados a sus últimas versiones.',
            missing: 'Se van a instalar todas las dependencias que falten.',
            following: 'Los siguentes mods se descargarán e instalarán:',
            updatedTo: '{name} va a ser actualizado a: {number}',
            update: 'Actualizar todos'
        },
        installed: {
            noInstall: 'Parece que no tienes ningun mod instalado',
            click: 'Haz clic en la pestaña Online a la izquierda, o haz clic',
            here: 'aqui',
            available: 'Tienes {number} actualizaciones de mods disponible. Te gustaría ',
            updateAll: 'actualizar todos'

        },
        onlineList: {
            pinned: 'Marcados',
            pinnedTip: '\'Marcados en Thunderstore\'',
            deprecated: 'Obsoleto',
            by: 'Hecho por',
            donateTip: '\'Donar al autor del mod\'',
            installedTip: '\'Mod ya esta instalado\'',
            lastUpdated: 'Última actualización:',
            categories: 'Categorias:',
            download: 'Descargar',
            website: 'Pagina web',
            potentiallyBroken: '\'Este mod puede causar problemas en tu juego y maquina\''

        },
        onlineView: {
            search: 'Buscar',
            searchPH: 'Buscar un mod',
            sort: 'Ordenar',
            sortOptions: {
                'Default': 'Predeterminado',
                'Last updated': 'Última actualización',
                'Alphabetical': 'Alfabético',
                'Download count': 'Número de descargas',
                'Rating': 'Clasificación'
            },
            sortDirections: {
                'Standard': 'Estándar',
                'Reverse': 'Invertido'
            },
            additional: 'Filtros adicionales',
            filterCategories: 'Filtrar categorias',
            pageNotification: 'Usa los números de abajo para cambiar la página',
            noMod: 'No se encontraron mods que coincidan con la búsqueda',
            notAvailable: 'No hay mods disponibles'

        }
    },
    card: {
        tip1: '\'Arrastra para reordenar\'',
        tip2: '\'Expandir\'',
        tip3: '\'Colapsar\''
    },
    settingsLoader: {
        title: 'Error',
        suggestion: 'Sugerencia',
        gameFailed: 'This is a problem with the mod manager itself. If there\'s a newer version of the manager available, try installing it.',
        settingsFailed: 'Loading of local user settings failed. You can use the button below to reset the settings, but note that all settings for all games will be lost and this can\'t be undone.',
        reset: 'Reset settings',
        resetFailed: 'Resetting of the settings failed. You can still try to reset the settings manually by following these',
        instructions: 'instructions.',
        retryFailed: 'Locally stored settings were reset, but that didn\'t solve the issue with loading the settings. If there\'s a newer version of the manager available, try installing it.'

    },
    pages: {
        download: {
            title: 'Descargas',
            subtitle: 'Monitorear el progreso de descargas',
            nothing: 'No tienes nada descargando.',
            click: 'Haz clic ',
            here: 'aqui',
            download: ' para descargar algo.',
            downloading: 'Descargando: ',
            progress: '{progress}% completo'
        },
        error: {
            nothing: 'Nada que ver aqui...'
        },
        gameSelection: {
            whichStore: 'Which store manages your game?',
            platform: 'Seleciona un aplataforma:',
            selectPlatform: 'Seleciona una plataforma',
            instanceTypes: {
                'Game': 'Juego',
                'Server': 'Server'
            },
            selection: '{types} selection',
            whichGame: 'Which game are you managing your mods for?',
            whichServer: 'Which dedicated server are you managing your mods for?',
            updateOccurred: 'An update to the manager has occurred and needs to do background work.',
            untilCompleted: 'The options to select a game are disabled until the work has completed.',
            searchPH: 'Search for a game',
            selectTab: 'Select {types}',
            default: 'Set as default'
        },
        help: {
            title: 'Help',
            subtitle: 'Common problems and their potential solutions',
            tabs: {
                'general': 'General',
                'game won\'t start': 'Game won\'t start',
                'mods not appearing': 'Mods not appearing',
                'updating': 'Updating'
            },
            startTitle: 'Getting started with installing mods',
            startInfo: 'Go to the "Online" tab, find a mod, and hit download.It\'ll also download the dependencies saving you time.',
            startTip: 'Once you\'ve installed the mods you\'d like, just click {strong} in the top left.',
            strong: 'Start modded',
            slowTitle: 'Slow game with mods / stuttering?',
            slowInfo: 'This is likely due to a mod throwing errors. One solution is to attempt to disable half of your mods and check to see if the issue persists.{br}If the issue still remains then disable another half. Continue doing this until the issue is solved.{br}{br}In the case of stuttering there may be optimization mods to help with this.',
            dedicatedTitle: 'Dedicated servers',
            dedicatedInfo: 'Dedicated servers aren\'t directly supported through the manager however a solution is to instead copy the contents of your profile folder into your dedicated server folder yourself.',
            launchingTitle: 'Launching the game from outside the mod manager',
            launchingInfo: 'By design your experience by starting the game through Steam will be vanilla (un-modded).{br}{br}You will need to place the corresponding argument in your platform\'s relevant launch parameter area.{br}For Steam, this would be located in the game\'s properties.{br}{br}Your current argument would be:{code}',
            dedicatedServers: 'Dedicated servers',
            dedicatedServersInfo: 'Dedicated servers aren\'t directly supported through the manager however a solution is to insteadcopy the contents of your profile folder into your dedicated server folder yourself.',
            codeElse: 'These parameters will be available after installing BepInEx.',
            failStartTitle1: 'A red box appears when I try to start the game',
            failStartTip1: 'Read the suggestion at the bottom of the red box.',
            failStartTitle2: 'I\'m taken to the Steam store page',
            failStartTip2: 'That\'s because you don\'t legally own the game. The manager only supports legal copies.',
            failStartTitle3: 'A text window appears and closes immediately.',
            failStartTip3: 'Try running the preloader fix on the Settings screen.',
            failStartTip4: 'If it persists, force exit Steam and start modded with Steam closed.',
            modsTitle: 'Potential solutions',
            modsInfo: 'The most common issues are solved by following the instructions exactly as listed {link}',
            here: 'here',
            updatingTitle1: 'Auto-updates',
            updatingTip1: 'The manager updates automatically on close assuming an update is available.',
            updatingTip2: 'Updates are downloaded in the background.',
            updatingTip3: 'You may receive a prompt to run {i} as an admin. This is the updater.',
            old: 'old_uninstaller',
            updatingTip4: 'If a problem occurs with an update, download and run the latest installer.',
            updatingTitle2: 'I don\'t want updates',
            updatingTip5: 'On GitHub there is a portable version that doesn\'t auto update. You are however prompted that an update is available.'
        },
        linux: {
            title: 'Getting started on {name}',
            subtitle: 'Let\'s configure the game properly',
            copied: 'Copied!',
            copyTo: 'Copy to clipboard',
            continue: 'Continue',
            tip1: 'To be able to launch {game} on Linux, you must first setup your Steam launch options correctly.',
            tip2: 'This needs to be done because of how the BepInEx injection works on Unix systems.',
            tip3: 'Please copy and paste the following to your {game} launch options:'
        },
        manager: {
            update: 'An update is available.',
            clickHere: 'Click here to go to the release page.',
            steamIncorrectDir: 'Failed to set the Steam directory',
            steamIncorrectDirTip1: 'The steam executable was not selected.',
            steamIncorrectDirTip2: 'If this error has appeared but the executable is correct, please run as administrator.',
            IncorrectDir: 'Failed to set the {name} directory',
            IncorrectDirTip1: 'The executable must be either of the following: "{name}".',
            IncorrectDirTip2: 'If this error has appeared but the executable is correct, please run as administrator.',
            fixingPreloader: 'Attempting to fix preloader issues',
            fixingPreloaderTip1: 'You will not not be able to launch the game until Steam has verified the integrity of the game.',
            fixingPreloaderTip2: 'Steam will be started, and will attempt to verify the integrity of {name}.',
            fixingPreloaderTip3: 'Please check the Steam window for validation progress. If the window has not yet appeared, please be patient.',
            understand: 'I understand',
            showDependencyStrings: 'Dependency string list',
            parameters: 'Set custom launch parameters',
            default: 'Some parameters are provided by default:',
            modded: 'Modded:',
            moddedElse: 'These parameters will be available after installing a mod loader.',
            vanilla: 'Vanilla:',
            vanillaTip: 'Please note that these are called against the Steam executable. Be careful when entering custom launch parameters.',
            placeholder: 'Enter parameters',
            updateParameters: 'Update launch parameters',
            exported: 'Profile exported',
            exportedTip: 'Your code: {strong} has been copied to your clipboard. Just give it to a friend!',
            done: 'Done',
            locate: 'Locate {0} Executable',
            selectExecutable: 'Select Executable',
            selectNew: 'Select a new folder to store {0} data',
            selectFolder: 'Select Data Folder',
            selectLanguage: 'Select Language',
            setLanguage: 'Set Language'
        },
        profiles: {
            adding: '{0} a profile',
            addingProfileType:{
                'Create': 'Create',
                'Rename': 'Rename'
            },
            renaming: 'This profile will store its own mods independently from other profiles.',
            required: 'Profile name required',
            available: '"{0}" is available',
            exist: '"{0}" is either already in use, or contains invalid characters',
            updateTip: 'All contents of the profile will be overwritten with the contents of the code/file.',
            selectProfile: 'Select a profile below:',
            create: 'Create',
            updateProfile: 'Update profile: {0}',
            rename: 'Rename',
            updating: 'Are you going to be updating an existing profile or creating a new one?',
            importNew: 'Import new profile',
            updateExisting: 'Update existing profile',
            importingProfile: 'How are you importing a profile?',
            updatingProfile: 'How are you updating your profile?',
            fromFile: 'From file',
            fromCode: 'From code',
            enterCode: 'Enter the profile code',
            noCode: 'You haven\'t entered a code',
            mayImport: 'You may import the profile',
            fixIssues: 'Fix issues before importing',
            import: 'Import',
            imported: '{0}% imported',
            importedTip1: 'This may take a while, as mods are being downloaded.',
            importedTip2: 'Please do not close {0}.',
            loadingFile: 'Loading file',
            loadingTip: 'A file selection window will appear. Once a profile has been selected it may take a few moments.',
            title: 'Profile selection',
            subtitle: 'Profiles help to organise mods easily',
            back: 'Back to game selection',
            select: 'Select profile',
            createNew: 'Create new',
            IU: 'Import / Update',
            removeProfile: 'Delete'
        },
        splash: {
            notification: 'Game updates may break mods. If a new update has been released, please be patient.',
            help: 'Help',
            about: 'About',
            FAQ: 'FAQ',
            offline: 'Continue offline',
            reconnect: 'Try to reconnect',
            back: 'Go back',
            know: 'Did you know?',
            installTip: 'You can use the "Install with Mod Manager" button on {link} with r2modman.',
            exportProfile: 'You can export the selected profile from the settings screen as either a file, or a code. This makes it easy to share your mod list with friends!',
            trouble: 'Having trouble?',
            troubleTip: 'Send a screenshot of the error in the Thunderstore modding discord server. Feel free to ping me if it doesn\'t get resolved.',
            r2modman: 'About r2modman',
            created: 'It\'s created by Ebkr, using Quasar.',
            quasar: 'Quasar provides the following development tools that r2modman is built upon:',
            questions: [
                'How do I get started?',
                'Starting the game with mods'
            ],
            answers: ['Head on over to the online tab, and download BepInEx and R2API.',
                'You have to start the game from within the manager. Starting through Steam will not work without taking manual steps.'],
            starting: 'Starting r2modman',
            initialising: 'Initialising',
            checking: 'Checking for updates'
        }
    }
};

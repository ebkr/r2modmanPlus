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
        gameFailed: 'Este es un problema con el administrador de mods. Si hay una versión mas reciente del administrador disponible, intenta instalarla.',
        settingsFailed: 'Hubo un fallo al cargar la configuración del usuario local. Puedes usar el boton de abajop para restablecer la configuración, ten en cuenta que todas las configuraciones de todos los juegos se perderán y esto no se puede deshacer.',
        reset: 'Reiniciar ajustes',
        resetFailed: 'El reinicio de los ajustes falló. Puedes intentar restablecer los ajustes manualmente siguiendos estas',
        instructions: 'instrucciones.',
        retryFailed: 'Los ajustes almacenados localmente se restableció, pero esto no resolvió el problema con la carga de configuración. Si hay una versión mas reciente del administrador disponible, intenta instalarla.'

    },
    pages: {
        download: {
            title: 'Descargas',
            subtitle: 'Monitorear el progreso de descargas',
            nothing: 'No tienes nada descargandose.',
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
            whichStore: '¿Que tienda gestiona tu juego?',
            platform: 'Seleciona una plataforma:',
            selectPlatform: 'Seleciona una plataforma',
            instanceTypes: {
                'Game': 'Juego',
                'Server': 'Servidor'
            },
            selection: 'Selección de {types}',
            whichGame: '¿Para qué juego estas gestionando tus mods?',
            whichServer: '¿Para qué servidor dedicado estás gestionando tus mods?',
            updateOccurred: 'Ha ocurrido una actualización en el administrador y necesita realizar trabajo en segundo plano.',
            untilCompleted: 'Las opciones para selcccionar un juego están deshabilitadas hasta que el trabajo se haya completado.',
            searchPH: 'Buscar un juego',
            selectTab: 'Selecionar {types}',
            default: 'Establecer como predeterminado'
        },
        help: {
            title: 'Ayuda',
            subtitle: 'Problemas comunes y sus posibles soluciones',
            tabs: {
                'general': 'General',
                'game won\'t start': 'El juego no inicia',
                'mods not appearing': 'Los mods no aparecen',
                'updating': 'Actualización'
            },
            startTitle: 'Comenzando con la instalación de mods',
            startInfo: 'Ve a la pestaña "Online", encuentra un mod y haz clic en "Descargar". También de van a descargar las dependencias, ahorrándote tiempo.',
            startTip: 'Una vez hayas instalado los mods que deseas, simplemente haz clic en {strong} en la parte superior izquierda.',
            strong: 'Iniciar con mods',
            slowTitle: '¿El juego esta lento o se queda pegado?',
            slowInfo: 'Esto probablemente de deba a un mod que esta generando errores. Una posible solución es deshabilitar la mitad de tus mods y verificar si el problema persiste.{br} Si el problema persiste, desavtiva la otra mitad. Sigue haciendo esto hasta que el problema se resuelva.{br}{br}Si el juego se pone lento/pegado busca mods de optimización que ayuden con dicho problema.',
            dedicatedTitle: 'Servidores dedicados',
            dedicatedInfo: 'Los servidores dedicados noson directamente compatibles con el administrador de mods: sin embargo, una solución es copiar el contenido del archivo de perfil y pegarlo en el archivo del servidor dedicado manualmente.',
            launchingTitle: 'Iniciando el juego fuera del administrador de mods',
            launchingInfo: 'Por diseño, tu experiencia al iniciar el juego a través de Steam será vanilla (sin mods).{br}{br}Necesitarás colocar el argumento correspondiente en el área de parámetros de inicio relevante de tu plataforma.{br}Para Steam, esto se encuentra en las propiedades del juego.{br}{br}Tu argumento actual sería:{code}',
            dedicatedServers: 'Servidores dedicados',
            dedicatedServersInfo: 'Los servidores dedicados noson directamente compatibles con el administrador de mods: sin embargo, una solución es copiar el contenido del archivo de perfil y pegarlo en el archivo del servidor dedicado manualmente.',
            codeElse: 'Estos parámetros estarán disponibles después de instalar BepInEx.',
            failStartTitle1: 'Aparece in ciadro rojo cuando intento iniciar el juego',
            failStartTip1: 'Lee la sugerencia en la parte inferior del cuadro rojo.',
            failStartTitle2: 'Me lleva a la página del juego en Steam',
            failStartTip2: 'Es porque no posees legalmente el juego. El administrador de mods solo soporta copias legales.',
            failStartTitle3: 'Una ventana de texto aparace y se cierra rapidamenté.',
            failStartTip3: 'Intenta ejecuarla solución del preloader en la pantalla de Ajustes.',
            failStartTip4: 'Si la falla persiste, fuerza el cierre de Steam y haz clic al boton "Iniciar con mods" con Steam cerrado.',
            modsTitle: 'Posibles soluciones',
            modsInfo: 'Los problemas más comunes se resuelven seguiendo estas instrucciones exactamente como se indican {link}',
            here: 'aquí',
            updatingTitle1: 'Actualizaciones automáticas',
            updatingTip1: 'El administrador de mods se actualiza automáticamente al cerrar, asumiendo que hay una actualización disponible .',
            updatingTip2: 'Las actualizaciones des descargan en segundo plano.',
            updatingTip3: 'Es posible que recibas un aviso para ejecutar {i} como admin. Este es el actualizador.',
            old: 'old_uninstaller',
            updatingTip4: 'Si ocurre un problema con una actualizacion, descarga y ejecuta el instalador más reciente.',
            updatingTitle2: 'No quiero actualizar el administrador de mods',
            updatingTip5: 'Hay una version portátil en Github que no se actualiza automáticamente. Sin embargo, se te notificará que hay una actualizacióm disponible.'
        },
        linux: {
            title: 'Iniciando en {name}',
            subtitle: 'Configuremos el juego correctamente',
            copied: 'Copiado!',
            copyTo: 'Copiar al portapapeles',
            continue: 'Continuar',
            tip1: 'Para poder iniciar {game} en Linux, primero debes configurar correctamente las ociones de inicio de Steam.',
            tip2: 'Esto es necesario debido a cómo funciona la inyección de BepInEx en sistemas Unix.',
            tip3: 'Por favor, copia y pega lo siguiente en las opciones de inicio de {game}:'
        },
        manager: {
            update: 'Hay una actualización disponible.',
            clickHere: 'Haz clic aquí para ir a la página de la versión.',
            steamIncorrectDir: 'Error estableciendo el directorio de Steam',
            steamIncorrectDirTip1: 'No se seleccionó el ejecutable de Steam.',
            steamIncorrectDirTip2: 'Si este error ha aparecido pero el ejecutable es correcto, por favor ejecuta como administrador.',
            IncorrectDir: 'Error al establecer el directorio de {name}',
            IncorrectDirTip1: 'El ejecutable debe ser uno de los siguientes: "{name}".',
            IncorrectDirTip2: 'Si este error ha aparecido pero el ejecutable es correcto, por favor ejecuta como administrador.',
            fixingPreloader: 'Intentando solucionar problemas en el preloader',
            fixingPreloaderTip1: 'No podrás iniciar el juego hasta que Steam haya verificado la integridad del juego.',
            fixingPreloaderTip2: 'Steam se iniciará e intentará verificar la integridad de {name}.',
            fixingPreloaderTip3: 'Por favor, revisa la ventana de Steam para ver el progreso de la validación. Si la ventana aún no ha aparecido, por favor ten paciencia.',
            understand: 'Entiendo',
            showDependencyStrings: 'Lista de dependencias',
            parameters: 'Establecer parámetros de inicio personalizados',
            default: 'Algunos parámetros se proporcionan por defecto:',
            modded: 'Con mods:',
            moddedElse: 'Estos parámetros estarán disponibles después de instalar un cargador de mods.',
            vanilla: 'Sin mods:',
            vanillaTip: 'Ten en cuenta que estos se llaman contra el ejecutable de Steam. Ten cuidado al ingresar parámetros de inicio personalizados.',
            placeholder: 'Ingresa parámetros',
            updateParameters: 'Actualizar parámetros de inicio',
            exported: 'Perfil exportado',
            exportedTip: 'Tu código: {strong} ha sido copiado al portapapeles. ¡Solo dáselo a un amigo!',
            done: 'Hecho',
            locate: 'Ubicar el ejecutable de {0}',
            selectExecutable: 'Seleccionar ejecutable',
            selectNew: 'Selecciona una nueva carpeta para almacenar los datos de {0}',
            selectFolder: 'Seleccionar carpeta de datos',
            selectLanguage: 'Seleccionar idioma',
            setLanguage: 'Establecer idioma'
        },
        profiles: {
            adding: '{0} un perfil',
            addingProfileType: {
                Create: 'Crear',
                Rename: 'Renombrar'
            },
            renaming: 'Este perfil almacenará sus propios mods independientemente de otros perfiles.',
            required: 'Nombre del perfil requerido',
            available: '"{0}" está disponible',
            exist: '"{0}" ya está en uso o contiene caracteres inválidos',
            updateTip: 'Todo el contenido del perfil será sobrescrito con el contenido del código/archivo.',
            selectProfile: 'Selecciona un perfil a continuación:',
            create: 'Crear',
            updateProfile: 'Actualizar perfil: {0}',
            rename: 'Renombrar',
            updating: '¿Vas a actualizar un perfil existente o crear uno nuevo?',
            importNew: 'Importar nuevo perfil',
            updateExisting: 'Actualizar perfil existente',
            importingProfile: '¿Cómo estás importando un perfil?',
            updatingProfile: '¿Cómo estás actualizando tu perfil?',
            fromFile: 'Desde archivo',
            fromCode: 'Desde código',
            enterCode: 'Ingresa el código del perfil',
            noCode: 'No has ingresado un código',
            mayImport: 'Puedes importar el perfil',
            fixIssues: 'Soluciona los problemas antes de importar',
            import: 'Importar',
            imported: '{0}% importado',
            importedTip1: 'Esto puede tardar un tiempo, ya que los mods se están descargando.',
            importedTip2: 'Por favor, no cierres {0}.',
            loadingFile: 'Cargando archivo',
            loadingTip: 'Aparecerá una ventana de selección de archivos. Una vez que se haya seleccionado un perfil, puede tardar unos momentos.',
            title: 'Selección de perfil',
            subtitle: 'Los perfiles ayudan a organizar los mods fácilmente',
            back: 'Volver a la selección de juego',
            select: 'Seleccionar perfil',
            createNew: 'Crear nuevo',
            IU: 'Importar / Actualizar',
            removeProfile: 'Eliminar'
        },
        splash: {
            notification: 'Las actualizaciones del juego pueden romper los mods. Si se ha lanzado una nueva actualización, por favor ten paciencia.',
            help: 'Ayuda',
            about: 'Acerca de',
            FAQ: 'FAQ',
            offline: 'Continuar sin conexión',
            reconnect: 'Intentar reconectar',
            back: 'Volver',
            know: '¿Sabías?',
            installTip: 'Puedes usar el botón "Instalar con el Administrador de Mods" en {link} con r2modman.',
            exportProfile: 'Puedes exportar el perfil seleccionado desde la pantalla de configuración como un archivo o un código. ¡Esto facilita compartir tu lista de mods con amigos!',
            trouble: '¿Tienes problemas?',
            troubleTip: 'Envía una captura de pantalla del error en el servidor de Discord de modding de Thunderstore. No dudes en mencionarme si no se resuelve.',
            r2modman: 'Acerca de r2modman',
            created: 'Está creado por Ebkr, usando Quasar.',
            quasar: 'Quasar proporciona las siguientes herramientas de desarrollo sobre las cuales r2modman está construido:',
            questions: [
                '¿Cómo empiezo?',
                'Iniciar el juego con mods'
            ],
            answers: [
                'Ve a la pestaña Online y descarga BepInEx y R2API.',
                'Debes iniciar el juego desde dentro del administrador. Iniciar a través de Steam no funcionará sin realizar pasos manuales.'],
            starting: 'Iniciando r2modman',
            initialising: 'Inicializando',
            checking: 'Verificando actualizaciones'
        }
    }
};

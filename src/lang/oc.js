export default {
  route: {
    dashboard: 'Tablèu de bòrd',
    introduction: 'Introduccion',
    documentation: 'Documentacion',
    guide: 'Guida',
    permission: 'Autorizacions',
    pagePermission: 'Pagina d’autorizacion',
    directivePermission: 'Politica d’autorizacion',
    icons: 'Icònas',
    components: 'Compausants',
    componentIndex: 'Introduccion',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Mandadís d’avatar',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: 'Mixin',
    backToTop: 'BackToTop',
    dragDialog: 'Drag Dialog',
    dragSelect: 'Drag Select',
    dragKanban: 'Drag Kanban',
    charts: 'Charts',
    keyboardChart: 'Keyboard Chart',
    lineChart: 'Line Chart',
    mixChart: 'Mix Chart',
    example: 'Exemple',
    nested: 'Rotas imbricadas',
    menu1: 'Menú 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menú 2',
    Table: 'Tablèu',
    dynamicTable: 'Tablèu dinamic',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Tablèu complèx',
    treeTable: 'Arborescéncia',
    customTreeTable: 'Arborescéncia personalizada',
    tab: 'Onglet',
    form: 'Formulari',
    createArticle: 'Crear un article',
    editArticle: 'Modificar l’article',
    articleList: 'Lista d’articles',
    errorPages: 'Paginas d’error',
    page401: '401',
    page404: '404',
    errorLog: 'Jornal d’error',
    excel: 'Excel',
    exportExcel: 'Exportacion Excel',
    selectExcel: 'Exportar los seleccionats',
    uploadExcel: 'Importacion Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Exportacion Zip',
    theme: 'Tèma',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'Ligams extèrnes',
    users: 'Utilizaires'
  },
  navbar: {
    logOut: 'Desconnexion',
    dashboard: 'Tablèu de bòrd',
    github: 'Github',
    theme: 'Tèma',
    size: 'Talha totala'
  },
  login: {
    title: 'Formulari de connexion',
    logIn: 'Se connectar',
    username: 'Nom d’utilizaire',
    password: 'Senhal',
    any: 'qual que siá',
    thirdparty: 'O se connectar amb',
    thirdpartyTips: 'Pòt pas èsser simulat en local, doncas montatz vòstra pròpria simulacion ! ! !'
  },
  documentation: {
    documentation: 'Documentacion',
    github: 'Repertòri Github'
  },
  permission: {
    roles: 'Vòstres ròtles',
    switchRoles: 'Cambiar de ròtle',
    tips: 'Dins qualques cases es pas de bon far d’utilizar v-permission, coma element d’onglet compausant, el-table-column o d’autres renduts dom asincròns que pòdon pas que foncionar amb un parametratge manual de v-if.'
  },
  guide: {
    description: 'La pagina de guida es utila pel monde que dintran dins lo projècte pel primièr còp. Podètz presentar en un mot las foncionalitats del projèctes. La demo es fondada sus ',
    button: 'Mostrar la guida'
  },
  components: {
    documentation: 'Documentacion',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/element-ui/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Bandièra fixa, triada per òrdre de bandièra',
    dynamicTips2: 'Bandièra pas fixa, triada per òrdre de clic',
    dragTips1: 'L’òrdre per defaut',
    dragTips2: 'L’òrdre aprèp lisar-depausar',
    title: 'Títol',
    importance: 'Imp',
    type: 'Tipe',
    remark: 'Remarca',
    search: 'Recercar',
    add: 'Ajustar',
    export: 'Exportar',
    reviewer: 'examinator',
    id: 'ID',
    date: 'Data',
    author: 'Autor',
    readings: 'Lecturas',
    status: 'Estatuts',
    actions: 'Accions',
    edit: 'Modificar',
    publish: 'Publicar',
    draft: 'Ensag',
    delete: 'Suprimir',
    cancel: 'Anullar',
    confirm: 'Confirmar'
  },
  errorLog: {
    tips: 'Mercés de clicar l’icòna del babau amont a man drecha',
    description: 'Ara que lo sistèma de gestion es coma un spa, melhora l’experiéncia dels utilizaire mas aumenta tanben lo risc de problèmas sus la pagina, una pichona negligéncia pòt menar a un blocatge complèt de la pagina. Urosament Vue fornís de manièras per gerir las excepcions, trobar las errors o senhalar las excepcions.',
    documentation: 'Presentacion del document'
  },
  excel: {
    export: 'Exportar',
    selectedExport: 'Exportar los elements seleccionats',
    placeholder: 'Mercés de picar lo nom de fichièr (per defaut excel-list)'
  },
  zip: {
    export: 'Exportar',
    placeholder: 'Mercés de picar lo nom de fichièr (per defaut file)'
  },
  pdf: {
    tips: 'Aquí utilizam window.print() per prepausar lo telecargament de pdf.'
  },
  theme: {
    change: 'Cambiar lo tèma',
    documentation: 'Documentacion dels tèmas',
    tips: 'Astúcia : es diferent del theme-pick de la barra de navigacion, i a dos metòdes de personalizacion, caduna amb un biais de far diferent. Referiscam a la documentacion per mai de detalhs.'
  },
  tagsView: {
    refresh: 'Actualizar',
    close: 'Tampar',
    closeOthers: 'Tampar los autres',
    closeAll: 'Los tampar totes'
  }
}

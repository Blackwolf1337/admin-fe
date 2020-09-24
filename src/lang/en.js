export default {
  route: {
    dashboard: 'Dashboard',
    introduction: 'Introduction',
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    componentIndex: 'Introduction',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
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
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    Table: 'Table',
    dynamicTable: 'Dynamic Table',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Complex Table',
    treeTable: 'Tree Table',
    customTreeTable: 'Custom TreeTable',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    users: 'Users',
    reports: 'Reports',
    invites: 'Invites',
    statuses: 'Statuses',
    settings: 'Settings',
    moderationLog: 'Moderation Log',
    mediaProxyCache: 'MediaProxy Cache',
    'emoji-packs': 'Emoji packs'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Log in',
    logInViaPleromaFE: 'Log in via PleromaFE',
    username: 'username@host',
    password: 'password',
    omitHostname: 'omit hostname if Pleroma is located on this domain',
    errorMessage: 'Username must contain username and host, e.g. john@pleroma.social',
    any: 'any',
    thirdparty: 'Or connect with',
    pleromaFELoginFailed: 'Failed to login via PleromaFE, please login with username/password',
    pleromaFELoginSucceed: 'Logged in via PleromaFE'
  },
  mediaProxyCache: {
    mediaProxyCache: 'MediaProxy Cache',
    ban: 'Ban',
    url: 'URL',
    evict: 'Evict',
    evictedMessage: 'This URL was evicted',
    actions: 'Actions',
    remove: 'Remove from Cachex',
    evictObjectsHeader: 'Evict object from the MediaProxy cache',
    listBannedUrlsHeader: 'List of all banned MediaProxy URLs',
    multipleInput: 'You can enter a single URL or several comma separated links',
    removeSelected: 'Remove Selected',
    enable: 'Enable',
    invalidationAndMediaProxy: 'MediaProxy and Invalidation to evict and ban MediaProxy objects',
    confirmEnablingMediaProxy: 'Are you sure you want to enable Media Proxy and Media Cache object Invalidation?',
    enableMediaProxySuccessMessage: 'Media Proxy and Media Cache object Invalidation were enabled'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases it is not suitable to use v-permission, such as element Tab component or el-table-column and other asynchronous rendering dom cases which can only be achieved by manually setting the v-if.'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/element-ui/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    unfollow: 'Unfollow'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading pdf.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  users: {
    users: 'Users',
    localUsersOnly: 'Local users only',
    search: 'Search',
    id: 'ID',
    name: 'Name',
    status: 'Status',
    local: 'Local',
    external: 'External',
    deactivated: 'Deactivated',
    active: 'Active',
    unapproved: 'Pending',
    unconfirmed: 'Unconfirmed',
    actions: 'Actions',
    activate: 'Activate',
    deactivate: 'Deactivate',
    admin: 'Admin',
    moderator: 'Moderator',
    moderation: 'Moderation',
    revokeAdmin: 'Revoke Admin',
    grantAdmin: 'Grant Admin',
    revokeModerator: 'Revoke Moderator',
    grantModerator: 'Grant Moderator',
    activateAccount: 'Activate Account',
    activateAccounts: 'Activate Accounts',
    deactivateAccount: 'Deactivate Account',
    deactivateAccounts: 'Deactivate Accounts',
    deleteAccount: 'Delete Account',
    deleteAccounts: 'Delete Accounts',
    forceNsfw: 'Force posts to be NSFW',
    stripMedia: 'Force posts to not have media',
    forceUnlisted: 'Force posts to be unlisted',
    sandbox: 'Force posts to be followers-only',
    disableRemoteSubscription: 'Disallow following user from remote instances',
    disableRemoteSubscriptionForMultiple: 'Disallow following users from remote instances',
    disableAnySubscription: 'Disallow following user at all',
    disableAnySubscriptionForMultiple: 'Disallow following users at all',
    requirePasswordReset: 'Require password reset on next login',
    disableMfa: 'Disable multi-factor authentication',
    selectUsers: 'Select users to apply actions to multiple users',
    moderateUser: 'Moderate user',
    moderateUsers: 'Moderate multiple users',
    createAccount: 'Create new account',
    apply: 'Apply',
    remove: 'Remove',
    grantRightConfirmation: 'Are you sure you want to grant {right} rights to all selected users?',
    revokeRightConfirmation: 'Are you sure you want to revoke {right} rights from all selected users?',
    activateMultipleUsersConfirmation: 'Are you sure you want to activate accounts of all selected users?',
    deactivateMultipleUsersConfirmation: 'Are you sure you want to deactivate accounts of all selected users?',
    deleteUserConfirmation: 'Are you sure you want to delete this account? This action cannot be undone.',
    rejectAccountConfirmation: 'Are you sure you want to reject this account? This account will be deleted and it cannot be undone.',
    deleteMultipleUsersConfirmation: 'Are you sure you want to delete accounts of all selected users? This action cannot be undone.',
    addTagForMultipleUsersConfirmation: 'Are you sure you want to apply tag to all selected users?',
    removeTagFromMultipleUsersConfirmation: 'Are you sure you want to remove tag from all selected users?',
    requirePasswordResetConfirmation: 'Are you sure you want to require password reset for all selected users?',
    approveAccountsConfirmation: 'Are you sure you want to approve accounts for all selected users?',
    rejectAccountsConfirmation: 'Are you sure you want to reject accounts for all selected users? These accounts will be deleted and it cannot be undone.',
    confirmAccountsConfirmation: 'Are you sure you want to confirm emails for all selected users?',
    resendEmailConfirmation: 'Are you sure you want to resend confirmation email for all selected users?',
    mailerMustBeEnabled: 'To require user\'s password reset you must enable mailer.',
    ok: 'Okay',
    completed: 'Completed',
    cancel: 'Cancel',
    canceled: 'Canceled',
    username: 'Username',
    email: 'E-mail',
    password: 'Password',
    create: 'Create',
    submitFormError: 'There are invalid values in the form. Please fix them before continuing.',
    emptyEmailError: 'Please input the e-mail',
    invalidEmailError: 'Please input valid e-mail',
    emptyPasswordError: 'Please input the password',
    emptyNicknameError: 'Please input the username',
    invalidNicknameError: 'Username can include "a-z", "A-Z" and "0-9" characters',
    getPasswordResetToken: 'Get password reset token',
    passwordResetTokenCreated: 'Password reset token was created',
    accountCreated: 'New account was created!',
    approveAccount: 'Approve account',
    approveAccounts: 'Approve accounts',
    unapprovedAccount: 'User account is pending approval',
    unconfirmedEmail: 'User didn\'t confirm the email',
    confirmAccount: 'Confirm account',
    confirmAccounts: 'Confirm accounts',
    rejectAccount: 'Reject account',
    rejectAccounts: 'Reject accounts',
    resendConfirmation: 'Resend confirmation email',
    invalidAccount: 'This account has invalid nickname and can\'t be modified',
    invalidNickname: 'invalid nickname',
    passwordResetTokenGenerated: 'Password reset token was generated:',
    linkToResetPassword: 'You can also use this link to reset password:',
    registrationReason: 'Registration Reason',
    service: 'Service',
    person: 'Person',
    enableTagPolicy: 'Enable MRF TagPolicy to manage user tags',
    confirmEnablingTagPolicy: 'Are you sure you want to add TagPolicy to the list of enabled MRF policies?',
    enableTagPolicySuccessMessage: 'MRF TagPolicy was enabled'
  },
  statuses: {
    statuses: 'Statuses',
    instanceFilter: 'Instance filter',
    loadMore: 'Load more',
    noInstances: 'No other instances found',
    onlyLocalStatuses: 'Show only local statuses',
    showPrivateStatuses: 'Show private statuses',
    direct: 'Direct',
    private: 'Private',
    public: 'Public',
    unlisted: 'Unlisted',
    openStatusInInstance: 'Open status in instance'
  },
  userProfile: {
    tags: 'Tags',
    moderator: 'Moderator',
    admin: 'Admin',
    local: 'Local',
    external: 'External',
    accountType: 'Account Type',
    actorType: 'Actor Type',
    nickname: 'Nickname',
    recentStatuses: 'Recent Statuses',
    roles: 'Roles',
    active: 'Active',
    status: 'Status',
    reason: 'Registration Reason',
    deactivated: 'Deactivated',
    pending: 'Pending',
    noStatuses: 'No statuses to show',
    openAccountInInstance: 'Open account in instance',
    securitySettings: {
      email: 'Email',
      password: 'Password',
      securitySettings: 'Security settings',
      passwordChangeWarning1: 'Setting a new password will cause the user to be signed out from any client they have used before.',
      passwordChangeWarning2: 'When the user signs in with this password, they will be asked to set a new one.',
      passwordLengthNotice: 'Make sure it\'s at least {minLength} characters long.',
      inputNewEmail: 'Input new email',
      inputNewPassword: 'Input new password',
      passwordUpdated: 'The password has been updated',
      emailUpdated: 'The email has been updated',
      success: 'Success',
      submit: 'Submit',
      close: 'Close'
    }
  },
  usersFilter: {
    inputPlaceholder: 'Select filter',
    byAccountType: 'By account type',
    local: 'Local',
    external: 'External',
    byStatus: 'By status',
    active: 'Active',
    pending: 'Pending Approval',
    deactivated: 'Deactivated',
    unconfirmed: 'Unconfirmed'
  },
  reports: {
    reports: 'Reports',
    report: 'Report',
    reply: 'Reply',
    from: 'From',
    showNotes: 'Show notes',
    newNote: 'New note',
    submit: 'Submit',
    confirmMsg: 'Are you sure you want to delete this note?',
    delete: 'Delete',
    cancel: 'Cancel',
    deleteCompleted: 'Delete comleted',
    deleteCanceled: 'Delete canceled',
    noNotes: 'No notes to display',
    changeState: "Change report's state",
    changeAllReports: 'Change all reports',
    changeScope: 'Change scope',
    moderateUser: 'Moderate user',
    resolve: 'Resolve',
    reopen: 'Reopen',
    close: 'Close',
    resolveAll: 'Resolve all',
    reopenAll: 'Reopen all',
    closeAll: 'Close all',
    addSensitive: 'Add Sensitive flag',
    removeSensitive: 'Remove Sensitive flag',
    public: 'Make status public',
    private: 'Make status private',
    unlisted: 'Make status unlisted',
    sensitive: 'Sensitive',
    deleteStatus: 'Delete status',
    reportOn: 'Report on',
    reportsOn: 'Reports on',
    id: 'ID',
    account: 'Account',
    actor: 'Actor',
    actors: 'Actors',
    content: 'Content',
    reportedStatus: 'Reported status',
    statusDeleted: 'This status has been deleted',
    leaveNote: 'Leave a note',
    postNote: 'Send',
    deleteNote: 'Delete',
    notFound: 'account not found'
  },
  reportsFilter: {
    inputPlaceholder: 'Select filter',
    open: 'Open',
    closed: 'Closed',
    resolved: 'Resolved'
  },
  moderationLog: {
    moderationLog: 'Moderation Log'
  },
  settings: {
    settings: 'Settings',
    instance: 'Instance',
    upload: 'Upload',
    mailer: 'Mailer',
    linkFormatter: 'Link Formatter',
    logger: 'Logger',
    activityPub: 'ActivityPub',
    auth: 'Authentication',
    captcha: 'Captcha',
    frontend: 'Frontend',
    http: 'HTTP',
    mrf: 'MRF',
    mediaProxy: 'Media Proxy',
    metadata: 'Metadata',
    gopher: 'Gopher',
    jobQueue: 'Job queue',
    webPush: 'Web push encryption',
    esshd: 'BBS / SSH access',
    rateLimiters: 'Rate limiters',
    other: 'Other',
    relays: 'Relays',
    follow: 'Follow',
    followRelay: 'Follow new relay',
    followedBack: 'Followed Back',
    instanceUrl: 'Instance URL',
    success: 'Settings changed successfully!',
    description: 'Description',
    removeFromDB: 'Remove setting from the DB',
    successfullyDownloaded: 'Successfully downloaded',
    successfullyImported: 'Successfully imported',
    nowNewPacksToImport: 'No new packs to import',
    successfullyUpdated: 'Successfully updated',
    metadatLowerCase: 'metadata',
    files: 'files',
    successfullyRemoved: 'Setting removed successfully!',
    seeDocs: 'See Documentation',
    instanceReboot: 'Reboot Instance',
    restartApp: 'You must restart the instance to apply settings',
    restartSuccess: 'Instance rebooted successfully!',
    removeSettingConfirmation: 'Are you sure you want to remove this setting\'s value from the database?',
    changeImage: 'Change image',
    uploadImage: 'Upload image',
    remove: 'Remove',
    instancePanel: 'Instance Panel Document',
    termsOfServices: 'Terms of Service'
  },
  invites: {
    inviteTokens: 'Invite tokens',
    createInviteToken: 'Generate invite token',
    pickDate: 'Pick a date',
    maxUse: 'Max use',
    expiresAt: 'Expires at',
    tokenCreated: 'Invite token was created',
    token: 'Token',
    inviteLink: 'Invite link',
    uses: 'Uses',
    used: 'Used',
    cancel: 'Cancel',
    create: 'Create',
    revoke: 'Revoke',
    id: 'ID',
    actions: 'Actions',
    active: 'Active',
    inviteUserViaEmail: 'Invite user via email',
    sendRegistration: 'Send registration invite via email',
    email: 'Email',
    name: 'Name',
    emptyEmailError: 'Please input the e-mail',
    invalidEmailError: 'Please input valid e-mail',
    emailSent: 'Invite was sent',
    submitFormError: 'There are invalid values in the form. Please fix them before continuing.',
    inviteViaEmailAlert: 'To send invite via email make sure to enable `invites_enabled` and disable `registrations_open`'
  },
  emoji: {
    emojiPacks: 'Emoji packs',
    reloaded: 'Emoji reloaded successfully!',
    refreshed: 'Emoji refreshed successfully!',
    importEmojiTooltip: 'Importing from the filesystem will scan the directories and import those without pack.json but with emoji.txt or without neither',
    reloadEmoji: 'Reload emoji',
    importPacks: 'Import packs from the server filesystem',
    localPacks: 'Local packs',
    refreshLocalPacks: 'Refresh local packs',
    createLocalPack: 'Create a new local pack',
    remotePacks: 'Remote packs',
    remoteInstanceAddress: 'Remote instance address',
    refreshRemote: 'Refresh remote packs',
    sharePack: 'Share pack',
    required: 'required',
    homepage: 'Homepage',
    description: 'Description',
    packs: 'Packs',
    license: 'License',
    shortcode: 'Shortcode',
    fallbackSrc: 'Fallback source',
    fallbackSrcSha: 'Fallback source SHA',
    saveMetadata: 'Save metadata',
    deletePack: 'Delete pack',
    downloadPack: 'Download pack',
    downloadPackArchive: 'Download pack archive',
    addNewEmoji: 'Add new emoji to the pack',
    manageEmoji: 'Manage existing emoji',
    thisWillDownload: 'This will download the',
    downloadToCurrentInstance: 'pack to the current instance under the name',
    canBeChanged: 'can be changed below',
    willBeUsable: 'It will then be usable and shareable from the current instance',
    downloadAsOptional: 'Download as (optional)',
    downloadSharedPack: 'Download shared pack to current instance',
    downloadSharedPackMobile: 'Download pack to instance',
    optional: 'optional',
    uploadFile: 'Upload a file',
    url: 'URL',
    clickToUpload: 'Click to upload',
    upload: 'Upload',
    customFilename: 'Custom filename',
    customFilenameDesc: 'Custom file name (optional)',
    file: 'File',
    localPack: 'Local pack',
    leaveEmptyShortcode: 'leave empty to use the same shortcode',
    leaveEmptyFilename: 'leave empty to use the same filename',
    update: 'Update',
    remove: 'Remove',
    selectLocalPack: 'Select the local pack to copy to',
    specifyShortcode: 'Specify a custom shortcode',
    specifyFilename: 'Specify a custom filename',
    copy: 'Copy',
    copyToLocalPack: 'Copy to local pack',
    emptyPack: 'This emoji pack is empty'
  }
}

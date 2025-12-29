// Translation files for Arabic and French

export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  // Common
  common: {
    logout: string;
    welcome: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    actions: string;
    status: string;
    active: string;
    inactive: string;
    close: string;
  };

  // Admin Dashboard
  admin: {
    title: string;
    subtitle: string;
    overview: string;
    userManagement: string;
    totalUsers: string;
    activeUsers: string;
    administrators: string;
    regularUsers: string;
    recentActivity: string;
    youLoggedIn: string;
  };

  // User Management
  userMgmt: {
    title: string;
    subtitle: string;
    addUser: string;
    editUser: string;
    createUser: string;
    updateUser: string;
    deleteUser: string;
    deleteConfirm: string;
    name: string;
    email: string;
    password: string;
    role: string;
    administrator: string;
    employee: string;
    createdAt: string;
    noUsers: string;
    searchPlaceholder: string;
    usersFound: string;
    passwordLeaveBlank: string;
  };

  // User Dashboard
  user: {
    title: string;
    subtitle: string;
    loggedInAs: string;
    loggedInAt: string;
    financialTransactions: string;
    reportsAnalytics: string;
    clientManagement: string;
    invoicesBilling: string;
    timeTracking: string;
    documentManagement: string;
    openModule: string;
  };

  // Login
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    signingIn: string;
    noAccount: string;
    signUp: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
    invalidCredentials: string;
    accountDeactivated: string;
  };

  // Budget Management
  budget: {
    title: string;
    subtitle: string;
    communes: string;
    budgets: string;
    recettes: string;
    depenses: string;
    selectCommune: string;
    noCommune: string;
    budgetData: string;
    futureEvents: string;
    addYear: string;
    validateBalance: string;
    exportCSV: string;
    exportExcel: string;
    import: string;
    template: string;
    balanceValid: string;
    balanceInvalid: string;
    year: string;
    budgetVote: string;
    reel: string;
    rubrique: string;
    code: string;
    actions: string;
    addEvent: string;
    editEvent: string;
    newEvent: string;
    description: string;
    impactEstime: string;
    type: string;
    deleteConfirm: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      logout: 'Logout',
      welcome: 'Welcome',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      close: 'Close',
    },
    admin: {
      title: 'Municipal Budget Data Management Platform (PGDBC)',
      subtitle: 'User Management System',
      overview: 'Overview',
      userManagement: 'User Management',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      administrators: 'Administrators',
      regularUsers: 'Regular Users',
      recentActivity: 'Recent Activity',
      youLoggedIn: 'You logged in',
    },
    userMgmt: {
      title: 'User Management',
      subtitle: 'Create and manage platform users',
      addUser: 'Add New User',
      editUser: 'Edit User',
      createUser: 'Create New User',
      updateUser: 'Update User',
      deleteUser: 'Delete User',
      deleteConfirm: 'Are you sure you want to delete this user?',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      role: 'Role',
      administrator: 'Administrator',
      employee: 'Employee',
      createdAt: 'Created',
      noUsers: 'No users found',
      searchPlaceholder: 'Search users by name, email, or role...',
      usersFound: 'users found',
      passwordLeaveBlank: 'leave blank to keep current',
    },
    user: {
      title: 'Municipal Budget Data Management Platform (PGDBC)',
      subtitle: 'Manage your municipal budget data',
      loggedInAs: "You're logged in as",
      loggedInAt: 'Logged in at',
      financialTransactions: 'Financial Transactions',
      reportsAnalytics: 'Reports & Analytics',
      clientManagement: 'Client Management',
      invoicesBilling: 'Invoices & Billing',
      timeTracking: 'Time Tracking',
      documentManagement: 'Document Management',
      openModule: 'Open Module',
    },
    login: {
      title: 'Municipal Budget Data Management Platform (PGDBC)',
      subtitle: 'Sign in to continue',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      invalidCredentials: 'Invalid email or password',
      accountDeactivated: 'Your account has been deactivated',
    },
    budget: {
      title: 'Budget Management',
      subtitle: 'Enter and manage municipal budgets',
      communes: 'Municipalities',
      budgets: 'Budgets',
      recettes: 'Revenues',
      depenses: 'Expenses',
      selectCommune: 'Select a municipality',
      noCommune: 'No municipality available',
      budgetData: 'Budget Data',
      futureEvents: 'Future Events',
      addYear: 'Add year',
      validateBalance: 'Validate balance',
      exportCSV: 'Export CSV',
      exportExcel: 'Export Excel',
      import: 'Import',
      template: 'CSV Template',
      balanceValid: 'Balance respected',
      balanceInvalid: 'Balance not respected',
      year: 'Year',
      budgetVote: 'Voted budget',
      reel: 'Actual',
      rubrique: 'Category',
      code: 'Code',
      actions: 'Actions',
      addEvent: 'Add event',
      editEvent: 'Edit event',
      newEvent: 'New event',
      description: 'Description',
      impactEstime: 'Estimated impact (DT)',
      type: 'Type',
      deleteConfirm: 'Are you sure you want to delete?',
    },
  },
  fr: {
    common: {
      logout: 'Déconnexion',
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      search: 'Rechercher',
      filter: 'Filtrer',
      actions: 'Actions',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      close: 'Fermer',
    },
    admin: {
      title: 'Plateforme de Gestion des Données Budgétaires Communales (PGDBC)',
      subtitle: 'Système de gestion des utilisateurs',
      overview: 'Vue d\'ensemble',
      userManagement: 'Gestion des utilisateurs',
      totalUsers: 'Total des utilisateurs',
      activeUsers: 'Utilisateurs actifs',
      administrators: 'Administrateurs',
      regularUsers: 'Utilisateurs réguliers',
      recentActivity: 'Activité récente',
      youLoggedIn: 'Vous vous êtes connecté',
    },
    userMgmt: {
      title: 'Gestion des utilisateurs',
      subtitle: 'Créer et gérer les utilisateurs de la plateforme',
      addUser: 'Ajouter un nouvel utilisateur',
      editUser: 'Modifier l\'utilisateur',
      createUser: 'Créer un nouvel utilisateur',
      updateUser: 'Mettre à jour l\'utilisateur',
      deleteUser: 'Supprimer l\'utilisateur',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
      name: 'Nom complet',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      role: 'Rôle',
      administrator: 'Administrateur',
      employee: 'Employé',
      createdAt: 'Créé le',
      noUsers: 'Aucun utilisateur trouvé',
      searchPlaceholder: 'Rechercher des utilisateurs par nom, e-mail ou rôle...',
      usersFound: 'utilisateurs trouvés',
      passwordLeaveBlank: 'laisser vide pour garder le mot de passe actuel',
    },
    user: {
      title: 'Plateforme de Gestion des Données Budgétaires Communales (PGDBC)',
      subtitle: 'Gérez vos données budgétaires municipales',
      loggedInAs: 'Vous êtes connecté en tant que',
      loggedInAt: 'Connecté à',
      financialTransactions: 'Transactions financières',
      reportsAnalytics: 'Rapports et analyses',
      clientManagement: 'Gestion des clients',
      invoicesBilling: 'Factures et facturation',
      timeTracking: 'Suivi du temps',
      documentManagement: 'Gestion des documents',
      openModule: 'Ouvrir le module',
    },
    login: {
      title: 'Plateforme de Gestion des Données Budgétaires Communales (PGDBC)',
      subtitle: 'Connectez-vous pour continuer',
      emailLabel: 'Adresse e-mail (Email)',
      passwordLabel: 'Mot de passe (Password)',
      emailPlaceholder: 'vous@exemple.com',
      passwordPlaceholder: 'Entrez votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié?',
      signIn: 'Se connecter',
      signingIn: 'Connexion...',
      noAccount: "Vous n'avez pas de compte?",
      signUp: "S'inscrire",
      emailRequired: "L'e-mail est requis",
      emailInvalid: 'Veuillez entrer une adresse e-mail valide',
      passwordRequired: 'Le mot de passe est requis',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      invalidCredentials: 'E-mail ou mot de passe invalide',
      accountDeactivated: 'Votre compte a été désactivé',
    },
    budget: {
      title: 'Gestion Budgétaire',
      subtitle: 'Saisie et gestion des budgets municipaux',
      communes: 'Communes',
      budgets: 'Budgets',
      recettes: 'Recettes',
      depenses: 'Dépenses',
      selectCommune: 'Sélectionner une commune',
      noCommune: 'Aucune commune disponible',
      budgetData: 'Données Budgétaires',
      futureEvents: 'Événements Futurs',
      addYear: 'Ajouter année',
      validateBalance: 'Valider équilibre',
      exportCSV: 'Export CSV',
      exportExcel: 'Export Excel',
      import: 'Import',
      template: 'Template CSV',
      balanceValid: 'Équilibre respecté',
      balanceInvalid: 'Équilibre non respecté',
      year: 'Année',
      budgetVote: 'Budget voté',
      reel: 'Réel',
      rubrique: 'Rubrique',
      code: 'Code',
      actions: 'Actions',
      addEvent: 'Ajouter un événement',
      editEvent: "Modifier l'événement",
      newEvent: 'Nouvel événement',
      description: 'Description',
      impactEstime: 'Impact estimé (DT)',
      type: 'Type',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ?',
    },
  },
  ar: {
    common: {
      logout: 'تسجيل الخروج',
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      create: 'إنشاء',
      search: 'بحث',
      filter: 'تصفية',
      actions: 'الإجراءات',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      close: 'إغلاق',
    },
    admin: {
      title: 'منصة إدارة المعطيات الميزانية البلدية',
      subtitle: 'نظام إدارة المستخدمين',
      overview: 'نظرة عامة',
      userManagement: 'إدارة المستخدمين',
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمون النشطون',
      administrators: 'المسؤولون',
      regularUsers: 'المستخدمون العاديون',
      recentActivity: 'النشاط الأخير',
      youLoggedIn: 'قمت بتسجيل الدخول',
    },
    userMgmt: {
      title: 'إدارة المستخدمين',
      subtitle: 'إنشاء وإدارة مستخدمي المنصة',
      addUser: 'إضافة مستخدم جديد',
      editUser: 'تعديل المستخدم',
      createUser: 'إنشاء مستخدم جديد',
      updateUser: 'تحديث المستخدم',
      deleteUser: 'حذف المستخدم',
      deleteConfirm: 'هل أنت متأكد من أنك تريد حذف هذا المستخدم؟',
      name: 'الاسم الكامل',
      email: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      role: 'الدور',
      administrator: 'مسؤول',
      employee: 'موظف',
      createdAt: 'تم الإنشاء',
      noUsers: 'لم يتم العثور على مستخدمين',
      searchPlaceholder: 'البحث عن المستخدمين بالاسم أو البريد الإلكتروني أو الدور...',
      usersFound: 'مستخدم تم العثور عليه',
      passwordLeaveBlank: 'اتركه فارغاً للاحتفاظ بكلمة المرور الحالية',
    },
    user: {
      title: 'منصة إدارة المعطيات الميزانية البلدية',
      subtitle: 'إدارة بياناتك الميزانية البلدية',
      loggedInAs: 'أنت مسجل الدخول كـ',
      loggedInAt: 'تم تسجيل الدخول في',
      financialTransactions: 'المعاملات المالية',
      reportsAnalytics: 'التقارير والتحليلات',
      clientManagement: 'إدارة العملاء',
      invoicesBilling: 'الفواتير والفوترة',
      timeTracking: 'تتبع الوقت',
      documentManagement: 'إدارة المستندات',
      openModule: 'فتح الوحدة',
    },
    login: {
      title: 'منصة إدارة المعطيات الميزانية البلدية',
      subtitle: 'قم بتسجيل الدخول للمتابعة',
      emailLabel: 'البريد الإلكتروني (Adresse e-mail)',
      passwordLabel: 'كلمة المرور (Mot de passe)',
      emailPlaceholder: 'vous@exemple.com',
      passwordPlaceholder: 'أدخل كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور?',
      signIn: 'تسجيل الدخول',
      signingIn: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب?',
      signUp: 'إنشاء حساب',
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
      passwordRequired: 'كلمة المرور مطلوبة',
      passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      accountDeactivated: 'تم تعطيل حسابك',
    },
    budget: {
      title: 'إدارة الميزانية',
      subtitle: 'إدخال وإدارة الميزانيات البلدية',
      communes: 'البلديات',
      budgets: 'الميزانيات',
      recettes: 'الإيرادات',
      depenses: 'النفقات',
      selectCommune: 'اختر بلدية',
      noCommune: 'لا توجد بلدية متاحة',
      budgetData: 'بيانات الميزانية',
      futureEvents: 'الأحداث المستقبلية',
      addYear: 'إضافة سنة',
      validateBalance: 'التحقق من التوازن',
      exportCSV: 'تصدير CSV',
      exportExcel: 'تصدير Excel',
      import: 'استيراد',
      template: 'قالب CSV',
      balanceValid: 'التوازن محترم',
      balanceInvalid: 'التوازن غير محترم',
      year: 'السنة',
      budgetVote: 'الميزانية المصوتة',
      reel: 'الفعلية',
      rubrique: 'الفئة',
      code: 'الرمز',
      actions: 'الإجراءات',
      addEvent: 'إضافة حدث',
      editEvent: 'تعديل الحدث',
      newEvent: 'حدث جديد',
      description: 'الوصف',
      impactEstime: 'التأثير المقدر (د.ت)',
      type: 'النوع',
      deleteConfirm: 'هل أنت متأكد من أنك تريد الحذف؟',
    },
  },
};

export default translations;


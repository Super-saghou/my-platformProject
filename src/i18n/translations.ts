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
      title: 'Admin Platform',
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
      title: 'Accounting Platform',
      subtitle: 'Manage your accounting tasks',
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
      title: 'Plateforme Admin',
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
      title: 'Plateforme comptable',
      subtitle: 'Gérez vos tâches comptables',
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
      title: 'Plateforme',
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
      title: 'منصة الإدارة',
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
      title: 'منصة المحاسبة',
      subtitle: 'إدارة مهامك المحاسبية',
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
      title: 'المنصة',
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
  },
};

export default translations;


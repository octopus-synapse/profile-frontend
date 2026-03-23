/**
 * English translations - Onboarding
 */

export const onboarding = {
  // Shell
  'onboarding.shell.progress': 'Setup progress',
  'onboarding.shell.stepsCompleted': '{completed} of {total} required steps completed',
  'onboarding.shell.optional': 'Optional',
  'onboarding.shell.stepOf': 'Step {current} of {total}',
  'onboarding.shell.goToStep': 'Go to {step}',

  // Welcome Step
  'onboarding.welcome.eyebrow': 'Welcome',
  'onboarding.welcome.title': 'Welcome to PATCH',
  'onboarding.welcome.description':
    "We'll guide you through a focused setup to build a polished, recruiter-ready profile.",
  'onboarding.welcome.featureTechTitle': 'Built for tech talent',
  'onboarding.welcome.featureTechDescription':
    'A clean profile structure designed for modern resumes and hiring flows.',
  'onboarding.welcome.featureFastTitle': 'Fast to complete',
  'onboarding.welcome.featureFastDescription':
    'Finish the essentials now and refine details later from your dashboard.',
  'onboarding.welcome.featureControlTitle': 'You stay in control',
  'onboarding.welcome.featureControlDescription':
    'Your information stays editable, portable, and ready for export at any time.',
  'onboarding.welcome.infoText':
    'PATCH will compile your career into the optimal format for each opportunity.',
  'onboarding.welcome.requiredLabel': 'Required:',
  'onboarding.welcome.requiredItems':
    'Personal info, username, professional profile, and theme.',
  'onboarding.welcome.optionalLabel': 'Optional:',
  'onboarding.welcome.optionalItems': 'Experience, education, and languages.',
  'onboarding.welcome.startSetup': 'start setup',

  // Username Step
  'onboarding.username.title': 'Choose your username',
  'onboarding.username.description':
    'This creates your public profile URL, so keep it simple and memorable.',
  'onboarding.username.preview': 'username',
  'onboarding.username.hint':
    'Use 3 to 30 lowercase letters, numbers, or underscores.',
  'onboarding.username.label': 'Username',
  'onboarding.username.tooltip':
    'Your unique identifier on PATCH. This cannot be changed later, so choose wisely!',
  'onboarding.username.placeholder': 'johndoe',
  'onboarding.username.notAuthenticated': 'Not authenticated. Please sign in again.',
  'onboarding.username.sessionExpired': 'Session expired. Please refresh the page.',
  'onboarding.username.tooManyRequests': 'Too many requests. Wait a moment.',
  'onboarding.username.couldNotVerify': 'Could not verify. Try again.',
  'onboarding.username.connectionError': 'Connection error. Check your internet.',
  'onboarding.username.loadingSession': 'Loading session...',
  'onboarding.username.checkingAvailability': 'Checking availability...',
  'onboarding.username.available': 'Username is available!',
  'onboarding.username.taken': 'This username is already taken',
  'onboarding.username.retry': 'Retry',

  // Username Checklist
  'onboarding.username.checklistTitle': 'Username checklist',
  'onboarding.username.minLength': 'At least {min} characters',
  'onboarding.username.maxLength': 'Maximum {max} characters',
  'onboarding.username.validChars': 'Letters, numbers, and underscores only',
  'onboarding.username.mustBeUnique': 'Must be unique',

  // Personal Info Step
  'onboarding.personalInfo.title': 'Personal information',
  'onboarding.personalInfo.description':
    'Add the core details recruiters need to identify and contact you.',
  'onboarding.personalInfo.requiredNote': 'Required fields are marked with',
  'onboarding.personalInfo.fullNameLabel': 'Full name',
  'onboarding.personalInfo.fullNamePlaceholder': 'John Doe',
  'onboarding.personalInfo.nameRequired': 'Name is required',
  'onboarding.personalInfo.minChars': 'Must be at least {min} characters',
  'onboarding.personalInfo.maxChars': 'Must be at most {max} characters',
  'onboarding.personalInfo.emailLabel': 'Email',
  'onboarding.personalInfo.emailPlaceholder': 'dev@example.com',
  'onboarding.personalInfo.emailRequired': 'Email is required',
  'onboarding.personalInfo.invalidEmail': 'Invalid email format',
  'onboarding.personalInfo.phoneLabel': 'Phone',
  'onboarding.personalInfo.optional': '(optional)',
  'onboarding.personalInfo.invalidPhone': 'Invalid phone format',
  'onboarding.personalInfo.locationLabel': 'Location',
  'onboarding.personalInfo.locationPlaceholder': 'São Paulo, BR',

  // Professional Profile Step
  'onboarding.professionalProfile.title': 'Professional profile',
  'onboarding.professionalProfile.description':
    'Summarize your role, your strengths, and the links that support your profile.',
  'onboarding.professionalProfile.jobTitleLabel': 'Job title',
  'onboarding.professionalProfile.jobTitlePlaceholder': 'Senior Software Engineer',
  'onboarding.professionalProfile.jobTitleMinLength':
    'Job title must be at least 2 characters',
  'onboarding.professionalProfile.summaryLabel': 'Summary',
  'onboarding.professionalProfile.summaryPlaceholder':
    'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure...',
  'onboarding.professionalProfile.summaryMinLength':
    'Summary must be at least {min} characters',
  'onboarding.professionalProfile.summaryMaxLength':
    'Summary must be less than {max} characters',
  'onboarding.professionalProfile.minimumChars': 'Minimum {min} characters',
  'onboarding.professionalProfile.socialLinksHint':
    'Social links are optional, but they help make your profile more credible.',
  'onboarding.professionalProfile.linkedinLabel': 'LinkedIn',
  'onboarding.professionalProfile.linkedinPlaceholder':
    'https://linkedin.com/in/username',
  'onboarding.professionalProfile.invalidUrl': 'Invalid URL format',
  'onboarding.professionalProfile.githubLabel': 'GitHub',
  'onboarding.professionalProfile.githubPlaceholder': 'username',
  'onboarding.professionalProfile.githubHint':
    'Enter your username only (e.g. octocat)',
  'onboarding.professionalProfile.websiteLabel': 'Website',
  'onboarding.professionalProfile.websitePlaceholder': 'https://yoursite.dev',

  // Template Step
  'onboarding.template.title': 'Choose your theme',
  'onboarding.template.description':
    'Pick a visual direction for your resume. You can still change it later.',
  'onboarding.template.professionalTemplate': 'Professional template',
  'onboarding.template.professionalDescription':
    'Clean, modern layout optimized for ATS systems and recruiters. You can change this later in settings.',
  'onboarding.template.selected': 'Selected: {name}',
  'onboarding.template.paletteOcean': 'Deep blue tones',
  'onboarding.template.paletteForest': 'Natural green',
  'onboarding.template.paletteSunset': 'Warm orange',
  'onboarding.template.paletteLavender': 'Soft purple',
  'onboarding.template.paletteRose': 'Elegant pink',
  'onboarding.template.paletteMonochrome': 'Classic black & white',
  'onboarding.template.paletteMidnight': 'Dark slate',
  'onboarding.template.paletteCoral': 'Vibrant coral',

  // Review Step
  'onboarding.review.eyebrow': 'Final step',
  'onboarding.review.title': 'Review and submit',
  'onboarding.review.description':
    'Confirm the essentials before we create your profile.',
  'onboarding.review.paletteLabel': 'Palette: {scheme}',
  'onboarding.review.noneListed': 'None listed',
  'onboarding.review.itemCount': '{count} item(s)',
  'onboarding.review.incompleteError':
    'Please complete all required sections before submitting',
  'onboarding.review.usernameRequired':
    'Username is required. Please go back to the username step.',
  'onboarding.review.genericError': 'Something went wrong. Please try again.',
  'onboarding.review.createProfile': 'create profile',
  'onboarding.review.profilePreview': 'Profile preview',
  'onboarding.review.experienceLabel': 'Experience',
  'onboarding.review.skillsLabel': 'Skills',
  'onboarding.review.summaryLabel': 'Summary',
  'onboarding.review.moreItems': '+{count} more',

  // Generic Section Step
  'onboarding.section.select': 'Select...',
  'onboarding.section.noItemsYet': 'No items added yet',
  'onboarding.section.itemAdded': '{count} item added',
  'onboarding.section.itemsAdded': '{count} items added',
  'onboarding.section.continue': 'Continue',

  // Complete Step
  'onboarding.complete.welcomeUser': 'Welcome, {name}! 🎉',
  'onboarding.complete.successMessage':
    'Your professional profile has been created successfully',
  'onboarding.complete.redirectCountdown':
    'Redirecting to your resume in {count} second{suffix}...',
  'onboarding.complete.whatsNext': "What's next?",
  'onboarding.complete.nextCustomize': 'View and customize your resume',
  'onboarding.complete.nextExport': 'Export to PDF or DOCX',
  'onboarding.complete.nextShare': 'Share your public profile link',
  'onboarding.complete.nextSettings': 'Add more details anytime in settings',
  'onboarding.complete.viewResume': 'View My Resume',
  'onboarding.complete.goToDashboard': 'Go to Dashboard',
  'onboarding.complete.helpPrefix': 'Need help? Check our ',
  'onboarding.complete.helpDocs': 'documentation',
  'onboarding.complete.helpOr': ' or ',
  'onboarding.complete.helpSupport': 'contact support',
} as const;

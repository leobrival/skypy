import vine from '@vinejs/vine'

// Use cases available for selection
export const USE_CASES = [
  'short_urls',
  'qr_codes',
  'landing_pages',
  'sms_communications',
  'digital_marketing',
  'analytics',
  'api_development',
  'other',
] as const

// Industries available for selection
export const INDUSTRIES = [
  'technology',
  'marketing',
  'ecommerce',
  'education',
  'healthcare',
  'finance',
  'media',
  'nonprofit',
  'government',
  'other',
] as const

// First actions available
export const FIRST_ACTIONS = [
  'create_short_link',
  'create_qr_code',
  'create_landing_page',
  'setup_custom_domain',
] as const

// Step 1: About you
export const onboardingStep1Validator = vine.compile(
  vine.object({
    displayName: vine.string().minLength(1).maxLength(100),
    useCases: vine.array(vine.enum(USE_CASES)).minLength(1),
  }),
)

// Step 2: Your work
export const onboardingStep2Validator = vine.compile(
  vine.object({
    industry: vine.enum(INDUSTRIES),
  }),
)

// Step 3: First action (optional, just for tracking)
export const onboardingStep3Validator = vine.compile(
  vine.object({
    firstAction: vine.enum(FIRST_ACTIONS),
  }),
)

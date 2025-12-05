import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import {
  FIRST_ACTIONS,
  INDUSTRIES,
  onboardingStep1Validator,
  onboardingStep2Validator,
  onboardingStep3Validator,
  USE_CASES,
} from '#validators/onboarding_validator'

export default class OnboardingController {
  /**
   * Show step 1: About you
   */
  async showStep1({ inertia, auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    // If onboarding is completed, redirect to dashboard
    if (user.onboardingCompleted) {
      return response.redirect('/dashboard')
    }

    return inertia.render('onboarding/step1', {
      user: {
        displayName: user.displayName || user.username,
        useCases: user.useCases || [],
      },
      useCaseOptions: USE_CASES,
    })
  }

  /**
   * Handle step 1 submission
   */
  async handleStep1({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const data = await request.validateUsing(onboardingStep1Validator)

    user.displayName = data.displayName
    user.useCases = data.useCases as string[]
    await user.save()

    return response.redirect('/onboarding/step2')
  }

  /**
   * Show step 2: Your work
   */
  async showStep2({ inertia, auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    // If onboarding is completed, redirect to dashboard
    if (user.onboardingCompleted) {
      return response.redirect('/dashboard')
    }

    // If step 1 not completed, redirect back
    if (!user.displayName || !user.useCases?.length) {
      return response.redirect('/onboarding/step1')
    }

    return inertia.render('onboarding/step2', {
      user: {
        industry: user.industry || '',
      },
      industryOptions: INDUSTRIES,
    })
  }

  /**
   * Handle step 2 submission
   */
  async handleStep2({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const data = await request.validateUsing(onboardingStep2Validator)

    user.industry = data.industry
    await user.save()

    return response.redirect('/onboarding/step3')
  }

  /**
   * Show step 3: Get started
   */
  async showStep3({ inertia, auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    // If onboarding is completed, redirect to dashboard
    if (user.onboardingCompleted) {
      return response.redirect('/dashboard')
    }

    // If previous steps not completed, redirect back
    if (!user.displayName || !user.useCases?.length) {
      return response.redirect('/onboarding/step1')
    }
    if (!user.industry) {
      return response.redirect('/onboarding/step2')
    }

    return inertia.render('onboarding/step3', {
      firstActionOptions: FIRST_ACTIONS,
    })
  }

  /**
   * Handle step 3 submission and complete onboarding
   */
  async handleStep3({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const data = await request.validateUsing(onboardingStep3Validator)

    user.firstAction = data.firstAction
    user.onboardingCompleted = true
    user.onboardingCompletedAt = DateTime.now()
    await user.save()

    // Redirect based on first action choice
    switch (data.firstAction) {
      case 'create_short_link':
        return response.redirect('/links/create')
      case 'create_qr_code':
        return response.redirect('/qr/generate')
      case 'create_landing_page':
        return response.redirect('/pages/create')
      case 'setup_custom_domain':
        return response.redirect('/dashboard') // TODO: Add domains page
      default:
        return response.redirect('/dashboard')
    }
  }

  /**
   * Skip onboarding (user clicked "Remind me later" or "Skip")
   */
  async skip({ response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    // Mark onboarding as completed even if skipped
    user.onboardingCompleted = true
    user.onboardingCompletedAt = DateTime.now()
    await user.save()

    return response.redirect('/dashboard')
  }
}

export interface OnboardingFormData {
  accountType: 'individual' | 'business'
  fullName: string
  workEmail: string
  phoneNumber: string
  primaryLocation: string
  productUpdates: boolean
  onboardingSupport: boolean
  agreeTerms: boolean
}

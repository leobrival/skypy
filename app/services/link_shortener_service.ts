import { nanoid } from 'nanoid'
import Link from '#models/link'

export default class LinkShortenerService {
  /**
   * Generate a unique short code for a link
   * Retries if collision occurs (very unlikely with nanoid)
   */
  async generateShortCode(length: number = 8): Promise<string> {
    const code = nanoid(length)
    const exists = await Link.findBy('shortCode', code)

    if (exists) {
      // Collision detected, retry with longer code
      return this.generateShortCode(length + 1)
    }

    return code
  }

  /**
   * Generate a custom short code if available
   */
  async generateCustomShortCode(customCode: string): Promise<string | null> {
    const exists = await Link.findBy('shortCode', customCode)

    if (exists) {
      return null // Custom code already taken
    }

    return customCode
  }
}

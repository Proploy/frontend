export interface NewsletterEmailParams {
  email: string
}

export interface ProductInquiryEmailParams {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  message?: string
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://proploy.app'

/**
 * Render responsive HTML email for Newsletter / Get Started subscriptions.
 */
export function renderNewsletterWelcomeEmail({ email }: NewsletterEmailParams): {
  subject: string
  html: string
} {
  const catalogUrl = `${getBaseUrl()}/products`
  const subject = 'Welcome to Proploy — AI Software Procurement & Expert Rollouts'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #181d27;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e9eaeb; overflow: hidden; box-shadow: 0 4px 12px rgba(10,13,18,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0a0d12; padding: 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #155eef; color: #ffffff; font-weight: 700; font-size: 16px; padding: 6px 14px; border-radius: 8px; letter-spacing: -0.3px;">
                      PROPLOY
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; line-height: 1.3;">
                      Welcome to the future of software procurement.
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #181d27;">
                Thanks for joining Proploy! You're now on the list for curated AI software benchmarks, vetted implementation expert guides, and enterprise spend optimization playbooks.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; color: #535862;">
                We've verified your email address (<strong style="color: #181d27;">${email}</strong>).
              </p>

              <!-- Value Props Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #155eef;">
                      What to expect from Proploy:
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #414651; font-size: 14px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;"><strong>Curated AI Software Marketplace:</strong> Verified SaaS tools matched to your company size & industry.</li>
                      <li style="margin-bottom: 8px;"><strong>Vetted Expert Marketplace:</strong> Certified implementation partners who guarantee execution.</li>
                      <li><strong>Pre-negotiated ROI:</strong> Transparent pricing, contract visibility, and speed to value.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #155eef;">
                    <a href="${catalogUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #155eef;">
                      Explore Software Marketplace &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #e9eaeb; text-align: center; font-size: 13px; color: #717680; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">
                You received this email because you subscribed to updates on <a href="${getBaseUrl()}" style="color: #155eef; text-decoration: none;">Proploy</a>.
              </p>
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} Proploy Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return { subject, html }
}

/**
 * Render responsive HTML email for Product Inquiry / Missing Product requests.
 */
export function renderProductInquiryEmail({
  firstName,
  lastName,
  email,
  phone,
  message,
}: ProductInquiryEmailParams): {
  subject: string
  html: string
} {
  const catalogUrl = `${getBaseUrl()}/products`
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Valued Customer'
  const subject = `Proploy Inquiry Received — Specialist Assigned for ${fullName}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #181d27;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e9eaeb; overflow: hidden; box-shadow: 0 4px 12px rgba(10,13,18,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #155eef; padding: 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #ffffff; color: #155eef; font-weight: 800; font-size: 15px; padding: 6px 14px; border-radius: 8px; letter-spacing: -0.3px;">
                      PROPLOY
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; line-height: 1.3;">
                      Product Inquiry Received
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #181d27;">
                Hello <strong>${firstName || 'there'}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; color: #535862;">
                Thank you for reaching out to Proploy. A named software procurement specialist has been assigned to inspect your requirement and connect you with the right tool or vetted rollout expert.
              </p>

              <!-- Submission Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #155eef;">
                      Summary of Your Request:
                    </h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; color: #414651;">
                      <tr>
                        <td style="padding: 6px 0; font-weight: 600; width: 110px;">Contact Name:</td>
                        <td style="padding: 6px 0; color: #181d27;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-weight: 600;">Work Email:</td>
                        <td style="padding: 6px 0; color: #181d27;">${email}</td>
                      </tr>
                      ${
                        phone
                          ? `<tr>
                        <td style="padding: 6px 0; font-weight: 600;">Phone:</td>
                        <td style="padding: 6px 0; color: #181d27;">${phone}</td>
                      </tr>`
                          : ''
                      }
                      ${
                        message
                          ? `<tr>
                        <td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Requirement:</td>
                        <td style="padding: 6px 0; color: #181d27; line-height: 1.5;">${message}</td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SLA Banner -->
              <div style="background-color: #eff6ff; border-left: 4px solid #155eef; padding: 14px 16px; border-radius: 4px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #175cd3;">
                  <strong>SLA Guarantee:</strong> Our specialist will review your request and reply within <strong>1 business day</strong>.
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #155eef;">
                    <a href="${catalogUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #155eef;">
                      Browse Live Software Catalog &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #e9eaeb; text-align: center; font-size: 13px; color: #717680; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">
                Need urgent assistance? Reply directly to this email or reach us at <a href="mailto:support@proploy.app" style="color: #155eef; text-decoration: none;">support@proploy.app</a>.
              </p>
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} Proploy Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return { subject, html }
}

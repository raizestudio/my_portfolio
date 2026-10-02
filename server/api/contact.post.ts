// server/api/contact.post.ts
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, subject, message } = body || {}

  // 1. Validation minimale
  if (!email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez remplir tous les champs obligatoires.',
    })
  }

  // 2. Récupération de la clé Nuxt 4
  const config = useRuntimeConfig(event)
  const resendApiKey = config.resendApiKey

  // 3. Fallback dev local (sans clé configurée)
  if (!resendApiKey) {
    console.warn('[Contact API] RESEND_API_KEY absente. Simulation d\'envoi...')
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { success: true, simulated: true }
  }

  // 4. Instanciation et envoi via le SDK Resend
  const resend = new Resend(resendApiKey)

  const { data, error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>', // Remplace par ton domaine vérifié en prod
    to: ['raizetvision@gmail.com'],
    replyTo: email,
    subject: `[Portfolio Contact] ${subject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #0284c7; margin-bottom: 16px;">Nouveau message depuis le portfolio</h2>
        <p><strong>Nom :</strong> ${name || 'Non renseigné'}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
    `,
  })

  if (error) {
    console.error('[Resend Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Échec de l\'envoi de l\'email.',
    })
  }

  return { success: true, id: data?.id }
})

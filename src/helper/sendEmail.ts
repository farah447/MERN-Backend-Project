import nodemailer from 'nodemailer'
import { dev } from '../config'

import { EmailDataType } from '../types/userTypes'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.stmpUsername,
    pass: dev.app.stmpPassword,
  },
})

export const handleSendEmail = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: dev.app.stmpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('message esnt : ' + info.response)
  } catch (error) {
    console.log('error encountered while sende email', error)
    throw error
  }
}

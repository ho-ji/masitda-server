const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async function ({name, email, token}) {
  const resetUrl = `http://localhost:3000/passwordReset/${token}`
  const msg = {
    to: email,
    from: 'masitda.shop@gmail.com',
    subject: '[맛있다] 비밀번호 재설정 안내',

    dynamic_template_data: {
      name: name,
      url: resetUrl,
    },
    template_id: process.env.SENDGRID_TEMPLATE_ID,
  }
  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  sendEmail,
}

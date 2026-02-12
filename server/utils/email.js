import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordEmail = async (email, username, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'IMS Awareness Training - Your Account Credentials',
    html: `
      <div style="font-family: 'Courier New', monospace; background: #000; color: #0f0; padding: 20px; border: 2px solid #0f0;">
        <h1 style="color: #ff0; text-shadow: 2px 2px #f00;">🎮 IMS TRAINING ARCADE 🎮</h1>
        <p>Hi ${username},</p>
        <p>Your account has been approved! Get ready to level up your IMS knowledge.</p>
        <div style="background: #222; padding: 15px; margin: 20px 0; border: 1px solid #0f0;">
          <p><strong style="color: #ff0;">USERNAME:</strong> ${username}</p>
          <p><strong style="color: #ff0;">PASSWORD:</strong> ${password}</p>
        </div>
        <p>⚠️ Please change your password after your first login for security.</p>
        <p style="margin-top: 30px; color: #888;">--- GAME OVER... OR JUST BEGINNING? ---</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};
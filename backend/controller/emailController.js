import "dotenv/config";
import nodemailer from "nodemailer";

const sendEmail = async (req, res) => {
  const { email, password } = req.body;

  const transporter = nodemailer.createTransport({
    auth: {
      pass: process.env.ADMIN_EMAIL_PASSWORD,
      user: process.env.ADMIN_EMAIL,
    },
    service: "Gmail",
  });

  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bank Authentication</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f7fa;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                color: #ffffff;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .content p {
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .credentials {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .credential-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .credential-item:last-child {
                border-bottom: none;
            }
            .credential-label {
                font-weight: 600;
                color: #495057;
            }
            .credential-value {
                color: #1e3c72;
                font-weight: 500;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏦 Bank Authentication</h1>
            </div>
            <div class="content">
                <p>Xin chào,</p>
                <p>Tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:</p>
                <div class="credentials">
                    <div class="credential-item">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">${email}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Mật khẩu:</span>
                        <span class="credential-value">${password}</span>
                    </div>
                </div>
                <p>Vui lòng đăng nhập và đổi mật khẩu ngay lần đầu tiên để bảo mật tài khoản.</p>
            </div>
            <div class="footer">
                <p>© 2024 Bank Management System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    html: emailTemplate,
    subject: "Bank Authentication",
    to: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      emailSend: true,
      message: "Sending Success",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      emailSend: false,
      message: "Sending Failed",
    });
  }
};

export default { sendEmail };

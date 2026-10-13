import { appConfig } from "@/config/app.config";
import nodemailer from "nodemailer";

// Bepul SMTP orqali xat yuborish (masalan Gmail: smtp.gmail.com, 465-port,
// "App password" bilan — oddiy Gmail parol emas). .env dagi SMTP_*
// o'zgaruvchilarni to'ldiring, ko'rsatma uchun .env.template'ga qarang.
//
// SMTP sozlanmagan bo'lsa (masalan lokal dev'da), xat yubormay, kodni
// serverdagi konsolga chiqaramiz — shunda ham oqimni sinab ko'rish mumkin.

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: { user, pass },
  });

  return transporter;
}

async function sendMail(to: string, subject: string, html: string) {
  const t = getTransporter();

  if (!t) {
    // SMTP sozlanmagan — dev rejimida kodni terminalga chiqarib qo'yamiz.
    console.warn(
      `[mailer] SMTP sozlanmagan (.env dagi SMTP_HOST/SMTP_USER/SMTP_PASS). ` +
        `"${to}" ga yuborilishi kerak bo'lgan xat:\n${html}`
    );
    return;
  }

  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(to: string, code: string) {
  await sendMail(
    to,
    `${appConfig.appName} — код подтверждения email`,
    `<div style="font-family:sans-serif;font-size:15px;color:#111">
      <p>Чтобы завершить регистрацию, введите следующий код:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
      <p style="color:#666">Код действителен в течение ${process.env.OTP_TTL_MINUTES ?? 10} минут. Если вы не отправляли этот запрос, просто проигнорируйте это письмо.</p>
    </div>`
  );
}

export async function sendPasswordResetEmail(to: string, code: string) {
  await sendMail(
    to,
    `${appConfig.appName} — код восстановления пароля`,
    `<div style="font-family:sans-serif;font-size:15px;color:#111">
      <p>Чтобы восстановить пароль, введите следующий код:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
      <p style="color:#666">Код действителен в течение ${process.env.OTP_TTL_MINUTES ?? 10} минут. Если вы не отправляли этот запрос, просто проигнорируйте это письмо.</p>
    </div>`
  );
}


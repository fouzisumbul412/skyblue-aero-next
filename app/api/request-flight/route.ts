import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, inquiryDetails } = await req.json();

    if (!firstName || !lastName || !email || !inquiryDetails) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;
    console.log(firstName, lastName, email, inquiryDetails);

    // Email to company

    if (process.env.MAIL_RECEIVER) {
      await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_RECEIVER,
      subject: "New Private Jet Flight Request",
      html: `
        <h2>New Flight Request</h2>
        <p><strong>Passenger Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>

        <h3>Flight Details</h3>
        <p>${inquiryDetails}</p>

        <hr/>
        <p>This request was submitted from the website.</p>
      `,
    });
    }

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Flight Request Has Been Received",
      html: `
      <table width="100%" height="100%" padding="10" cellpadding="0" cellspacing="0" style="background:#0b0b0b;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden">

          <!-- Header -->
          <tr>
            <td style="background:#111;padding:30px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:28px;letter-spacing:2px;">SKYBLUE AVIATION</h1>
              <p style="margin:8px 0 0;color:#aaa;font-size:12px;letter-spacing:3px;">
                PRIVATE JET CONCIERGE
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px">

              <h2 style="margin-top:0;color:#111;font-size:22px;">
                Hello ${firstName},
              </h2>

              <p style="color:#444;line-height:1.6;font-size:15px;">
                Thank you for submitting your private jet flight request.
                Our aviation concierge team is reviewing your details and will
                contact you shortly to finalize the itinerary.
              </p>

              <!-- Request Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;background:#f5f5f5;border-radius:6px">
                <tr>
                  <td style="padding:20px">
                    <p style="margin:0;font-size:13px;color:#777;text-transform:uppercase;letter-spacing:1px">
                      Your Request
                    </p>
                    <p style="margin:10px 0 0;font-size:15px;color:#111;line-height:1.6">
                      ${inquiryDetails}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#444;line-height:1.6;font-size:15px;">
                If your request is urgent, please contact our concierge team directly.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-top:25px">
                <tr>
                  <td style="background:#000;border-radius:4px">
                    <a href="mailto:info@skyblue.aero"
                       style="display:inline-block;padding:12px 22px;color:#fff;text-decoration:none;font-size:14px;letter-spacing:1px;">
                      CONTACT CONCIERGE
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f5;padding:25px;text-align:center;font-size:12px;color:#666">

              <p style="margin:0 0 8px">
                SkyBlue Aviation Concierge
              </p>

              <p style="margin:0">
                concierge@skyblue.aero
              </p>

              <p style="margin:12px 0 0;color:#aaa;font-size:11px">
                © ${new Date().getFullYear()} SkyBlue Aviation. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `,
    });

    return NextResponse.json({
      success: true,
      message: "Flight request sent successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to send request" },
      { status: 500 }
    );
  }
}
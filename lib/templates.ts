export const getUserConfirmationTemplate = (firstName: string, message: string) => `
  <table width="100%" height="100%" padding="10" cellpadding="0" cellspacing="0" style="background:#0b0b0b;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden">
          <tr>
            <td style="background:#111;padding:30px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:28px;letter-spacing:2px;">SKYBLUE AVIATION</h1>
              <p style="margin:8px 0 0;color:#aaa;font-size:12px;letter-spacing:3px;">PRIVATE JET CONCIERGE</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px">
              <h2 style="margin-top:0;color:#111;font-size:22px;">Hello ${firstName},</h2>
              <p style="color:#444;line-height:1.6;font-size:15px;">
                Thank you for contacting Skyblue Aero. Our aviation concierge team has received your request and will contact you shortly.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;background:#f5f5f5;border-radius:6px">
                <tr>
                  <td style="padding:20px">
                    <p style="margin:0;font-size:13px;color:#777;text-transform:uppercase;letter-spacing:1px">Your Request</p>
                    <p style="margin:10px 0 0;font-size:15px;color:#111;line-height:1.6">${message}</p>
                  </td>
                </tr>
              </table>
              <p style="color:#444;line-height:1.6;font-size:15px;">If your request is urgent, please contact our concierge team directly.</p>
              <table cellpadding="0" cellspacing="0" style="margin-top:25px">
                <tr>
                  <td style="background:#000;border-radius:4px">
                    <a href="mailto:info@skyblue.aero" style="display:inline-block;padding:12px 22px;color:#fff;text-decoration:none;font-size:14px;letter-spacing:1px;">CONTACT CONCIERGE</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f5f5;padding:25px;text-align:center;font-size:12px;color:#666">
              <p style="margin:0 0 8px">SkyBlue Aviation Concierge</p>
              <p style="margin:0">concierge@skyblue.aero</p>
              <p style="margin:12px 0 0;color:#aaa;font-size:11px">© ${new Date().getFullYear()} SkyBlue Aviation. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;
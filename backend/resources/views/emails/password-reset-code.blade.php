<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset your Desk+ password</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:#f4f4f5;">
    Your password reset code is {{ $code }}. It expires in {{ $ttlMinutes }} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- black header bar with logo -->
          <tr>
            <td style="background-color:#000000; padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#E02020; width:36px; height:36px; border-radius:8px; text-align:center; vertical-align:middle; color:#ffffff; font-family:Arial,Helvetica,sans-serif; font-weight:900; font-size:15px;">
                    D+
                  </td>
                  <td style="padding-left:12px; color:#ffffff; font-family:Arial,Helvetica,sans-serif; font-weight:800; font-size:18px; letter-spacing:-0.3px; vertical-align:middle;">
                    DESK+
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:40px 32px 16px 32px;">
              <p style="margin:0 0 6px 0; font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#E02020;">
                Password Reset
              </p>
              <h1 style="margin:0 0 16px 0; font-family:Arial,Helvetica,sans-serif; font-size:26px; font-weight:800; color:#111111; line-height:1.2;">
                Here's your code
              </h1>
              <p style="margin:0 0 28px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#52525b; line-height:1.6;">
                Enter this 6-digit code in the app to reset your password. It expires in {{ $ttlMinutes }} minutes.
              </p>
            </td>
          </tr>

          <!-- the code -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#faf9f9; border:1px solid #ececec; border-radius:12px; padding:24px;">
                    <div style="font-family:'Courier New',Courier,monospace; font-size:40px; font-weight:700; letter-spacing:12px; color:#111111; padding-left:12px;">
                      {{ $code }}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- security note -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#faf9f9; border-radius:10px; padding:16px;">
                    <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#71717a; line-height:1.6;">
                      Didn't request this? You can safely ignore this email — your password won't change unless you enter the code above.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- divider -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <div style="height:1px; background-color:#ececec; line-height:1px; font-size:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 32px 36px 32px;">
              <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#a1a1aa; line-height:1.6;">
                Desk+ — premium office furniture.<br>
                This is an automated message, please don't reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /card -->

        <p style="margin:20px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#c4c4c8;">
          &copy; {{ date('Y') }} Desk+. All rights reserved.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>

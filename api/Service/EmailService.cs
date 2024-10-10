using System.Threading.Tasks;
using api.Interface;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit.Text;

namespace api.Service
{
  public class EmailService : IEmailService
  {
    private readonly IConfiguration _configuration;
    public EmailService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public async Task SendEmailAsync(string recipient, string subject, string header, string userName, string message, string actionText, string actionLink)
    {
      var emailMessage = new MimeMessage();
      emailMessage.From.Add(new MailboxAddress("Fresh Farm Fare", "Freshfarmfare@gmail.com"));
      emailMessage.To.Add(new MailboxAddress("", recipient));
      emailMessage.Subject = subject;

      //Email structure
      emailMessage.Body = new TextPart(TextFormat.Html)
      {
        Text = $@"
    <html>
    <body style='font-family: Inter, sans-serif; background-color: #f4f4f4; padding: 40px; margin: 0;'>

      <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);'>
        <!-- Header with Logo -->
        <div style='background-color: rgb(77, 170, 87); padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;'>
          <h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Fresh Farm Fare</h1>
        </div>

        <!-- Body content -->
        <div style='padding: 30px 20px;'>
          <h2 style='color: #2E2E3F; text-align: center; font-size: 24px; margin-bottom: 20px;'>{header}</h2>
          <p style='font-size: 18px; font-weight: 600; color: #2E2E3F; text-align: center;'>{userName},</p>
          <p style='font-size: 16px; color: #4A4A4A; text-align: center; margin: 20px 0px;'>{message}</p>

          <!-- Call-to-action button -->
          <div style='text-align: center; margin-top: 40px;'>
            <a href='{actionLink}' style='font-weight: 600; background: rgb(77, 170, 87); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; display: inline-block; transition: background-color 0.3s;'>
              {actionText}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style='text-align: center; background-color: #f4f4f4; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;'>
          <p style='font-size: 12px; color: #888888;'>TravelMate &copy; {DateTime.Now.Year}</p>
          <p style='font-size: 12px; color: #888888;'>You are receiving this email because you are a registered user of TravelMate.</p>
        </div>
      </div>

    </body>
    </html>"
      };

      using (var client = new SmtpClient())
      {
        // Connect to MailHog SMTP server
        await client.ConnectAsync("localhost", 1025, SecureSocketOptions.None);
        await client.SendAsync(emailMessage);
        await client.DisconnectAsync(true);
      }
    }
  }
}
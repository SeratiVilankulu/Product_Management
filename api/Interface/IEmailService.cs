using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interface
{
  public interface IEmailService
  {
      Task SendEmailAsync(string recipient, string subject, string header, string userName, string message, string actionText, string actionLink);
  }
}
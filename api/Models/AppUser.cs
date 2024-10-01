using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class AppUser
  {
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; } = DateTime.Now;
    public DateTime? VerifiedDate { get; set; }

    public List<UserProduct> UserProduct { get; set; } = new List<UserProduct>();
  }
}
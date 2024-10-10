
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
  public class LoginDto
  {
    // Email of the user logging in
    [Required]
    public string Email { get; set; } = string.Empty;
    // Password that was user to register user
    [Required]
    public string Password { get; set; } = string.Empty;

  }
}

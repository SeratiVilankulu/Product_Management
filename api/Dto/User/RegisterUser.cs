using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.User
{
  public class RegisterUser
  {
    [Required]
    // Name of the user
    public string Name { get; set; } = string.Empty;
    // Surname of the user
    [Required]
    public string Surname { get; set; } = string.Empty;
    // Username of which the user prefers
    [Required]
    public string UserName { get; set; } = string.Empty;
    // Users email
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    // Password of user
    [Required]
    public string Password { get; set; } = string.Empty;
    // Confirmation password to ensure user uses the same password
    [Required]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;
  }
}
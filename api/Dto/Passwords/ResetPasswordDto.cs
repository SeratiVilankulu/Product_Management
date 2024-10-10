using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Passwords
{
  public class ResetPasswordDto
  {
    [Required]
    // The email address of the user requesting the password reset.
    public string AppUserId { get; set; } = string.Empty;
    [Required]
    // The token that was sent to the user's email for password reset verification.
    public string Token { get; set; } = string.Empty;
    [Required]
    [MinLength(8)]
    // The new password that the user wants to set.
    public string NewPassword { get; set; } = string.Empty;
    // Confirmation of the new password.
    public string ConfirmPassword { get; set; } = string.Empty;
  }
}
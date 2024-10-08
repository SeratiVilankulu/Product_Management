using api.Data;
using api.Dto.User;
using api.Dto.ProductSale;
using api.Interface;
using api.Models;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using System.Web;
using api.Dtos.Account;
using api.Dto.Passwords;

namespace api.Controllers
{
  [Route("account")]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly SignInManager<AppUser> _signinManager;
    private readonly IEmailService _emailService;

    public AccountController(ApplicationDBContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailService emailService)
    {
      _context = context;
      _userManager = userManager;
      _tokenService = tokenService;
      _signinManager = signInManager;
      _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUser registerUserDto)
    {
      try
      {
        if (!ModelState.IsValid)
          return BadRequest(ModelState);

        // Check if the email already exists
        var userExist = await _userManager.FindByEmailAsync(registerUserDto.Email.ToLower());

        if (userExist != null)
        {
          return BadRequest("Email already exists.");
        }

        // Creating a new user
        var appUser = new AppUser
        {
          Name = registerUserDto.Name,
          Surname = registerUserDto.Surname,
          UserName = registerUserDto.UserName,
          Email = registerUserDto.Email.ToLower(),
        };

        // Create the user with the specified password
        var createdUser = await _userManager.CreateAsync(appUser, registerUserDto.Password);

        if (createdUser.Succeeded)
        {
          // Generate email confirmation token
          var userEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);

          // Base64 encode the token for URL safety
          var encodedToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(userEmailToken));

          // Generate the confirmation link
          var confirmationLink = Url.Action("EmailConfirmation", "Account",
              new
              {
                userId = appUser.Id,
                token = encodedToken
              },
              Request.Scheme);

          // Prepare email details
          var recipient = appUser.Email;
          var subject = "Verify your email";
          var header = "Welcome";
          var userName = appUser.Name + " " + appUser.Surname;
          var message = "Verify your email address to log in and get started.";
          var actionText = "Verify Email";

          // Send the confirmation email
          try
          {
            await _emailService.SendEmailAsync(recipient, subject, header, userName, message, actionText, confirmationLink);
            return Ok("Successful registration. An email has been sent for verification.");
          }
          catch (Exception)
          {
            return BadRequest("Email could not be sent.");
          }
        }

        var errorMessages = createdUser.Errors.Select(e => e.Description).ToList();
        return BadRequest(new { Errors = errorMessages });
      }
      catch (Exception e)
      {
        // Handle any other unexpected exceptions
        return StatusCode(500, new { Message = "An unexpected error occurred.", Error = e.Message });
      }
    }

    // Send confirmation email
    [HttpGet("email-confirmation")]
    // [Authorize]
    public async Task<IActionResult> EmailConfirmation(string userId, string token)
    {
      // Check for null or empty userId/token
      if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
      {
        return BadRequest("Invalid user ID or token.");
      }

      // Find the user by userId
      var user = await _userManager.FindByIdAsync(userId);
      if (user == null)
      {
        return BadRequest("Invalid email confirmation request: user not found.");
      }

      // Base64 decode the token
      string decodedToken;
      try
      {
        var base64EncodedBytes = Convert.FromBase64String(token);
        decodedToken = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
      }
      catch (FormatException)
      {
        return BadRequest("Invalid token format.");
      }

      // Confirm the user's email
      var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
      if (result.Succeeded)
      {
        // Mark the email as verified
        user.VerifiedDate = DateTime.Now;
        await _context.SaveChangesAsync();

        return Redirect("http://localhost:517/email-success");
      }

      // Handle errors during email confirmation
      var errors = result.Errors.Select(e => e.Description).ToList();
      return BadRequest(new { Message = "Email confirmation failed.", Errors = errors });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

      if (user == null)
        return Unauthorized($"User with this email {loginDto.Email} does not exist");

      var result = await _signinManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: true);

      if (result.Succeeded)
      {
        return Ok(new NewUserDto
        {
          AppUserId = user.Id,
          Name = user.Name,
          Surname = user.Surname,
          UserName = user.UserName,
          Email = user.Email,
          Token = _tokenService.CreateToken(user)
        });
      }
      else if (result.IsLockedOut)
      {
        return BadRequest("Account locked due to multiple failed attempts. Please try after 5 minutes.");
      }
      else if (result.IsNotAllowed)
      {
        return BadRequest("Email has not been verified, please check your email and verify your account.");
      }
      else
      {
        var accessFailedCount = await _userManager.GetAccessFailedCountAsync(user);
        var maxFailedAccessAttempts = _userManager.Options.Lockout.MaxFailedAccessAttempts;
        var attemptsLeft = maxFailedAccessAttempts - accessFailedCount;

        return Unauthorized(new
        {
          message = $"Invalid email or password. You have {attemptsLeft} attempts left."
        });
      }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
      if (!ModelState.IsValid)
        return BadRequest("Invalid email");

      try
      {
        var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
        if (user == null)
          return BadRequest("Email not found");

        var userToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        if (userToken != null)
        {
          var emailResetLink = $"http://localhost:5173/reset-password?token={Uri.EscapeDataString(userToken)}&userId={user.Id}"; // Link which directs user to Reset password page

          var recipient = forgotPasswordDto.Email.ToLower();
          var subject = "Password Reset";
          var header = "Password Reset Request";
          var userName = $"Dear {user.Name + " " + user.Surname}";
          var message = $"We received a request to reset your password. " +
                        $"If you didn't request this, please ignore this email.";
          var actionText = "Reset Password";

          try
          {
            await _emailService.SendEmailAsync(recipient, subject, header, userName, message, actionText, emailResetLink);
          }
          catch (Exception)
          {
            return BadRequest("Unfortunately, this email cannot be sent");
          }

          return Ok("Password reset email was successfully sent!");
        }
      }
      catch (Exception)
      {
        return BadRequest("Something went wrong with generating the reset token, please try again.");
      }

      return BadRequest("Error occurred. Unable to send email");
    }

    //Resetting the users password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
      if (!ModelState.IsValid)
        return BadRequest("Invalid request.");

      // Extract user from the database
      var user = await _userManager.FindByIdAsync(resetPasswordDto.AppUserId);
      if (user == null)
        return BadRequest("Invalid Email");

      // URL-decode the token explicitly
      var decodedToken = Uri.UnescapeDataString(resetPasswordDto.Token);

      // Validate the token (check if the token is expired or invalid)
      var isTokenValid = await _userManager.VerifyUserTokenAsync(
          user,
          _userManager.Options.Tokens.PasswordResetTokenProvider,
          "ResetPassword",
          decodedToken
      );

      if (!isTokenValid)
      {
        return BadRequest("The reset token is invalid or has expired. Please request a new password reset.");
      }

      // Check if the new password is the same as the old password
      var currentPasswordVerification = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, resetPasswordDto.NewPassword);
      if (currentPasswordVerification == PasswordVerificationResult.Success)
      {
        return BadRequest("The new password cannot be the same as the old password.");
      }

      // Proceed to reset the password if the token is valid
      var resetResult = await _userManager.ResetPasswordAsync(user, decodedToken, resetPasswordDto.NewPassword);

      if (!resetResult.Succeeded)
      {
        var errors = resetResult.Errors.Select(e => e.Description);
        return BadRequest(new { message = "Password reset process has failed", errors });
      }

      var backToLogin = Url.Action("http://localhost:5173");
      // Prepare email details
      var recipient = user.Email;
      var subject = "Confirmation on Reset password";
      var header = "Successful password reset";
      var userName = user.Name + user.Surname;
      var message = "This is a confirmation that you have reset your password.";
      var actionText = "Go Back to Login";

      // Send the confirmation email
      try
      {
        await _emailService.SendEmailAsync(recipient, subject, header, userName, message, actionText, backToLogin);
        return Ok("Password has been reset successfully.");
      }
      catch (Exception)
      {
        return BadRequest("Email could not be sent.");
      }
    }
  }
}
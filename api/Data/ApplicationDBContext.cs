using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class ApplicationDBContext : IdentityDbContext<AppUser>
  {

    public ApplicationDBContext(DbContextOptions dbContextOptions)
    : base(dbContextOptions)
    {

    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSale> ProductSales { get; set; }
    public DbSet<UserProduct> UserProducts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<UserProduct>(x => x.HasKey(p => new { p.AppUserId, p.ProductId }));

      builder.Entity<UserProduct>()
        .HasOne(a => a.AppUser)
        .WithMany(a => a.UserProducts)
        .HasForeignKey(p => p.AppUserId);

      builder.Entity<UserProduct>()
        .HasOne(a => a.Product)
        .WithMany(a => a.UserProducts)
        .HasForeignKey(p => p.ProductId);


      List<IdentityRole> role = new List<IdentityRole>
      {
        new IdentityRole
        {
          Name = "Admin",
          NormalizedName= "ADMIN"
        },
        new IdentityRole
        {
          Name = "User",
          NormalizedName = "USER"
        },
      };
    }
  }
}
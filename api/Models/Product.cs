using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  [Table("Products")]
  public class Product
  {
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal SalePrice { get; set; }
    public string Image { get; set; } = string.Empty;

    public List<UserProduct> UserProducts { get; set; } = new List<UserProduct>();
    public List<ProductSale> ProductSales { get; set; } = new List<ProductSale>();
  }
}
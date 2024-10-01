using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Product
  {
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal SalePrice { get; set; }
    public string Image { get; set; } = string.Empty;

    public int? CategoryId { get; set; }
    public Category Category { get; set; }

    public List<UserProduct> UserProduct { get; set; } = new List<UserProduct>();
    public List<ProductSale> ProductSale { get; set; } = new List<ProductSale>();
  }
}
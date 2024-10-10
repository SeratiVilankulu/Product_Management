using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Product
{
  public class ProductDto
  {
    // Product identity number
    public int Id { get; set; }
    // Name of the product
    public string ProductName { get; set; } = string.Empty;
    // Selling price of product
    public decimal SalePrice { get; set; }
    // Image URL of product
    public string Image { get; set; } = string.Empty;
  }
}
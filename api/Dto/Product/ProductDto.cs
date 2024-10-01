using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Product
{
  public class ProductDto
  {

    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal SalePrice { get; set; }
    public string Image { get; set; } = string.Empty;
  }
}
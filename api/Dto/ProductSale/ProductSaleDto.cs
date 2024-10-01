using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.ProductSale
{
  public class ProductSaleDto
  {
    public int SaleId { get; set; }
    public decimal SalePrice { get; set; }
    public int SaleQty { get; set; }
    public DateTime SaleDate { get; set; }
  }
}
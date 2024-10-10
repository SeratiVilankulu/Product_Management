using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.ProductSale
{
  public class ProductSaleDto
  {
    // The identity number of sale made
    public int SaleId { get; set; }
    // Prise at which products where sold
    public decimal SalePrice { get; set; }
    // Total number of products sold
    public int SaleQty { get; set; }
    //Date of when a sale was made
    public DateTime SaleDate { get; set; }
  }
}
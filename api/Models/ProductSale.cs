using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  [Table("ProductSales")]
  public class ProductSale
  {
    [Key]
    public int SaleId { get; set; }
    public decimal SalePrice { get; set; }
    public int SaleQty { get; set; }
    public DateTime SaleDate { get; set; }

    public int? ProductId { get; set; }
    public Product? Product { get; set; }
  }
}
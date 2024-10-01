using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  [Table("UserProducts")]
  public class UserProduct
  {
    public int UserProductId { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }
  }
}
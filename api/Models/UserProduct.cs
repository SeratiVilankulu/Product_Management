using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class UserProduct
  {
    public int UserProductId { get; set; }

    public int ProductId { get; set; }
    public int AppUserId { get; set; }

    public Product Product { get; set; }
    public AppUser AppUser { get; set; }
  }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helper;
using api.Models;

namespace api.Interface
{
  public interface IProductSaleRepository
  {
    Task<List<ProductSale>> GetAllAsync(QueryObject query);
  }
}
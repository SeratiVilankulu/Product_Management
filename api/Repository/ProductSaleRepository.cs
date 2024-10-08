using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helper;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
  public class ProductSaleRepository : IProductSaleRepository
  {
    private readonly ApplicationDBContext _context;
    public ProductSaleRepository(ApplicationDBContext context)
    {
      _context = context;
    }

    public async Task<List<ProductSale>> GetById(QueryObject query)
    {
      var productSales = _context.ProductSales.AsQueryable();

      //Filtering products by the products Id
      if (query.ProductId.HasValue)
      {
        productSales = productSales.Where(p => p.ProductId == query.ProductId.Value);
      }

      return await productSales.ToListAsync();
    }
  }
}
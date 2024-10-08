using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
  public class ProductRepository : IProductRepository
  {
    private readonly ApplicationDBContext _context;
    public ProductRepository(ApplicationDBContext context)
    {
      _context = context;
    }
    public async Task<List<Product>> GetAllAsync()
    {
      return await _context.Products.ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
      return await _context.Products.FindAsync(id);
    }
  }
}
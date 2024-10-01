using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
  [Route("products")]
  [ApiController]
  public class ProductController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly IProductRepository _productRepo;
    public ProductController(ApplicationDBContext context, IProductRepository productRepo)
    {
      _context = context;
      _productRepo = productRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var products = await _productRepo.GetAllAsync();

      var productDto = products.Select(s => s.ToProductDto());

      return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
      var product = await _context.Products.FindAsync(id);

      if (product == null)
      {
        return NotFound();
      }

      return Ok(product.ToProductDto());
    }
  }
}
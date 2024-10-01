using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helper;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
  [Route("product-sales")]
  [ApiController]
  public class ProductSalesController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly IProductSaleRepository _productSaleRepo;
    public ProductSalesController(ApplicationDBContext context, IProductSaleRepository productSaleRepo)
    {
      _context = context;
      _productSaleRepo = productSaleRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var productSales = await _productSaleRepo.GetAllAsync(query);

      var productSaleDto = productSales.Select(s => s.ToProductSaleDto());

      return Ok(productSales);
    }
  }
}
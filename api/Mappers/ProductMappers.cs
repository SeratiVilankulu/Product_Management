using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Product;
using api.Models;

namespace api.Mappers
{
  public static class ProductMappers
  {
    public static ProductDto ToProductDto(this Product productModel)
    {
      return new ProductDto
      {
        Id = productModel.Id,
        ProductName = productModel.ProductName,
        SalePrice = productModel.SalePrice,
        Image = productModel.Image

      };
    }
  }
}
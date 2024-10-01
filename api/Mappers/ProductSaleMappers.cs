using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.ProductSale;
using api.Models;

namespace api.Mappers
{
  public static class ProductSaleMappers
  {
    public static ProductSaleDto ToProductSaleDto(this ProductSale productSaleModel)
    {
      return new ProductSaleDto
      {
        SaleId = productSaleModel.SaleId,
        SalePrice = productSaleModel.SalePrice,
        SaleQty = productSaleModel.SaleQty,
        SaleDate = productSaleModel.SaleDate,
      };
    }
  }
}
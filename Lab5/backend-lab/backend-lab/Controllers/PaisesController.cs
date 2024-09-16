using backend_lab.Handlers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend_lab.Models;

namespace backend_lab.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaisesController : ControllerBase
    {
        private readonly PaisesHandler paisesHandler;

        public PaisesController()
        {
            paisesHandler = new PaisesHandler();
        }

        [HttpGet]
        public List<PaisModel> Get()
        {
            var paises = paisesHandler.ObtenerPaises();
            return paises;
        }

    }
}

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using NUnit.Framework;
using System.Threading;

namespace UIAutomationTests
{
    public class Selenium
    {
        IWebDriver _driver;

        [SetUp]
        public void Setup()
        {
            _driver = new ChromeDriver();
        }

        [Test]
        public void Crear_Pais_Y_Verificar_En_Lista_Test()
        {
            var URL = "http://localhost:8080/";

            _driver.Navigate().GoToUrl(URL);

            _driver.Manage().Window.Maximize();

            // Espera para que la pagina cargue
            Thread.Sleep(500);

            var agregarPaisButton = _driver.FindElement(By.CssSelector("button.btn-outline-secondary"));
            agregarPaisButton.Click();

            var tituloFormulario = _driver.FindElement(By.TagName("h3")).Text;
            Assert.AreEqual("Formulario de creación de países", tituloFormulario);

            _driver.FindElement(By.Id("name")).SendKeys("Chile");
            _driver.FindElement(By.Id("continente")).SendKeys("América");
            _driver.FindElement(By.Id("idioma")).SendKeys("Español");

            _driver.FindElement(By.CssSelector("button.btn-success")).Click();

            // Espera para que la pagina cargue
            Thread.Sleep(500);
            var tablaPaises = _driver.FindElement(By.TagName("table")).Text;
            Assert.IsTrue(tablaPaises.Contains("Chile"), "El país no aparece en la lista de países después de ser agregado.");

            Thread.Sleep(2000);

            _driver.Quit();
        }
    }
}

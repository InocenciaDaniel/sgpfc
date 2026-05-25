///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.ucan.pfc.backend;
//
//import java.io.IOException;
//import java.time.Duration;
//import org.junit.jupiter.api.AfterEach;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.WebElement;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.openqa.selenium.chrome.ChromeOptions;
//import org.openqa.selenium.support.ui.ExpectedConditions;
//import org.openqa.selenium.support.ui.WebDriverWait;
//
///**
// *
// * @author inocencia
// */
//public class LoginTestIT {
//
//    private WebDriver driver;
//
//    @BeforeEach
//    public void setUp() {
//
//        ChromeOptions options = new ChromeOptions();
//        options.addArguments("--remote-allow-origins=*");
//        options.addArguments("--no-sandbox");
//        options.addArguments("--disable-dev-shm-usage");
//        options.addArguments("--headless=new"); // modo invisível!
//        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
//        options.setExperimentalOption("useAutomationExtension", false);
//
//        driver = new ChromeDriver(options);
//        driver.manage().window().maximize();
//    }
//
//    @Test
//    public void testLoginComCredenciaisValidas() throws IOException {
//        System.out.println("Iniciando teste de login...");
//
//        driver.get("http://localhost:3000/login");
//        System.out.println("Página atual: " + driver.getCurrentUrl());
//        System.out.println("Fonte da página: " + driver.getPageSource());
//
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        WebElement emailInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email")));
//        WebElement passwordInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("senha")));
//
////        WebElement emailInput = driver.findElement(By.name("email"));
////        WebElement passwordInput = driver.findElement(By.name("senha"));
//        WebElement submitButton = driver.findElement(By.id("btnLogin"));
//
//        emailInput.sendKeys("danielinocencia@gmail.com");
//        passwordInput.sendKeys("admin1234");
//        submitButton.click();
//        System.out.println("Formulário de login enviado.");
//
//        WebElement dashboardTitle = driver.findElement(By.tagName("h1"));
//        assertEquals("Dashboard", dashboardTitle.getText());
//        System.out.println("Login bem-sucedido! Página do Dashboard carregada.");
//    }
//
//    @AfterEach
//    public void tearDown() {
//        if (driver != null) {
//            driver.quit();
//        }
//        System.out.println("Driver encerrado.");
//    }
//}

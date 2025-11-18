package com.tarea4.tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.tarea4.tarea4.services.AppService;


@Controller
public class AppController {

    private final AppService appService;

    public AppController(AppService appService) {
        this.appService = appService;
    }

    
    @GetMapping("/")
    public String root() {
        return "redirect:/listado";
    }

    // ruta html
    @GetMapping("/listado")
    public String listadoRoute(Model model) {
        model.addAttribute("avisos", appService.getAvisosListado());
        return "listado";
    }
}
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";

@Component({
    selector: "app-sitio-layout",
    imports: [RouterOutlet, Header, Footer],
    template: `
        <div class="sitio" data-bs-theme="dark">
            <app-header />
            <main>
                <router-outlet />
            </main>
            <app-footer />
        </div>
    `
})
export class SitioLayout { }

import { inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, take } from "rxjs";

import { AuthService } from "../services/auth.service";

function cuandoEsteListo<T>(evaluar: (auth: AuthService) => T) {
    const auth = inject(AuthService);

    return toObservable(auth.listo).pipe(
        filter(listo => listo),
        take(1),
        map(() => evaluar(auth))
    );
}

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);

    return cuandoEsteListo(auth => {
        if (!auth.conectado()) {
            return router.createUrlTree(["/login"], { queryParams: { modo: "admin", volver: "/admin" } });
        }

        return auth.esAdmin() ? true : router.createUrlTree(["/"]);
    });
};

export const sesionGuard: CanActivateFn = () => {
    const router = inject(Router);

    return cuandoEsteListo(auth =>
        auth.conectado() ? true : router.createUrlTree(["/login"], { queryParams: { volver: "/mis-pedidos" } })
    );
};
